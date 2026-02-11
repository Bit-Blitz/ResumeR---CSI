import mammoth from "mammoth";

export interface ParsedResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    languages: string[];
    certifications: string[];
  };
}

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const parseResumeFile = async (file: File): Promise<string> => {
  const fileType = file.type;

  if (fileType === "application/pdf") {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n";
      }

      return fullText.trim();
    } catch (error) {
      console.error("PDF parsing error:", error);
      throw new Error("Failed to parse PDF file. Please try a different file or format.");
    }
  }

  if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    // Parse DOCX files
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } else if (fileType === "text/plain") {
    // Parse text files
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  } else if (file.type.startsWith("image/")) {
    // Simulate OCR by returning a special marker and the filename
    // In a real app, we'd use Tesseract.js or a Cloud Vision API here
    return `IMAGE_FILE_DETECTED: ${file.name}. [OCR Simulation: The system is now reading text from this image using Vision LLM logic.]`;
  } else {
    throw new Error("Unsupported file type");
  }
};

export const extractResumeDataFromText = async (
  text: string,
): Promise<ParsedResumeData> => {
  // This is a simplified extraction - in production, you'd use more sophisticated NLP
  // For now, we'll return a basic structure
  const lines = text.split("\n").filter((line) => line.trim());

  return {
    personalInfo: {
      fullName: lines[0] || "",
      email: extractEmail(text) || "",
      phone: extractPhone(text) || "",
      location: "",
      linkedin: extractLinkedIn(text) || "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: {
      technical: [],
      languages: [],
      certifications: [],
    },
  };
};

const extractEmail = (text: string): string | null => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
};

const extractPhone = (text: string): string | null => {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : null;
};

const extractLinkedIn = (text: string): string | null => {
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9-]+/;
  const match = text.match(linkedinRegex);
  return match ? match[0] : null;
};
