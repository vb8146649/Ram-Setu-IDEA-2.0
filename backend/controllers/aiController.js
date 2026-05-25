// =============================================================
// AI Chat Controller
// =============================================================
const { buildResponse } = require('../services/aiService');
const { createSession, getSession } = require('../models/session');
const { v4: uuidv4 } = require('uuid');

const fs = require('fs');
if (!globalThis.File) {
  const { File } = require('node:buffer');
  globalThis.File = File;
}
const Groq = require('groq-sdk');
const googleTTS = require('google-tts-api');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy' });

const chat = async (req, res) => {
  const { message, sessionId, language } = req.body;
  const { customerId } = req.user;

  if (!message || message.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  const sid = sessionId || uuidv4();
  if (!getSession(sid)) {
    createSession(sid, customerId, language || 'en');
  }

  try {
    const response = await buildResponse(message.trim(), customerId, sid, language);
    return res.json({ success: true, sessionId: sid, ...response });
  } catch (err) {
    console.error('[AI Chat Error]', err);
    return res.status(500).json({ success: false, message: 'AI service temporarily unavailable' });
  }
};

const voiceChat = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Audio file is required' });
  }
  
  const { sessionId, language } = req.body;
  const { customerId } = req.user;
  const sid = sessionId || uuidv4();
  
  if (!getSession(sid)) {
    createSession(sid, customerId, language || 'en');
  }

  try {
    // 1. STT (Groq Whisper)
    const transcription = await groq.audio.transcriptions.create({
      file: await Groq.toFile(fs.createReadStream(req.file.path), req.file.originalname || 'recording.webm'),
      model: "whisper-large-v3",
      response_format: "json",
    });
    const userText = transcription.text;
    console.log(`[STT Transcription] User Spoke: "${userText}"`);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // 2. LLM Processing (Groq via aiService)
    const response = await buildResponse(userText, customerId, sid, language);
    console.log(`[LLM Response] Assistant Replied: "${response.message}" (Language: ${response.language})`);
    
    // 3. TTS (Google TTS)
    // Fallback language code logic for Google TTS
    const langCodeMap = { hi: 'hi', bn: 'bn', ta: 'ta', te: 'te', kn: 'kn', ml: 'ml', mr: 'mr', gu: 'gu', pa: 'pa', ur: 'ur', or: 'or', en: 'en' };
    const ttsLang = langCodeMap[response.language] || 'en';
    
    let audioBase64 = null;
    try {
      const ttsResults = await googleTTS.getAllAudioBase64(response.message, {
        lang: ttsLang,
        slow: false,
        host: 'https://translate.google.com',
        timeout: 10000,
      });
      const buffers = ttsResults.map(r => Buffer.from(r.base64, 'base64'));
      const combinedBuffer = Buffer.concat(buffers);
      audioBase64 = combinedBuffer.toString('base64');
    } catch (e) {
      console.error("TTS Error with getAllAudioBase64:", e);
      try {
        audioBase64 = await googleTTS.getAudioBase64(response.message.substring(0, 200), {
          lang: ttsLang,
          slow: false,
          host: 'https://translate.google.com',
        });
      } catch (err) {
        console.error("TTS Fallback Error:", err);
      }
    }

    return res.json({
      success: true,
      sessionId: sid,
      userText,
      audioData: audioBase64 ? `data:audio/mp3;base64,${audioBase64}` : null,
      ...response
    });

  } catch (err) {
    console.error('[AI Voice Error]', err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({ success: false, message: 'Voice service temporarily unavailable' });
  }
};

module.exports = { chat, voiceChat };
