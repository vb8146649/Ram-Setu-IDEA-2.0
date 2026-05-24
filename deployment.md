# BankAI Kiosk Deployment Guide (100% Free Tier)

This guide provides step-by-step instructions to deploy the RamSetu BankAI Kiosk online for completely free using Render (for the Node.js backend) and Vercel/Netlify (for the React/Vite frontend). We also cover setting up the Cohere and Groq APIs.

---

## 1. Get Your Free API Keys

You need API keys for the AI capabilities:
1. **Cohere API Key (LLM / RAG):**
   - Go to [dashboard.cohere.com](https://dashboard.cohere.com/)
   - Sign up for a free account.
   - Go to "API Keys" and generate a Trial Key. (Free up to 1,000 calls/month).
2. **Groq API Key (Fast Speech-to-Text):**
   - Go to [console.groq.com](https://console.groq.com/)
   - Sign up and generate an API key. (Generous free tier for Whisper-large-v3).

---

## 2. Deploying the Backend (Node.js) on Render

We will use Render's Free Web Service tier.

1. Go to [Render.com](https://render.com) and sign in with GitHub.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository containing this code.
4. Fill in the deployment details:
   - **Name:** `bankai-backend`
   - **Root Directory:** `backend` (Important!)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Environment Variables**: Click "Advanced" and add the following:
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-frontend-url.vercel.app` (You will update this later after deploying the frontend)
   - `COHERE_API_KEY`: `your_cohere_key_here`
   - `GROQ_API_KEY`: `your_groq_key_here`
6. Click **Create Web Service**. Wait for the deployment to finish and copy the backend URL (e.g., `https://bankai-backend.onrender.com`).

> **Note on Render Free Tier**: The backend will spin down after 15 minutes of inactivity. The first request after a period of inactivity may take ~50 seconds to wake up.

---

## 3. Deploying the Frontend (React/Vite) on Vercel

1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` (Click Edit to change this to `frontend`)
5. **Environment Variables**:
   - `VITE_API_URL`: Paste the URL from your Render backend deployment (e.g., `https://bankai-backend.onrender.com`).
6. Click **Deploy**.

---

## 4. Final Setup

1. Once the frontend is deployed on Vercel, copy its URL.
2. Go back to your Render Dashboard for the backend.
3. Edit the Environment Variables and update `FRONTEND_URL` to match your exact Vercel URL (e.g., `https://bankai-frontend.vercel.app`). This is required for CORS to allow the frontend to communicate with the backend.
4. Restart the Render Web Service.

You're done! Visit your Vercel URL to use the fully deployed BankAI Kiosk.
