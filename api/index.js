// Load environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Groq from "groq-sdk";

// Import routes using ESM
import analysisRoutes from "./routes/analysis.js";
import parsingRoutes from "./routes/parsing.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

// Attach Groq to app for use in routes
app.set("groq", groq);

// --- STARTUP-GRADE MIDDLEWARE (Security & Scalability) ---
const rateLimit = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Increased for production stability

const securityMiddleware = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.ip; // Vercel uses x-forwarded-for
  const now = Date.now();

  // 1. Rate Limiting (Note: In-memory resets on Vercel redeploys/cold starts)
  if (!rateLimit[ip]) {
    rateLimit[ip] = { count: 1, startTime: now };
  } else {
    if (now - rateLimit[ip].startTime > RATE_LIMIT_WINDOW) {
      rateLimit[ip] = { count: 1, startTime: now };
    } else {
      rateLimit[ip].count++;
    }
  }

  if (rateLimit[ip].count > MAX_REQUESTS) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - rateLimit[ip].startTime)) / 1000)
    });
  }

  // 2. Request Logging
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${ip}`);

  next();
};

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(securityMiddleware);

// Use routes
app.use("/api", analysisRoutes);
app.use("/api/parsing", parsingRoutes);

// Root path for health checks
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "ResumeR API is operational" });
});

// --- STRUCTURED ERROR HANDLING ---
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url}:`, err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "An unexpected error occurred",
    type: err.type || "INTERNAL_ERROR",
    timestamp: new Date().toISOString()
  });
};

app.use(errorHandler);

// Only listen if not running as a Vercel function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless (using ESM export default)
export default app;
