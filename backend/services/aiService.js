// =============================================================
// AI Orchestrator Service — Multi-language support (12 languages)
// =============================================================
const bankingService = require("./bankingService");
const { appendTurn, getSession } = require("../models/session");

// ── Language Detection ────────────────────────────────────────
const SCRIPT_PATTERNS = {
  hi: /[\u0900-\u097F]/, // Devanagari (Hindi, Marathi)
  bn: /[\u0980-\u09FF]/, // Bengali
  ta: /[\u0B80-\u0BFF]/, // Tamil
  te: /[\u0C00-\u0C7F]/, // Telugu
  kn: /[\u0C80-\u0CFF]/, // Kannada
  ml: /[\u0D00-\u0D7F]/, // Malayalam
  gu: /[\u0A80-\u0AFF]/, // Gujarati
  pa: /[\u0A00-\u0A7F]/, // Punjabi / Gurmukhi
  or: /[\u0B00-\u0B7F]/, // Odia
  ur: /[\u0600-\u06FF]/, // Arabic script (Urdu)
};

const HINDI_KEYWORDS = [
  "nahi",
  "mujhe",
  "mera",
  "meri",
  "paisa",
  "khata",
  "shikayat",
  "kripya",
  "namaste",
  "dhanyawad",
  "bakaya",
];
const MARATHI_KEYWORDS = ["mala", "mazha", "tumcha", "ahe", "nahi", "khate"];

const detectLanguage = (text = "", hint = null) => {
  // Prefer explicit language hint from client (selected language)
  if (hint && hint !== "en") return hint;
  // Script-based detection
  for (const [lang, pattern] of Object.entries(SCRIPT_PATTERNS)) {
    if (pattern.test(text)) return lang;
  }
  // Keyword fallback
  const lower = text.toLowerCase();
  if (HINDI_KEYWORDS.some((kw) => lower.includes(kw))) return "hi";
  return "en";
};

// ── Intent Detection ─────────────────────────────────────────
const INTENT_MAP = [
  {
    intent: "balance",
    keywords: [
      "balance",
      "bakaya",
      "kitna",
      "how much",
      "account balance",
      "check balance",
      "check my balance",
      "paisa kitna",
      "shillak",
      "bakiye",
      "remaining",
    ],
  },
  {
    intent: "statement",
    keywords: [
      "statement",
      "transactions",
      "history",
      "mini statement",
      "last transaction",
      "passbook",
      "show mini",
      "vivara",
      "hakku",
    ],
  },
  {
    intent: "block_card",
    keywords: [
      "block my card",
      "block card",
      "card block",
      "lost card",
      "stolen card",
      "debit block",
      "block my",
      "my card",
      "band karo",
      "card band",
      "block karo",
      "card lost",
      "card stolen",
    ],
  },
  {
    intent: "loan",
    keywords: [
      "loan",
      "home loan",
      "personal loan",
      "vehicle loan",
      "education loan",
      "emi",
      "borrow",
      "karz",
      "karzu",
      "qarz",
      "apply for loan",
      "want loan",
      "need loan",
    ],
  },
  {
    intent: "complaint",
    keywords: [
      "complaint",
      "file complaint",
      "problem",
      "issue",
      "not working",
      "wrong",
      "error",
      "shikayat",
      "pareshaani",
      "taqleef",
    ],
  },
  {
    intent: "fraud",
    keywords: [
      "fraud",
      "scam",
      "unauthorized",
      "hacked",
      "stolen money",
      "dhoka",
      "chori",
      "suspicious",
      "farzi",
      "thagi",
    ],
  },
  {
    intent: "escalate",
    keywords: [
      "angry",
      "frustrated",
      "useless",
      "terrible",
      "worst",
      "human",
      "talk to agent",
      "agent",
      "manager",
      "not satisfied",
      "pathetic",
      "gussa",
      "naraaz",
    ],
  },
  {
    intent: "greeting",
    keywords: [
      "hello",
      "hi",
      "hey",
      "namaste",
      "vanakkam",
      "namaskar",
      "sat sri akal",
      "good morning",
      "help",
      "i need help",
    ],
  },
  {
    intent: "farewell",
    keywords: [
      "bye",
      "goodbye",
      "thank you",
      "thanks",
      "dhanyawad",
      "nandri",
      "shukriya",
      "alvida",
    ],
  },
];

const detectIntent = (text = "") => {
  const lower = text.toLowerCase();
  for (const { intent, keywords } of INTENT_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) return intent;
  }
  return "unknown";
};

// ── Escalation Trigger ────────────────────────────────────────
const ESCALATION_INTENTS = new Set(["fraud", "escalate", "complaint"]);
const shouldEscalate = (intent) => ESCALATION_INTENTS.has(intent);

// ── Groq LLM Integration ────────────────────────────────────────
const Groq = require('groq-sdk');
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy',
});

// ── Main Orchestrator ─────────────────────────────────────────
const buildResponse = async (
  text,
  customerId,
  sessionId,
  overrideLang = null,
) => {
  const language = detectLanguage(text, overrideLang);
  const intent = detectIntent(text);
  const escalate = shouldEscalate(intent);

  let message = "";
  let apiData = null;

  try {
    // 1. Fetch relevant banking data based on intent
    switch (intent) {
      case "balance":
        apiData = bankingService.getBalance(customerId);
        break;
      case "statement":
        apiData = bankingService.getMiniStatement(customerId);
        break;
      case "block_card":
        apiData = bankingService.blockCard(customerId);
        break;
      case "loan":
        apiData = bankingService.applyLoan(customerId, {
          loanType: "personal",
          amount: 500000,
        });
        break;
    }

    // 2. Construct Prompt for Groq LLM
    const systemPrompt = `You are RamSetu, an AI banking assistant. You are helping a user.
The user's detected intent is: ${intent}.
If the intent requires data, here is the data from the banking API: ${apiData ? JSON.stringify(apiData) : 'None'}.
If the intent is 'fraud', 'escalate', or 'complaint', inform them that they are being escalated to a human agent immediately.
IMPORTANT: You MUST respond in the following language code: ${language}.
Keep your response concise, polite, and directly address their query using the provided data if applicable. Do not use markdown.`;

    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      model: 'llama-3.3-70b-versatile',
    });

    message = response.choices[0].message.content;

  } catch (err) {
    console.error("[aiService] Error building response with Groq:", err.message);
    message = "A technical error occurred while contacting the AI. Please try again.";
  }

  const session = getSession(sessionId);
  const summary = session
    ? `Customer asked ${session.turns.length} question(s). Last intent: ${intent}. Message: "${text.substring(0, 100)}"`
    : `Customer message: "${text.substring(0, 100)}"`;

  if (sessionId) appendTurn(sessionId, text, message, intent);

  return {
    message,
    intent,
    escalate,
    summary,
    language,
    apiData,
    timestamp: new Date().toISOString(),
  };
};

module.exports = {
  detectLanguage,
  detectIntent,
  buildResponse,
  shouldEscalate,
};
