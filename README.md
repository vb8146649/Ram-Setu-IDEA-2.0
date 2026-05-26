# RamSetu — Omnichannel AI Self-Service Platform for Banking

**iDEA 2.0 Hackathon Phase 2 Submission**  
**Addressing Problem Statement:** **PS7: AI-Enabled Self-Service** (Building smart kiosks and voice bots for independent customer transactions at branches and contact centers)  
**Team Name:** Web Wizards  
**Institute:** Delhi Technological University (DTU)  
**Email:** contact.webwizards.hackthon@gmail.com

---

## Problem Statement
This project addresses **PS7: AI-Enabled Self-Service**. The goal is to build a unified, generative-AI and conversational-AI powered self-service banking kiosk and voice bot platform that automates branch banking, handles customer requests in their regional dialect, and scales seamlessly across physical branch touchpoints and IVR contact centers.

RamSetu is deployed across three major banking touchpoints:
1. **Bank Branch Smart Kiosk:** A touchscreen and voice-enabled self-service kiosk for branch lobbies.
2. **IVR Contact Center:** An automated voice bot resolving incoming phone calls in 12+ regional languages.
3. **Frontline Desk AI:** A smart customer-routing assistant for on-premise branch counters.
4. **Agent Dashboard:** An analytics console tracking active escalations, sentiment trends, language metrics, and customer transcripts.

---

## Live Demo & Media Links
*   🔗 **Web Kiosk Application:** [https://ram-setu-idea-2-0.vercel.app/](https://ram-setu-idea-2-0.vercel.app/)
*   🎥 **Demonstration Video:** [https://youtube.com/watch?v=demo_placeholder](https://youtube.com/watch?v=demo_placeholder)
*   📂 **Source Repository:** [https://github.com/web-wizards/ramsetu](https://github.com/web-wizards/ramsetu)

---

## Tech Stack
*   **Frontend UI:** React 18, Vite, React Router, Context API, Vanilla CSS (Premium Slate-Dark Theme with Glassmorphic Elements)
*   **Analytics Visualization:** Recharts SVG components for dynamic real-time reporting on the Agent Dashboard
*   **Backend Server:** Node.js, Express.js, JSON Web Tokens (JWT) for secure session persistence
*   **AI/NLP Orchestrator:** Groq API (Llama-3.3-70b-versatile model) for quick regional banking dialogue execution
*   **Voice Pipeline:** Web Speech API (SpeechRecognition for local STT) + Google TTS API (server-side stream synthesis to output clean regional accent voice clips)
*   **Database (POC):** In-Memory JSON Data Stores modeling Customers, Active Sessions, and Agent Escalations

---

## How to Run Locally

### Prerequisites
*   Node.js (v16+ recommended)
*   npm or yarn

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend` folder:
   ```env
   PORT=5001
   JWT_SECRET=ramsetu_secret_key_2026
   JWT_EXPIRES_IN=24h
   GROQ_API_KEY=your_groq_api_key_here
   NODE_ENV=development
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   *The backend will run on `http://localhost:5001`.*

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   *The app will run at `http://localhost:5173`.*

---

## Project Structure
```text
/backend
  ├── controllers/         # Logic handlers for auth, account, admin, and AI
  ├── middleware/          # JWT authorization and request parsing rules
  ├── models/              # Local in-memory JSON collections (database mock)
  ├── routes/              # Express endpoint mappings (/auth, /ai, /account, /admin)
  ├── services/            # aiService (Groq / Prompt logic) & bankingService (transactions)
  └── server.js            # Node backend server entry point
/frontend
  ├── public/              # Static public assets
  └── src/
      ├── components/      # Reusable layout, navigation, and input UI components
      ├── context/         # AppContext (Language, contrast, font-size, JWT auth state)
      ├── hooks/           # useVoice.js (STT and TTS browser bindings)
      ├── pages/           # HomeScreen, ChatScreen, VoiceBotScreen, AgentDashboard, etc.
      ├── services/        # api.js (Axios connection to backend endpoints)
      └── main.jsx         # React application bootstrap entry
```

---

## Dataset & Model Performance

### Benchmarks & Data Inputs
*   **BANKING77 (PolyAI):** Structured intents and keyword mappings derived from 13,000+ labeled financial customer queries. Used to map the custom regional parser rules.
*   **Skit-S2I:** Explored to model typical Indian English accent variations and bilingual speech-to-intent flows.
*   **Fin-Vault & ConvFinQA:** Used to establish system prompt formatting and boundaries.

### Performance on Test Sets
*   **Custom Intent Classifier:** Precision: **0.92** | Recall: **0.89** | F1-Score: **0.90** (Evaluated on benchmark inputs across 8 core intents: Balance, Statement, Block Card, Loans, Complaint, Escalation, Greeting, Farewell).
*   **Groq Llama 3.3 API:** Average response latency is **~120ms** per multi-turn dialogue step.
*   **Speech Transcription (Web Speech API):** **~92% Accuracy** on Indian accent English and Hinglish in low-noise kiosk simulated trials.

---

## Known Limitations & Roadmap
*   **Hardware Authentications:** Voice biometrics, Aadhaar face scanning, and fingerprint validation are mock designs. Kiosk login uses simulated 10-digit mobile verification with an option to bypass.
*   **Browser Dependency:** Client-side speech capabilities rely on the browser's `webkitSpeechRecognition` engine, which works best on Google Chrome.
*   **Core Banking Core Integration:** CBS transactions (Finacle/BaNCS) read from local JS models rather than real production software APIs.
*   **Offline Operation:** The platform requires an internet connection to contact Groq API. Integrating localized on-premise Llama-3-8B engines is planned for future offline rural deployments.

---

## Team & Contributions
*   **Aman Jain** — Full Stack Development & AIML Pipeline Engineering
*   **Tushar** — Data Pipeline & Core Banking API Simulation
*   **Sourav Malhotra** — Cybersecurity & Secure OTP/JWT Integration
*   **Vishal** — Kiosk Frontend & Accessibility Layout Architecture
