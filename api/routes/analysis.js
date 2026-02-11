import express from "express";
const router = express.Router();

// Helper to clean JSON from AI response
const cleanJsonResponse = (response) => {
  let cleaned = response.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  cleaned = cleaned.replace(/^`+|`+$/g, "").trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  const firstBracket = cleaned.indexOf("[");
  const lastBracket = cleaned.lastIndexOf("]");

  // Determine if it's an object or an array based on which comes first
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    if (lastBracket !== -1) {
      cleaned = cleaned.substring(firstBracket, lastBracket + 1);
    }
  } else if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
};

router.post("/analyze", async (req, res, next) => {
  const { resumeData, jobDescription, targetCompany, targetATS } = req.body;
  const groq = req.app.get("groq");

  if (!resumeData) return res.status(400).json({ error: "Missing resume data" });

  try {
    let companyContext = "";
    if (targetCompany === "Google") {
      companyContext = "Focus on 'Googliness', scale, complexity, and data-driven impact. Google values technical depth and leadership.";
    } else if (targetCompany === "Meta") {
      companyContext = "Focus on 'Move Fast', product impact, and full-stack ownership. Meta values engineers who understand the business impact of their code.";
    } else if (targetCompany === "Goldman Sachs") {
      companyContext = "Focus on precision, risk management, security, and high-performance systems. Goldman values stability and professional excellence.";
    }

    const atsContext = targetATS ? `Targeting ${targetATS} parsing logic.` : "Targeting standard modern ATS parsing.";

    const prompt = `YOU ARE THE HEAD OF A PROFESSIONAL CAREER COMMITTEE. 
    YOUR GOAL: PROVIDE AN OBJECTIVE AND THOROUGH ANALYSIS OF THE CANDIDATE'S FIT FOR THE TARGET ROLE.

    COMMITTEE MEMBERS & ROLES:

    AGENT 1 (THE RECRUITER): 
    - Critique alignment with ${targetCompany || "top-tier tech"} standards. 
    - ${companyContext}
    - Look for "impact gaps" and identify where data-driven results can be strengthened.
    - Identify vague claims and suggest more impactful terminology.

    AGENT 2 (THE CONTENT STRATEGIST): 
    - Identify missing high-value keywords from the Job Description. 
    - Propose specific, natural integrations that maintain professional integrity.
    - Focus on "Semantic Bridge" phrases that connect candidate experience to JD requirements.

    AGENT 3 (THE COMPLIANCE AUDITOR): 
    - Simulate ${targetATS || "Workday/Greenhouse/Lever/Taleo/iCIMS"} parsing logic. 
    - Identify formatting improvements (multi-column risks, special character considerations).
    - Flag potential parsing issues in headers/footers.
    - Specific logic for ${targetATS || "modern ATS"}: ${targetATS === 'Workday' ? 'Workday prioritizes skills-to-job-title mapping.' : targetATS === 'Greenhouse' ? 'Greenhouse emphasizes structured skill blocks.' : 'Generic keyword frequency and section hierarchy.'}

    AGENT 4 (THE BENCHMARK ANLAYST): 
    - Compare this resume against high-performing profiles in ${targetCompany || "top tech companies"}. 
    - Provide 2 specific "Benchmark Examples" of how to describe similar experience for maximum impact.

    RESUME DATA:
    ${JSON.stringify(resumeData, null, 2)}

    JOB DESCRIPTION:
    ${jobDescription || "Not provided (provide a general competitive analysis)"}

    INSTRUCTIONS FOR OUTPUT:
    1. Be professional and objective.
    2. Provide a score that reflects the probability of passing the initial automated screen.
    3. 'skillPlacements' MUST be specific. If suggesting a skill, find the exact bullet point in 'experience' that it best fits and provide a snippet of that bullet as 'targetBulletPoint'.

    Return a JSON object with:
    {
      "score": number (0-100),
      "matchReasoning": "1-sentence verdict",
      "strengths": ["string"],
      "improvements": ["string"],
      "missingKeywords": ["string"],
      "semanticRelevancy": {
        "score": number (0-100),
        "gapAnalysis": "What high-level experience is missing?"
      },
      "impactDensity": {
        "score": number (0-100),
        "highlightedSections": ["List of specific phrases that are high-impact/data-driven"]
      },
      "atsCompatibility": {
        "score": number,
        "issues": ["string"]
      },
      "agentCritiques": {
        "recruiter": "string (Recruiter Agent perspective)",
        "contentStrategist": "string (Content Strategist perspective)",
        "auditor": "string (Compliance Auditor perspective)"
      },
      "benchmarkExamples": [
        { "company": "string", "role": "string", "reason": "why this is a good reference", "highlight": "a specific high-performing bullet point example" }
      ],
      "skillPlacements": [
        { "skill": "string", "reason": "why this skill belongs here", "suggestedSection": "Experience/Skills/Summary", "targetBulletPoint": "Exact snippet of existing bullet to modify (if Experience)" }
      ],
      "certification": {
        "status": "string (e.g., 'PLATINUM', 'GOLD', 'NEEDS_IMPROVEMENT')",
        "badge": "string (e.g., 'Optimized Profile', 'ATS Compliant')",
        "vulnerabilityCount": number
      }
    }`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert Multi-Agent Career Committee. Return valid JSON only." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    const cleaned = cleanJsonResponse(content);
    res.json(JSON.parse(cleaned));
  } catch (error) {
    next(error);
  }
});

