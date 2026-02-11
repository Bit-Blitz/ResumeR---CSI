# Developer Setup Guide - urCV.ai

Welcome to the **urCV.ai** development guide! This document will help you get the project up and running on your local machine.

## 📋 Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **API Keys**: You will need Groq and Google Gemini API keys (see below)

---

## 🔑 Obtaining API Keys

### 1. Groq API Key (Backend AI)
Used for high-speed resume parsing, ATS analysis, and interview question generation.
1. Visit [Groq Console](https://console.groq.com/keys).
2. Create a free account or sign in.
3. Click on **API Keys** and then **Create API Key**.
4. Copy the key for use in your `.env` file.

### 2. Google Gemini API Key (Frontend Career Counselor)
Used for the AI-powered career counselor chat.
1. Visit [Google AI Studio](https://ai.google.dev/).
2. Click on **Get API key**.
3. Create a new API key in a new or existing project.
4. Copy the key for use in your `.env` file.

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd urCV.ai-main
```

### 2. Environment Configuration
Copy the template environment file and fill in your keys:
```bash
cp .env.example .env
```
Edit `.env` and paste your API keys:
```env
GROQ_API_KEY=gsk_...
VITE_GEMINI_API_KEY=AIza...
```

### 3. Install Dependencies
Install both frontend and backend dependencies:
```bash
# Install frontend dependencies (Root folder)
npm install

# Install backend dependencies
cd src/api
npm install
cd ../..
```

---

## 🏃 Running the Application

You need to run **both** the frontend and the backend servers.

### Start the Backend Server
```bash
cd src/api
npm start
```
The backend will run on `http://localhost:3001`.

### Start the Frontend Development Server
Open a **new terminal** and run:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173` (or the port shown in your terminal).

---

## 🧪 Testing the Setup

1. **Resume Parsing**: Go to the "Builder" section, upload a PDF/DOCX resume, and verify that your details are extracted correctly.
2. **ATS Analysis**: In the "Analysis" tab of the builder, click "Analyze Resume" with a sample job description.
3. **Career Counselor**: Click the chat icon to talk to the AI career counselor.

---

## 🛠️ Troubleshooting

- **"Failed to extract resume data"**: 
  - Ensure the backend server is running (`src/api`).
  - Verify your `GROQ_API_KEY` is correct in `.env`.
  - Check the backend console for specific error messages.
- **"API Key missing" in Chat**: 
  - Ensure `VITE_GEMINI_API_KEY` is set in `.env`.
  - Restart the frontend development server (`npm run dev`) after changing environment variables.
- **CORS Errors**: 
  - The backend is configured to allow requests from common dev ports. If you are using a non-standard port, update `cors()` in `src/api/index.js`.
