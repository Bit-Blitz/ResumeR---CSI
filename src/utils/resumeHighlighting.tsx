import React from 'react';

/**
 * Extracts keywords from a job description
 */
export const extractKeywords = (jobDescription: string): string[] => {
  if (!jobDescription) return [];
  
  return jobDescription
    .toLowerCase()
    .split(/[\s,.]+/)
    .filter(w => w.length > 4);
};

/**
 * Highlights keywords in a given text based on the job description
 */
export const highlightKeywords = (text: string, jobDescription: string): string => {
  if (!jobDescription || !text) return text;
  
  const keywords = extractKeywords(jobDescription);
  const uniqueKeywords = [...new Set(keywords)];
  
  let highlightedText = text;
  uniqueKeywords.forEach(keyword => {
    // Escape special characters in keyword for regex
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${escapedKeyword})\\b`, 'gi');
    highlightedText = highlightedText.replace(regex, '<span class="bg-yellow-100 text-yellow-800 px-0.5 rounded">$1</span>');
  });
  
  return highlightedText;
};

/**
 * Highlights both AI changes and job-relevant keywords
 */
export const highlightResumeContent = (
  text: string, 
  jobDescription: string = "", 
  showAIChanges: boolean = false
): React.ReactNode => {
  const textWithKeywords = highlightKeywords(text, jobDescription);
  
  if (!showAIChanges) {
    return <span dangerouslySetInnerHTML={{ __html: textWithKeywords.replace(/\[AI\]|\[\/AI\]/g, "") }} />;
  }
  
  // Split the text by [AI] tags to highlight specific parts
  const parts = textWithKeywords.split(/(\[AI\].*?\[\/AI\])/g);
  
  return parts.map((part, i) => {
    if (part.startsWith("[AI]") && part.endsWith("[/AI]")) {
      const content = part.replace(/\[AI\]|\[\/AI\]/g, "");
      return (
        <span key={i} className="relative inline-block px-1 rounded bg-green-100 text-green-900 border-b-2 border-green-500 font-medium">
          <span dangerouslySetInnerHTML={{ __html: content }} />
          <span className="absolute -top-3 left-0 text-[8px] font-black capitalize text-green-600 tracking-tighter">AI-Improved</span>
        </span>
      );
    }
    return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
  });
};
