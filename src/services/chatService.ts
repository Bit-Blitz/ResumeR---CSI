// src/services/chatService.ts
import { Groq } from "groq-sdk";

const API_BASE_URL = "/api";

export const sendMessageToBot = async (
  message: string,
  resumeData?: any,
  jobDescription?: string
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, resumeData, jobDescription }),
    });

    if (!response.ok) throw new Error("Chat backend failed");
    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again in a moment!";
  }
};