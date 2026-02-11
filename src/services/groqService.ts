// Frontend service to interact with the backend API
// This moves all AI logic to the server-side to secure API keys and unify processing.

const API_BASE_URL = "/api";

export interface ResumeAnalysis {
  score: number;
  matchReasoning: string;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  semanticRelevancy: {
    score: number;
    gapAnalysis: string;
  };
  impactDensity: {
    score: number;
    highlightedSections: string[];
  };
  atsCompatibility: {
    score: number;
    issues: string[];
  };
  agentCritiques?: {
    recruiter: string;
    ghostwriter: string;
    parser: string;
  };
  benchmarkExamples?: Array<{
    company: string;
    role: string;
    reason: string;
    highlight: string;
  }>;
  skillPlacements?: Array<{
    skill: string;
    reason: string;
    suggestedSection: string;
    targetBulletPoint?: string;
  }>;
  certification?: {
    status: string;
    badge: string;
    vulnerabilityCount: number;
  };
}

export interface InterviewQuestion {
  question: string;
  intent: string;
  hint: string;
}

export interface EnhancedResumeData {
  personalInfo: any;
  experience: any[];
  education: any[];
  skills: any;
  hobbies?: string[];
  codingProfiles?: any;
}

export const analyzeResume = async (
  resumeData: any,
  jobDescription: string = "",
  targetCompany: string = "",
  targetATS: string = ""
): Promise<ResumeAnalysis> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeData, jobDescription, targetCompany, targetATS }),
    });

    if (!response.ok) throw new Error("Backend analysis failed");
    return await response.json();
  } catch (error) {
    console.error("Error analyzing resume:", error);
    // Fallback logic if backend is down
    return {
      score: 50,
      atsCompatibility: { score: 70, issues: ["Backend connection issue"] },
      strengths: ["Contact information is present"],
      improvements: ["Backend connection issue - analysis is limited"],
      matchReasoning: "Unable to connect to analysis server.",
      missingKeywords: [],
      semanticRelevancy: { score: 50, gapAnalysis: "Connection lost" },
      impactDensity: { score: 50, highlightedSections: [] }
    };
  }
};

export const ghostwriteResume = async (
  resumeData: any,
  missingKeywords: string[],
  targetATS: string = ""
): Promise<EnhancedResumeData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ghostwrite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeData, missingKeywords, targetATS }),
    });

    if (!response.ok) throw new Error("Backend ghostwrite failed");
    return await response.json();
  } catch (error) {
    console.error("Error ghostwriting resume:", error);
    return resumeData;
  }
};

export const parseResumeFastTrack = async (
  rawText: string,
  isImage: boolean = false
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/parsing/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawText, isImage }),
    });

    if (!response.ok) throw new Error("Backend fast-track parsing failed");
    return await response.json();
  } catch (error) {
    console.error("Error in fast-track parsing:", error);
    throw error;
  }
};

export const enhanceResume = async (
  resumeData: any,
  targetATS: string = ""
): Promise<EnhancedResumeData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/enhance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeData, targetATS }),
    });

    if (!response.ok) throw new Error("Backend enhancement failed");
    return await response.json();
  } catch (error) {
    console.error("Error enhancing resume:", error);
    return resumeData;
  }
};

export const generateInterviewQuestions = async (
  resumeData: any,
  jobDescription: string
): Promise<InterviewQuestion[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/interview-prep`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeData, jobDescription }),
    });

    if (!response.ok) throw new Error("Backend interview prep failed");
    return await response.json();
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return [];
  }
};

export const extractResumeDataWithAI = async (
  resumeText: string,
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: resumeText }),
    });

    if (!response.ok) throw new Error("Backend extraction failed");
    return await response.json();
  } catch (error) {
    console.error("Error extracting resume data:", error);
    throw error;
  }
};

export const chatWithAI = async (
  message: string,
  context?: string,
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context }),
    });

    if (!response.ok) throw new Error("Backend chat failed");
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error in chat:", error);
    return "I'm having trouble connecting to my brain (the backend). Is the server running?";
  }
};