router.post("/interview-prep", async (req, res, next) => {
  const { resumeData, jobDescription } = req.body;
  const groq = req.app.get("groq");

  if (!resumeData || !jobDescription) {
    return res.status(400).json({ error: "Missing resume data or job description" });
  }

  try {
    const prompt = `You are an expert technical interviewer. Based on the following resume and job description, generate 5 high-quality interview questions.
    For each question, provide the intent of the question and a hint for the candidate.

    RESUME:
    ${JSON.stringify(resumeData, null, 2)}

    JOB DESCRIPTION:
    ${jobDescription}

    Return a JSON object with a "questions" key containing the array of objects:
    {
      "questions": [
        {
          "question": "string",
          "intent": "string",
          "hint": "string"
        }
      ]
    }
    Return ONLY the JSON object.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert interviewer. Return valid JSON only." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    const cleaned = cleanJsonResponse(content);
    const parsed = JSON.parse(cleaned);
    res.json(parsed.questions || parsed);
  } catch (error) {
    next(error);
  }
});

router.post("/ghostwrite", async (req, res, next) => {
  const { resumeData, missingKeywords, targetATS } = req.body;
  const groq = req.app.get("groq");

  try {
    const prompt = `You are an expert resume ghostwriter. Your task is to naturally integrate the following missing keywords into the resume experience section.
    
    KEYWORDS TO INTEGRATE: ${missingKeywords.join(", ")}
    TARGET ATS: ${targetATS || "Modern ATS"}
    
    RESUME DATA:
    ${JSON.stringify(resumeData, null, 2)}

    RULES:
    1. Do not lie. Only integrate if the existing experience reasonably supports it.
    2. Maintain professional tone.
    3. Return the FULL updated resume data in the exact same JSON format.
    
    Return ONLY the JSON object.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert ghostwriter. Return valid JSON only." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    const cleaned = cleanJsonResponse(content);
    res.json(JSON.parse(cleaned));
  } catch (error) {
    next(error);
  }
});

router.post("/enhance", async (req, res, next) => {
  const { resumeData, targetATS } = req.body;
  const groq = req.app.get("groq");

  try {
    const prompt = `You are a professional resume optimizer. Enhance the following resume for impact, clarity, and ${targetATS || "Modern ATS"} compatibility.
    
    RESUME DATA:
    ${JSON.stringify(resumeData, null, 2)}

    RULES:
    1. Use strong action verbs.
    2. Quantify achievements where possible.
    3. Improve readability.
    4. Return the FULL updated resume data in the exact same JSON format.
    
    Return ONLY the JSON object.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert resume optimizer. Return valid JSON only." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    const cleaned = cleanJsonResponse(content);
    res.json(JSON.parse(cleaned));
  } catch (error) {
    next(error);
  }
});

router.post("/chat", async (req, res, next) => {
  const { message, context } = req.body;
  const groq = req.app.get("groq");

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are urCV.ai, a helpful AI career assistant. Use the provided resume context to answer user questions." },
        { role: "user", content: `Context: ${context || "No context provided"}\n\nUser: ${message}` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    res.json({ response: completion.choices[0]?.message?.content });
  } catch (error) {
    next(error);
  }
});

router.post("/extract", async (req, res, next) => {
  const { text } = req.body;
  const groq = req.app.get("groq");

  try {
    const prompt = `Extract structured resume data from the following raw text.
    
    RAW TEXT:
    ${text}

    Return a valid JSON object following the ResumeData schema.
    {
      "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "portfolio": "", "summary": "", "photoUrl": "" },
      "experience": [{ "id": "", "title": "", "company": "", "location": "", "startDate": "", "endDate": "", "current": false, "description": "" }],
      "education": [{ "id": "", "degree": "", "school": "", "location": "", "graduationDate": "", "gpa": "" }],
      "skills": { "technical": [], "languages": [], "certifications": [] },
      "hobbies": [],
      "codingProfiles": { "github": "", "leetcode": "", "hackerrank": "", "codeforces": "", "kaggle": "", "codechef": "" }
    }
    Return ONLY the JSON object.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert resume parser. Return valid JSON only." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    const cleaned = cleanJsonResponse(content);
    res.json(JSON.parse(cleaned));
  } catch (error) {
    next(error);
  }
});

export default router;
