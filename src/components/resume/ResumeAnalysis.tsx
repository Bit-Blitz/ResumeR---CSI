import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { analyzeATS } from "@/lib/atsAnalyzer";

import {
  analyzeResume,
  enhanceResume,
  ghostwriteResume,
  generateInterviewQuestions,
  extractResumeDataWithAI,
  parseResumeFastTrack,
  ResumeAnalysis,
  InterviewQuestion,
} from "@/services/groqService";

import { parseResumeFile } from "@/services/fileParserService";
import { ResumeData } from "@/pages/Builder";
import { useToast } from "@/hooks/use-toast";
import { Bot, Upload, FileText, Type, Building2, Sparkles, AlertCircle, Download, HelpCircle, ChevronRight, Terminal, Zap } from "lucide-react";
import { ResumeDownloadOptions, TemplateType } from "./ResumeGenerator";

interface ResumeAnalysisProps {
  data: ResumeData;
  jobDescription: string;
  onUpdateJD: (jd: string) => void;
  onEnhance: (enhancedData: ResumeData) => void;
  onExtractedData: (extractedData: ResumeData) => void;
  templateName?: TemplateType;
}

const ResumeAnalysisComponent = ({
  data,
  jobDescription,
  onUpdateJD,
  onEnhance,
  onExtractedData,
  templateName = "default",
}: ResumeAnalysisProps) => {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [analysisLogs, setAnalysisLogs] = useState<Array<{ agent: string; action: string; status: 'critical' | 'warning' | 'pass' }>>([]);
  // Remove local jobDescription state as it's now a prop
  const [targetCompany, setTargetCompany] = useState("");
  const [targetATS, setTargetATS] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isContentOptimizing, setIsContentOptimizing] = useState(false);
  const [originalDataBeforeOptimization, setOriginalDataBeforeOptimization] = useState<ResumeData | null>(null);
  const [lastOptimizationResult, setLastOptimizationResult] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [extractionMethod, setExtractionMethod] =
    useState<"file" | "text">("file");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  /* ---------------- ATS ANALYSIS (RULE-BASED) ---------------- */
  const ats = useMemo(() => {
    try {
      return analyzeATS(data);
    } catch (error) {
      console.error("ATS Analysis error:", error);
      return {
        score: 0,
        warnings: ["Unable to analyze resume structure"],
        suggestions: ["Please check your resume data and try again"],
        breakdown: {
          structure: 0,
          keywords: 0,
          bullets: 0,
          readability: 0
        }
      };
    }
  }, [data]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  /* ---------------- AI ACTIONS ---------------- */

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisLogs([]);
    const steps = [
      { agent: "RECRUITER_AGENT", action: "Scanning for semantic relevance...", status: "warning" as const },
      { agent: "COMPLIANCE_AUDITOR", action: `Simulating ${targetATS || "Workday"} compliance...`, status: "critical" as const },
      { agent: "CONTENT_STRATEGIST", action: "Identifying impact density gaps...", status: "warning" as const },
      { agent: "BENCHMARK_ANALYST", action: "Comparing against industry benchmarks...", status: "pass" as const },
      { agent: "SENIOR_REVIEWER", action: "Synthesizing final analysis...", status: "pass" as const }
    ];

    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      if (stepIdx < steps.length) {
        setAnalysisStep(steps[stepIdx].action);
        setAnalysisLogs(prev => [...prev, steps[stepIdx]]);
        stepIdx++;
      }
    }, 1200);

    try {
      const result = await analyzeResume(data, jobDescription, targetCompany, targetATS);
      clearInterval(stepInterval);
      setAnalysis(result);
      toast({
        title: "Deep Analysis Complete",
        description: targetCompany
          ? `Resume analyzed for ${targetCompany} standards.`
          : "Your resume has been analyzed successfully!",
      });
    } catch {
      clearInterval(stepInterval);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep("");
    }
  };

  const handleContentOptimization = async () => {
    if (!analysis?.missingKeywords?.length) return;

    setOriginalDataBeforeOptimization(JSON.parse(JSON.stringify(data)));
    setIsContentOptimizing(true);
    try {
      const optimized = await ghostwriteResume(data, analysis.missingKeywords, targetATS);
      onEnhance(optimized);
      setLastOptimizationResult("AI has naturally integrated missing keywords into your experience. You can now review and refine these changes further!");
      toast({
        title: "Content Optimized",
        description: "Keywords integrated! Review the suggestions below.",
      });

      // Auto-switch to highlight mode in preview
      const event = new CustomEvent('enableAIHighlights');
      window.dispatchEvent(event);
    } catch {
      toast({
        title: "Optimization Failed",
        description: "Failed to auto-inject keywords. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsContentOptimizing(false);
    }
  };

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceResume(data);
      onEnhance(enhanced);
      toast({
        title: "Resume Enhanced",
        description: "Your resume has been improved with AI suggestions!",
      });
    } catch {
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateInterviewQuestions = async () => {
    if (!jobDescription) return;

    setIsGeneratingQuestions(true);
    try {
      const questions = await generateInterviewQuestions(data, jobDescription);
      setInterviewQuestions(questions);
      toast({
        title: "Interview Prep Ready",
        description: "Generated 5 custom interview questions based on your resume and this JD.",
      });
    } catch {
      toast({
        title: "Generation Failed",
        description: "Failed to generate interview questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsExtracting(true);

    try {
      // 1. Extract raw text from file
      const fileText = await parseResumeFile(file);
      const isImage = file.type.startsWith("image/");

      // 2. Use Fast-Track parsing for better mapping
      const extractedData = await parseResumeFastTrack(fileText, isImage);

      onExtractedData(extractedData);

      toast({
        title: isImage ? "Vision OCR Success" : "Resume Parsed",
        description: isImage
          ? "Vision LLM successfully structured your resume image!"
          : "Your resume data has been extracted successfully!",
      });
    } catch (error) {
      console.error("Extraction error:", error);
      toast({
        title: "Extraction Failed",
        description: "Failed to extract resume data. Please try pasting text instead.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleTextExtraction = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "No Text Provided",
        description: "Please paste your resume text before extracting.",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);

    try {
      const extractedData = await extractResumeDataWithAI(resumeText);
      onExtractedData(extractedData);

      toast({
        title: "Resume Extracted",
        description: "Your resume data has been extracted successfully!",
      });
    } catch {
      toast({
        title: "Extraction Failed",
        description: "Failed to extract resume data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFastTrackParse = async () => {
    if (!resumeText.trim()) return;
    setIsExtracting(true);
    try {
      const extractedData = await parseResumeFastTrack(resumeText);
      onExtractedData(extractedData);
      toast({
        title: "Fast-Track Success",
        description: "Resume parsed into structured data instantly.",
      });
    } catch {
      toast({
        title: "Fast-Track Failed",
        description: "AI parsing failed. Falling back to standard extraction.",
        variant: "destructive",
      });
      handleTextExtraction();
    } finally {
      setIsExtracting(false);
    }
  };

  const applySkillPlacement = (skill: string, section: string, targetBulletPoint?: string) => {
    const updatedData = { ...data };
    let success = false;

    if (section === "Skills") {
      if (!updatedData.skills.technical.includes(skill)) {
        updatedData.skills.technical = [...updatedData.skills.technical, skill];
        success = true;
      }
    } else if (section === "Summary") {
      if (!updatedData.personalInfo.summary.includes(skill)) {
        updatedData.personalInfo.summary = `${updatedData.personalInfo.summary} Proficient in ${skill}.`;
        success = true;
      }
    } else if (section === "Experience" && targetBulletPoint) {
      // Find the experience entry that contains the targetBulletPoint text
      const expIndex = updatedData.experience.findIndex(exp =>
        exp.description.includes(targetBulletPoint)
      );

      if (expIndex !== -1) {
        const exp = updatedData.experience[expIndex];
        // Check if already injected to avoid duplicates
        if (!exp.description.includes(`[AI]${skill}[/AI]`)) {
          // Inject skill into the bullet point with AI highlighting
          // Try to insert it before the last period of the bullet point for better flow
          const targetText = targetBulletPoint.trim();
          const injection = ` (Leveraging [AI]${skill}[/AI] for optimized match)`;

          if (targetText.endsWith('.')) {
            const newText = targetText.slice(0, -1) + injection + '.';
            exp.description = exp.description.replace(targetBulletPoint, newText);
          } else {
            exp.description = exp.description.replace(targetBulletPoint, targetText + injection);
          }
          success = true;
        }
      }
    }

    if (success) {
      onEnhance(updatedData);

      // Auto-save version on enhancement
      if (analysis) {
        const event = new CustomEvent('saveResumeVersion', { detail: { score: analysis.score } });
        window.dispatchEvent(event);
      }

      toast({
        title: "Skill Placed",
        description: `Injected "${skill}" into your ${section}.`,
      });
    } else {
      toast({
        title: "Placement Skipped",
        description: `"${skill}" already exists in this section.`,
        variant: "default"
      });
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-white dark:bg-gray-950 border-0 shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Certification Badge - KILLER PRESENTATION FEATURE */}
      {analysis?.certification && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-4 right-4 z-10"
        >
          <div className="bg-black text-white p-3 rounded-xl border-2 border-blue-500 shadow-xl flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-[10px] font-black capitalize tracking-widest text-blue-500">Certified by ResumeR</p>
              <h4 className="text-sm font-black">{analysis.certification.badge}</h4>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Professional Analysis</h3>
            <p className="text-[10px] text-gray-500 capitalize tracking-widest font-bold">Optimize for Enterprise ATS</p>
          </div>
        </div>
      </div>

      {/* ATS SCORE — ALWAYS VISIBLE */}
      <Card className="p-5 border-2 border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-5">
          <Building2 className="w-16 h-16" />
        </div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold capitalize tracking-wider text-gray-500 dark:text-gray-400">Global ATS Parsability</h4>
          <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{ats.score}%</span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full mb-4">
          <div
            className={`${getScoreColor(ats.score)} h-2 rounded-full`}
            style={{ width: `${ats.score}%` }}
          />
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-200 font-medium mb-3">
          {ats.score >= 80
            ? "Excellent ATS compatibility"
            : ats.score >= 60
              ? "Good, but can be improved"
              : "Low ATS score — improvements recommended"}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm font-bold text-gray-600 dark:text-gray-300">
          <p>Structure: {ats.breakdown.structure}/25</p>
          <p>Keywords: {ats.breakdown.keywords}/25</p>
          <p>Bullets: {ats.breakdown.bullets}/25</p>
          <p>Readability: {ats.breakdown.readability}/25</p>
        </div>

        {ats.warnings.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
            <p className="font-black text-[10px] capitalize tracking-widest mb-2 text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              Critical Formatting Fixes
            </p>
            <ul className="space-y-1">
              {ats.warnings.map((w, i) => (
                <li key={i} className="text-xs font-bold text-red-800 dark:text-red-300 flex items-start">
                  <span className="mr-2">•</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Extraction Method Toggle */}
      <div className="flex space-x-2">
        <Button
          variant={extractionMethod === "file" ? "default" : "outline"}
          onClick={() => setExtractionMethod("file")}
        >
          <Upload className="w-4 h-4 mr-1" />
          Upload File
        </Button>
        <Button
          variant={extractionMethod === "text" ? "default" : "outline"}
          onClick={() => setExtractionMethod("text")}
        >
          <Type className="w-4 h-4 mr-1" />
          Paste Text
        </Button>
      </div>

      {/* File Upload */}
      {extractionMethod === "file" && (
        <div className="p-8 border-2 border-dashed rounded-xl text-center bg-gray-50/50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-white dark:bg-gray-950 rounded-full shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>

            <div>
              <p className="text-sm font-semibold">Drop your resume here or click to browse</p>
              <p className="text-xs text-gray-500 mt-1">Supports PDF, DOCX, TXT, and PNG/JPG (Vision OCR)</p>
            </div>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isExtracting}
              className="bg-white dark:bg-gray-950"
            >
              {isExtracting ? (
                <div className="flex items-center">
                  <Bot className="w-4 h-4 mr-2 animate-spin" />
                  Vision LLM Parsing...
                </div>
              ) : "Select Resume File"}
            </Button>
          </div>

          {uploadedFile && !isExtracting && (
            <div className="flex items-center justify-center mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-[11px] text-blue-700 dark:text-blue-300">
              <FileText className="w-3 h-3 mr-1" />
              {uploadedFile.name} (Ready)
            </div>
          )}
        </div>
      )}

      {/* Text Extraction */}
      {extractionMethod === "text" && (
        <div className="space-y-3">
          <Textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here (PDF content, Word text, etc.)..."
            className="min-h-[200px] text-xs font-mono"
          />
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleFastTrackParse}
              disabled={isExtracting || !resumeText.trim()}
            >
              {isExtracting ? "Processing..." : "Fast-Track: AI Parsing"}
            </Button>
            <Button
              variant="outline"
              onClick={handleTextExtraction}
              disabled={isExtracting || !resumeText.trim()}
            >
              Standard Extraction
            </Button>
          </div>
          <p className="text-[10px] text-gray-500 italic text-center">
            Pro-tip: AI Parsing is 3x faster and maps complex data better.
          </p>
        </div>
      )}

      {/* Analysis Status Overlay - Replaces terminal logs for better UX */}
      {isAnalyzing && (
        <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border-2 border-blue-500 rounded-xl animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <div className="relative">
              <Bot className="w-12 h-12 text-blue-600 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full animate-ping" />
            </div>
            <div className="text-center space-y-2">
              <h4 className="text-lg font-black capitalize tracking-tighter text-blue-700 dark:text-blue-400">
                {analysisStep}
              </h4>
              <p className="text-xs font-bold text-blue-600/60 capitalize tracking-widest">
                AI Committee is reviewing your profile
              </p>
            </div>
            <div className="w-full max-w-xs h-1.5 bg-blue-100 dark:bg-blue-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-600"
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Company & Job Description Input */}
      <Card className="p-5 border-2 border-blue-100 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-900/10 shadow-lg shadow-blue-500/5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black tracking-widest capitalize text-blue-700 dark:text-blue-400">Target Parameters</h4>
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Building2 className="w-3 h-3 text-blue-600" />
                <h4 className="font-bold text-[10px] capitalize tracking-wider text-gray-500">Corporate Culture</h4>
              </div>
              <select
                className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
              >
                <option value="">General / Generic</option>
                <option value="Google">Google (Googliness)</option>
                <option value="Meta">Meta (Move Fast)</option>
                <option value="Goldman Sachs">Goldman (Precision)</option>
                <option value="Amazon">Amazon (Leadership)</option>
                <option value="Netflix">Netflix (Freedom/Resp)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="w-3 h-3 text-blue-600" />
                <h4 className="font-bold text-[10px] capitalize tracking-wider text-gray-500">Parsing Engine</h4>
              </div>
              <select
                className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs"
                value={targetATS}
                onChange={(e) => setTargetATS(e.target.value)}
              >
                <option value="">Workday (Standard)</option>
                <option value="Greenhouse">Greenhouse (Modern)</option>
                <option value="Lever">Lever (Startup-fav)</option>
                <option value="Taleo">Taleo (Legacy Enterprise)</option>
                <option value="iCIMS">iCIMS (High-Volume)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-3 h-3 text-blue-600" />
              <h4 className="font-bold text-[10px] capitalize tracking-wider text-gray-500">Target Job Description</h4>
            </div>
            <Textarea
              placeholder="Paste the job description you're targeting..."
              className="min-h-[150px] mb-3 text-sm"
              value={jobDescription}
              onChange={(e) => onUpdateJD(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleAnalyze}
          className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
          disabled={isAnalyzing || !jobDescription.trim()}
        >
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center">
                <Bot className="w-4 h-4 mr-2 animate-bounce text-white" />
                <span className="text-sm font-bold capitalize tracking-tighter animate-pulse">{analysisStep}</span>
              </div>
              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                <div className="bg-white h-full animate-progress-fast" style={{ width: '100%' }} />
              </div>
            </div>
          ) : (
            <>
              <Bot className="w-4 h-4 mr-2" />
              Run Professional Analysis
            </>
          )}
        </Button>
      </Card>

      {/* AI Actions */}
      <div className="flex space-x-4">
        <Button
          onClick={handleEnhance}
          disabled={isEnhancing}
          variant="outline"
          className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
        >
          {isEnhancing ? "Enhancing..." : "AI Content Enhancement"}
        </Button>
      </div>

      {/* AI RESULTS */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Match Reasoned Summary */}
          {analysis.matchReasoning && (
            <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border-l-4 border-blue-500 italic text-sm text-gray-700 dark:text-gray-300">
              "{analysis.matchReasoning}"
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-600 text-white rounded-lg text-center">
              <p className="text-xs capitalize tracking-wider opacity-80 mb-1">JD Match Score</p>
              <div className="text-3xl font-black">{analysis.score}%</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${analysis.atsCompatibility.score > 70 ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'
              }`}>
              <p className="text-xs capitalize tracking-wider opacity-80 mb-1">ATS Parsability</p>
              <div className="text-3xl font-black">{analysis.atsCompatibility.score}%</div>
            </div>
          </div>

          {/* Top 3 Action Items - UX Maturity Improvement */}
          <Card className="p-4 border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-black capitalize tracking-widest text-blue-700 dark:text-blue-400">Critical Action Items</h4>
            </div>
            <div className="space-y-3">
              {analysis.improvements.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-start space-x-3 p-2 bg-white dark:bg-gray-950 rounded-lg border border-blue-100 dark:border-blue-900">
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-[10px] font-black text-blue-600">
                    {i + 1}
                  </div>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center space-x-1 text-[9px] text-gray-500 capitalize font-black">
              <AlertCircle className="w-3 h-3" />
              <span>Manual review required for all AI suggestions</span>
            </div>
          </Card>

          {/* Analysis Feedback Summary */}
          {analysisLogs.length > 0 && (
            <div className="bg-gray-900 text-blue-400 p-4 rounded-xl font-mono text-[10px] space-y-1 shadow-2xl border-t-4 border-blue-900/50">
              <div className="flex items-center justify-between border-b border-blue-900/30 pb-2 mb-2">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-3 h-3 animate-pulse" />
                  <span className="font-bold capitalize tracking-widest">Analysis Logs Summary</span>
                </div>
                <Badge variant="outline" className="text-[8px] border-blue-900 text-blue-400 capitalize">Archive</Badge>
              </div>
              <div className="max-h-[120px] overflow-y-auto space-y-1 scrollbar-hide">
                {analysisLogs.map((log, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <span className="opacity-40">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                    <span className={`font-bold capitalize ${log.status === 'critical' ? 'text-red-400' :
                      log.status === 'warning' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                      {log.agent}:
                    </span>
                    <span className="text-gray-400">{log.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEW: Semantic Relevancy & Impact Density */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border-purple-100 dark:border-purple-900 bg-purple-50/20 dark:bg-purple-900/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold capitalize tracking-tight text-purple-700 dark:text-purple-400">Semantic Relevancy</h4>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">{analysis.semanticRelevancy.score}%</Badge>
              </div>
              <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 italic leading-relaxed">
                "{analysis.semanticRelevancy.gapAnalysis}"
              </p>
            </Card>

            <Card className="p-4 border-cyan-100 dark:border-cyan-900 bg-cyan-50/20 dark:bg-cyan-900/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold capitalize tracking-tight text-cyan-700 dark:text-cyan-400">Impact Density</h4>
                <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200">{analysis.impactDensity.score}%</Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {analysis.impactDensity.highlightedSections.slice(0, 3).map((phrase, i) => (
                  <Badge key={i} variant="outline" className="text-[9px] border-cyan-200 text-cyan-700 bg-white/50">
                    {phrase}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* NEW: Multi-Agent Committee Verdict */}
          {analysis.agentCritiques && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold capitalize tracking-widest text-gray-500 mb-2">Multi-Agent Committee Verdict</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Building2 className="w-3 h-3 text-blue-600" />
                    <span className="text-[10px] font-bold capitalize text-blue-700">Senior Recruiter</span>
                  </div>
                  <p className="text-[11px] text-blue-900/80 dark:text-blue-300/80 leading-relaxed italic">
                    {analysis.agentCritiques.recruiter}
                  </p>
                </div>
                <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span className="text-[10px] font-bold capitalize text-purple-700">Content Strategist</span>
                  </div>
                  <p className="text-[11px] text-purple-900/80 dark:text-purple-300/80 leading-relaxed italic">
                    {analysis.agentCritiques.ghostwriter}
                  </p>
                </div>
                <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Bot className="w-3 h-3 text-amber-600" />
                    <span className="text-[10px] font-bold capitalize text-amber-700">Compliance Auditor</span>
                  </div>
                  <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80 leading-relaxed italic">
                    {analysis.agentCritiques.parser}
                  </p>
                </div>
              </div>
            </div>
          )}

          {analysis.atsCompatibility.issues.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-800 text-sm mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Formatting Issues Detected
              </h4>
              <ul className="text-xs text-amber-700 space-y-1 list-disc pl-4">
                {analysis.atsCompatibility.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.strengths.map((s, i) => (
                <Badge key={i} className="bg-green-100 text-green-800">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-orange-700 mb-2">
              Areas for Improvement
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.improvements.map((i, idx) => (
                <Badge key={idx} className="bg-orange-100 text-orange-800">
                  {i}
                </Badge>
              ))}
            </div>
          </div>

          {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900 rounded-lg">
              <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center justify-between">
                <span>Missing JD Keywords</span>
                <Badge variant="outline" className="text-[10px] capitalize border-red-200 text-red-600">High Priority</Badge>
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {analysis.missingKeywords.map((kw, i) => (
                  <Badge key={i} className="bg-red-100 text-red-800 border-red-200">
                    {kw}
                  </Badge>
                ))}
              </div>

              {/* Skill Placement Suggestions */}
              {analysis.skillPlacements && analysis.skillPlacements.length > 0 && (
                <div className="mb-4 space-y-3">
                  <p className="text-[10px] font-black capitalize tracking-wider text-red-600 mb-2 flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    Recommended Algorithm Injections:
                  </p>
                  {analysis.skillPlacements.map((sp, i) => (
                    <div key={i} className="group relative p-3 bg-white dark:bg-black/40 rounded-xl border border-red-100 dark:border-red-900/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className="bg-red-600 text-white border-0 text-[9px] px-1.5 h-4">
                              {sp.suggestedSection}
                            </Badge>
                            <span className="text-xs font-black text-gray-900 dark:text-gray-100">
                              Inject "{sp.skill}"
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 leading-tight">{sp.reason}</p>
                        </div>
                        <Button
                          size="sm"
                          className="h-7 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg shadow-sm"
                          onClick={() => applySkillPlacement(sp.skill, sp.suggestedSection, sp.targetBulletPoint)}
                        >
                          Apply Change
                        </Button>
                      </div>

                      {sp.targetBulletPoint && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 font-mono text-[9px] overflow-hidden">
                          <div className="flex items-center justify-between mb-1 opacity-50">
                            <span>DIFF PREVIEW</span>
                            <span className="text-red-500">Proposed Injection</span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-gray-400 line-through truncate">
                              - {sp.targetBulletPoint}
                            </div>
                            <div className="text-green-600 dark:text-green-400 font-bold">
                              + {sp.targetBulletPoint.endsWith('.') ? sp.targetBulletPoint.slice(0, -1) : sp.targetBulletPoint}
                              <span className="bg-green-100 dark:bg-green-900/40 px-1 rounded">
                                (Leveraging [AI]{sp.skill}[/AI] for optimized match)
                              </span>
                              {sp.targetBulletPoint.endsWith('.') ? '.' : ''}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={handleContentOptimization}
                disabled={isContentOptimizing}
                size="sm"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all duration-200"
              >
                {isContentOptimizing ? (
                  "Optimizing..."
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-2" />
                    Content Strategist: Optimize Keywords
                  </>
                )}
              </Button>
              <p className="text-[10px] text-center text-blue-600/70 mt-2 italic">
                Intelligently suggests professional rewrites to naturally integrate these keywords.
              </p>

              {lastOptimizationResult && (
                <div className="mt-4 space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="p-3 bg-white/50 dark:bg-black/20 rounded border border-blue-200">
                    <p className="text-xs text-blue-800 dark:text-blue-300 font-bold flex items-center mb-2">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      REVIEW: Content Strategy Improvements
                    </p>

                    <div className="space-y-3">
                      {data.experience.map((exp, idx) => {
                        const originalExp = originalDataBeforeOptimization?.experience[idx];
                        const hasAI = exp.description?.includes("[AI]");
                        if (!hasAI) return null;

                        return (
                          <div key={exp.id} className="text-[10px] space-y-1 border-t border-blue-100 pt-2 first:border-0 first:pt-0">
                            <p className="font-bold text-gray-500 capitalize">{exp.company}</p>
                            <div className="grid grid-cols-1 gap-1">
                              <div className="p-1.5 bg-red-50/50 line-through text-red-400 rounded">
                                {originalExp?.description}
                              </div>
                              <div className="p-1.5 bg-green-50/50 text-green-700 rounded font-medium">
                                {exp.description.replace(/\[AI\]|\[\/AI\]/g, "")}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white h-7 text-[10px]"
                        onClick={() => {
                          setLastGhostwriteResult(null);
                          setOriginalDataBeforeGhostwrite(null);
                          toast({ title: "Improvements Accepted", description: "Your resume has been permanently updated." });
                        }}
                      >
                        Accept All Improvements
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-[10px]"
                        onClick={() => {
                          if (originalDataBeforeGhostwrite) {
                            onEnhance(originalDataBeforeGhostwrite);
                            setLastGhostwriteResult(null);
                            setOriginalDataBeforeGhostwrite(null);
                            toast({ title: "Changes Reverted", description: "Resume restored to original state." });
                          }
                        }}
                      >
                        Revert
                      </Button>
                    </div>
                  </div>

                  <p className="text-[10px] text-red-700/80 italic">{lastGhostwriteResult}</p>
                </div>
              )}
            </div>
          )}

          <div>
            <h4 className="font-semibold text-blue-700 mb-2">AI Suggestions</h4>
            <div className="space-y-2">
              {analysis.suggestions.map((s, i) => (
                <div key={i} className="p-3 bg-blue-50 rounded-lg">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* KILLER FEATURE 1: Benchmark Agent (Simulated RAG) */}
          {analysis.benchmarkExamples && analysis.benchmarkExamples.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-gray-900 dark:text-white">Benchmark Reference Agent</h4>
                </div>
                <Badge variant="outline" className="text-[9px] capitalize border-emerald-200 text-emerald-600">Vector Search (Simulated)</Badge>
              </div>
              <p className="text-[11px] text-gray-500 mb-3 italic">
                We compared your profile against successful resumes from our historical database for similar roles at top-tier companies.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {analysis.benchmarkExamples.map((ex, i) => (
                  <div key={i} className="p-3 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900 rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-emerald-700">{ex.company} • {ex.role}</span>
                    </div>
                    <p className="text-[11px] text-gray-700 dark:text-gray-300 mb-2">"{ex.highlight}"</p>
                    <div className="p-1.5 bg-white dark:bg-black/20 rounded text-[9px] text-emerald-600 italic">
                      <span className="font-bold mr-1">Why it works:</span> {ex.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KILLER FEATURE 2: Interview Prep Simulator */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <h4 className="font-bold text-gray-900 dark:text-white">Interview Prep Simulator</h4>
              </div>
              <Button
                onClick={handleGenerateInterviewQuestions}
                disabled={isGeneratingQuestions || !jobDescription}
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                {isGeneratingQuestions ? "Generating..." : "Generate Questions"}
              </Button>
            </div>

            {interviewQuestions.length > 0 ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                {interviewQuestions.map((q, i) => (
                  <div key={i} className="p-4 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900 rounded-xl">
                    <p className="font-bold text-sm text-purple-900 dark:text-purple-300 mb-2 flex items-start">
                      <span className="mr-2">Q{i + 1}:</span>
                      {q.question}
                    </p>
                    <div className="pl-6 space-y-2">
                      <p className="text-[11px] text-purple-700/70 italic">
                        <span className="font-bold not-italic mr-1">Intent:</span>
                        {q.intent}
                      </p>
                      <div className="p-2 bg-white dark:bg-black/20 rounded border border-purple-100 dark:border-purple-800 text-[11px] text-gray-700 dark:text-gray-400">
                        <span className="font-bold text-purple-600 mr-1">Star Hint:</span>
                        {q.hint}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">
                Get ready for the interview. We'll simulate high-tier recruiter questions based on your profile and this JD.
              </p>
            )}
          </div>

          {/* LAST MILE UTILITY: One-Click Export */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-2 mb-4">
              <Download className="w-4 h-4 text-green-600" />
              <h4 className="font-bold text-gray-900 dark:text-white">Ready to Apply?</h4>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Your resume is optimized and ready. Download it now to start your application.
            </p>
            <div className="bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <ResumeDownloadOptions data={data} templateName={templateName} showHeading={false} />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ResumeAnalysisComponent;
