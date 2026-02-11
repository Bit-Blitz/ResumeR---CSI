import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  Bot,
  Home,
  LayoutTemplate,
  CheckCircle,
  Layout,
  Upload,
  History,
  ShieldCheck,
  Save,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import ThemeToggle from "@/components/ThemeToggle";
import PersonalInfoForm from "@/components/resume/PersonalInfoForm";
import EducationForm from "@/components/resume/EducationForm";
import ExperienceForm from "@/components/resume/ExperienceForm";
import SkillsForm from "@/components/resume/SkillsForm";
import ResumePreview from "@/components/resume/ResumePreview";
import ResumeAnalysisComponent from "@/components/resume/ResumeAnalysis";
import ResumeGenerator from "@/components/resume/ResumeGenerator";
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
import { useToast, toast } from "@/hooks/use-toast";
import FullPreviewModal from "@/components/resume/FullPreviewModal";
import FloatingChatBot from "@/components/FloatingChatBot";
import CodingProfilesForm from "@/components/resume/CodingProfilesForm";
import HobbiesForm from "@/components/resume/HobbiesForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ResumeDownloadOptions } from "@/components/resume/ResumeGenerator";

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
    summary: string;
    photoUrl: string;
  };
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
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
  skills: {
    technical: string[];
    languages: string[];
    certifications: string[];
  };
  hobbies?: string[];
  codingProfiles: {
    github?: string;
    leetcode?: string;
    hackerrank?: string;
    codeforces?: string;
    kaggle?: string;
    codechef?: string;
  };
}

const RESUME_DATA_KEY = "resume-creator-resume-data";
const CURRENT_STEP_KEY = "resume-creator-current-step";
const TEMPLATE_NAME_KEY = "resume-creator-template-name";

const DEFAULT_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 012-3456",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
    portfolio: "alexmorgan.com",
    summary:
      "Innovative and results-oriented professional with a strong background in technology and design. Skilled in project management, team leadership, and creative problem-solving. Committed to delivering high-quality solutions and driving business growth.",
    photoUrl: "",
  },
  education: [
    {
      id: "1",
      degree: "Bachelor of Science in Computer Science",
      school: "University of Technology",
      location: "San Francisco, CA",
      graduationDate: "May 2022",
      gpa: "3.8",
    },
  ],
  experience: [
    {
      id: "1",
      title: "Senior Developer",
      company: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      startDate: "Jun 2022",
      endDate: "Present",
      current: true,
      description:
        "Led a team of developers in building scalable web applications. Implemented new features and optimized existing code for better performance.",
    },
  ],
  skills: {
    technical: ["React", "TypeScript", "Node.js", "AWS"],
    languages: ["English (Native)", "Spanish (Intermediate)"],
    certifications: ["AWS Certified Solutions Architect"],
  },
  hobbies: [],
  codingProfiles: {
    github: "",
    leetcode: "",
    hackerrank: "",
    codeforces: "",
    kaggle: "",
    codechef: "",
  },
};

const EMPTY_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    summary: "",
    photoUrl: "",
  },
  education: [],
  experience: [],
  skills: {
    technical: [],
    languages: [],
    certifications: [],
  },
  hobbies: [],
  codingProfiles: {
    github: "",
    leetcode: "",
    hackerrank: "",
    codeforces: "",
    kaggle: "",
    codechef: "",
  },
};

const mergeResumeData = (partialData: any): ResumeData => {
  if (!partialData) return EMPTY_RESUME_DATA;

  return {
    ...EMPTY_RESUME_DATA,
    ...partialData,
    personalInfo: {
      ...EMPTY_RESUME_DATA.personalInfo,
      ...(partialData.personalInfo || {}),
    },
    skills: {
      ...EMPTY_RESUME_DATA.skills,
      ...(partialData.skills || {}),
    },
    codingProfiles: {
      ...EMPTY_RESUME_DATA.codingProfiles,
      ...(partialData.codingProfiles || {}),
    },
    experience: Array.isArray(partialData.experience) ? partialData.experience : [],
    education: Array.isArray(partialData.education) ? partialData.education : [],
    hobbies: Array.isArray(partialData.hobbies) ? partialData.hobbies : [],
  };
};

const Builder = () => {
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const savedStep = localStorage.getItem(CURRENT_STEP_KEY);
    const parsedStep = savedStep ? parseInt(savedStep, 10) : 0;
    return isNaN(parsedStep) ? 0 : Math.min(Math.max(0, parsedStep), 5); // 5 is the max index for 6 steps
  });

  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const savedData = localStorage.getItem(RESUME_DATA_KEY);
    if (savedData) {
      try {
        return mergeResumeData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse resume data from localStorage", e);
      }
    }
    return DEFAULT_RESUME_DATA;
  });

  const [templateName, setTemplateName] = useState<
    "default" | "modern" | "professional" | "creative" | "minimalist" | "bold"
  >(() => {
    const savedTemplate = localStorage.getItem(TEMPLATE_NAME_KEY);
    return (savedTemplate as any) || "default";
  });

  const [showAIChanges, setShowAIChanges] = useState(false);
  const [isPowerUserMode, setIsPowerUserMode] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("form");
  const [isMigratingTemplate, setIsMigratingTemplate] = useState(false);

  // Handle template change with migration animation
  const handleTemplateChange = (newTemplate: typeof templateName) => {
    if (newTemplate === templateName) return;

    setIsMigratingTemplate(true);

    // Simulate migration delay for skeleton transition
    setTimeout(() => {
      setTemplateName(newTemplate);
      setIsMigratingTemplate(false);
    }, 800);
  };

  const realTimeATS = useMemo(() => {
    try {
      return analyzeATS(resumeData);
    } catch (error) {
      console.error("ATS Analysis failed:", error);
      return {
        score: 0,
        breakdown: { structure: 0, keywords: 0, bullets: 0, readability: 0 },
        warnings: ["Analysis failed due to data error"],
        suggestions: ["Check your resume data for completeness"]
      };
    }
  }, [resumeData]);

  useEffect(() => {
    const target = realTimeATS?.score || 0;
    const duration = 1500; // 1.5 seconds
    const start = displayScore;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutExpo)
      const ease = 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(start + (target - start) * ease);

      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [realTimeATS?.score]);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showStartAnalysis, setShowStartAnalysis] = useState(() => {
    // Show upload screen if no data is saved and we're at step 0
    const savedData = localStorage.getItem(RESUME_DATA_KEY);
    const savedStep = localStorage.getItem(CURRENT_STEP_KEY);
    return !savedData && (!savedStep || savedStep === "0");
  });

  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [resumeVersions, setResumeVersions] = useState<Array<{ id: string; date: string; score: number; job: string }>>(() => {
    return JSON.parse(localStorage.getItem("resume-creator-resume-versions") || "[]");
  });

  // Mobile state for preview visibility
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Persist data to localStorage
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem(RESUME_DATA_KEY, JSON.stringify(resumeData));
    setLastSaved(new Date());

    const timer = setTimeout(() => setIsSaving(false), 800);
    return () => clearTimeout(timer);
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem(CURRENT_STEP_KEY, currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem(TEMPLATE_NAME_KEY, templateName);
  }, [templateName]);

  useEffect(() => {
    const handleEnableHighlights = () => setShowAIChanges(true);
    window.addEventListener('enableAIHighlights', handleEnableHighlights);
    return () => window.removeEventListener('enableAIHighlights', handleEnableHighlights);
  }, []);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [jobDescription, setJobDescription] = useState<string>(() => {
    return localStorage.getItem("resume-creator-job-description") || "";
  });

  useEffect(() => {
    localStorage.setItem("resume-creator-job-description", jobDescription);
  }, [jobDescription]);

  useEffect(() => {
    if (realTimeATS?.score >= 90 && !hasCelebrated) {
      setShowCelebration(true);
      setHasCelebrated(true);

      // Trigger confetti
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
        });
      }, 250);

      // Auto-hide celebration after 5 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else if (realTimeATS?.score < 90 && hasCelebrated) {
      // Reset if score drops below 90, so they can celebrate again
      setHasCelebrated(false);
    }
  }, [realTimeATS?.score, hasCelebrated]);

  // Desktop sliding window state - only used on desktop
  const [leftWidth, setLeftWidth] = useState(38); // percentage - adjusted for better default dominance of the preview section
  const [isResizing, setIsResizing] = useState(false);
  const [versions, setVersions] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem("resume-creator-resume-versions") || "[]");
  });

  useEffect(() => {
    const handleVersionsUpdate = () => {
      setVersions(JSON.parse(localStorage.getItem("resume-creator-resume-versions") || "[]"));
    };
    window.addEventListener('rc-versions-updated', handleVersionsUpdate);
    return () => window.removeEventListener('rc-versions-updated', handleVersionsUpdate);
  }, []);

  const startResize = () => setIsResizing(true);
  const stopResize = () => setIsResizing(false);

  const handleResize = (e: MouseEvent) => {
    if (!isResizing || e.buttons !== 1) return;

    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 30 && newWidth < 75) {
      setLeftWidth(newWidth);
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", stopResize);
    } else {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResize);
    }
    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing]);

  const steps = [
    { title: "Personal Info", component: PersonalInfoForm },
    { title: "Education", component: EducationForm },
    { title: "Experience", component: ExperienceForm },
    { title: "Skills", component: SkillsForm },
    { title: "Hobbies", component: HobbiesForm },
    { title: "Coding Profiles", component: CodingProfilesForm },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleEnhanceResume = (enhancedData: ResumeData) => {
    setResumeData(mergeResumeData(enhancedData));
  };

  const getResumeContext = () => {
    return `Current resume data: ${JSON.stringify(resumeData, null, 2)}`;
  };

  const handleExtractedData = (extractedData: ResumeData) => {
    setResumeData(mergeResumeData(extractedData));

    // Track extraction event for simple analytics
    const extractions = JSON.parse(localStorage.getItem("resume-creator-analytics-extractions") || "0");
    localStorage.setItem("resume-creator-analytics-extractions", JSON.stringify(extractions + 1));
  };

  const handleStartAuditUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setShowStartAnalysis(false); // Hide overlay immediately to show editor with skeletons
    const scanSteps = [
      "Initializing Resume Analysis...",
      "Bypassing ATS Keyword Filters...",
      "Vision LLM: Structuring Visual Context...",
      "Deconstructing Experience Weights...",
      "Mapping Industry-Standard Taxonomy...",
      "Analysis Complete: Proceeding to Editor."
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < scanSteps.length) {
        setScanStep(scanSteps[stepIdx]);
        stepIdx++;
      }
    }, 800);

    try {
      const fileText = await parseResumeFile(file);
      const isImage = file.type.startsWith("image/");
      const extractedData = await parseResumeFastTrack(fileText, isImage);

      setResumeData(mergeResumeData(extractedData));
      clearInterval(interval);

      toast({
        title: "Analysis Initialized",
        description: "Your resume has been parsed by our Multi-Agent system.",
      });

      setShowStartAnalysis(false);
    } catch (error) {
      clearInterval(interval);
      toast({
        title: "Analysis Failed",
        description: "Manual override required. Please paste your text or try another file.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
      setScanStep("");
    }
  };

  useEffect(() => {
    const handleSaveEvent = (e: any) => {
      if (e.detail?.score) saveResumeVersion(e.detail.score);
    };
    window.addEventListener('saveResumeVersion', handleSaveEvent);
    return () => window.removeEventListener('saveResumeVersion', handleSaveEvent);
  }, [resumeVersions]);

  const handleUpdateJD = (jd: string) => {
    setJobDescription(jd);
  };

  const saveResumeVersion = (score: number, name?: string) => {
    const defaultName = `v${score}% Analysis - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const versionName = name || defaultName;

    const versions = JSON.parse(localStorage.getItem("resume-creator-resume-versions") || "[]");
    const newVersion = {
      id: crypto.randomUUID(),
      name: versionName,
      timestamp: new Date().toISOString(),
      data: resumeData,
      score: score,
      templateName
    };

    const updatedVersions = [newVersion, ...versions].slice(0, 10); // Keep last 10
    setResumeVersions(updatedVersions);
    localStorage.setItem("resume-creator-resume-versions", JSON.stringify(updatedVersions));

    // Dispatch event to notify components
    window.dispatchEvent(new Event('rc-versions-updated'));

    toast({
      title: "Checkpoint Created",
      description: `"${versionName}" has been stored in your optimization history.`,
    });
  };

  const loadResumeVersion = (version: any) => {
    setResumeData(version.data);
    setTemplateName(version.templateName);
    toast({
      title: "Version Loaded",
      description: `Switched to "${version.name}".`,
    });
  };

  const completedSteps = currentStep;
  const remainingSteps = steps.length - currentStep - 1;
  const nextSectionTitle =
    steps[currentStep + 1]?.title ?? "Preview & Generate";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/10 transition-colors duration-300">
      {/* Start Analysis Overlay */}
      <AnimatePresence>
        {showStartAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <div className="max-w-2xl w-full text-center space-y-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
                    <Bot className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Professional Resume Analysis
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Securely upload your resume for immediate ATS optimization.
                </p>

                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex items-center justify-center space-x-2 text-xs font-bold text-blue-600 capitalize tracking-widest bg-blue-50 dark:bg-blue-900/20 py-2 px-4 rounded-full w-fit border border-blue-100 dark:border-blue-800">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Privacy Guaranteed: Data stays in your browser</span>
                  </div>

                  <button
                    onClick={() => setShowStartAnalysis(false)}
                    className="group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors bg-white/50 dark:bg-gray-900/50 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Skip to Manual Entry
                  </button>
                </div>
              </motion.div>

              <div className="relative group">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,image/*"
                  onChange={handleStartAuditUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isScanning}
                />
                <div className="p-12 border-4 border-dashed rounded-3xl border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 group-hover:border-blue-500 transition-all duration-300 flex flex-col items-center justify-center space-y-6">
                  {isScanning ? (
                    <div className="space-y-8 w-full max-w-sm">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        {/* Skeleton parsing animation */}
                        <div className="w-full space-y-3">
                          <div className="h-4 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse w-3/4 mx-auto" />
                          <div className="h-4 bg-blue-50 dark:bg-blue-900/20 rounded-full animate-pulse w-1/2 mx-auto" />
                        </div>
                        <div className="flex items-center space-x-3">
                          <Bot className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-bold text-blue-600 capitalize tracking-tighter">{scanStep}</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-600"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-6 bg-blue-50 dark:bg-blue-900/30 rounded-full group-hover:scale-105 transition-transform duration-300">
                        <Upload className="w-12 h-12 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">Drop your CV here</p>
                        <p className="text-sm text-gray-500">PDF, DOCX, or Image (Vision AI OCR)</p>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg rounded-xl shadow-xl shadow-blue-500/30 font-bold capitalize tracking-wide">
                        Start Analysis
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => setShowStartAnalysis(false)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 underline underline-offset-4 transition-colors"
                >
                  Or start with a blank template
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden"
              >
                <img alt="ResumeR" src="/LOGO.png" className="w-full h-full object-contain" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ResumeR
              </span>
            </Link>

            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4 text-sm">
              <AnimatePresence mode="wait">
                {lastSaved && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full"
                  >
                    {isSaving ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Save className="w-3 h-3 text-blue-500" />
                      </motion.div>
                    ) : (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    )}
                    <span className="text-[10px] font-bold text-gray-500 capitalize tracking-tight">
                      {isSaving ? "Saving..." : `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full"
              >
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </motion.div>
              <ThemeToggle />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Power User</span>
                <button
                  onClick={() => setIsPowerUserMode(!isPowerUserMode)}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${isPowerUserMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <span className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${isPowerUserMode ? 'translate-x-4' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300"
                  asChild
                >
                  <Link
                    to="/"
                    aria-label="Back to main page"
                    className="flex items-center gap-1"
                  >
                    <Home className="w-4 h-4" />
                    <span>Back Home</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  asChild
                >
                  <Link
                    to="/templates"
                    aria-label="Go to templates page"
                    className="flex items-center gap-1"
                  >
                    <LayoutTemplate className="w-4 h-4" />
                    <span>Templates</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Animated Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="container mx-auto px-4 py-6"
      >
        <div className="max-w-md mx-auto">
          <div className="flex justify-between mb-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{
                    scale: currentStep === index ? 1.1 : 1,
                    backgroundColor:
                      index <= currentStep
                        ? "rgb(37, 99, 235)"
                        : "rgb(229, 231, 235)",
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${index <= currentStep
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500"
                    }`}
                >
                  {index < currentStep ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="bg-green-500 w-full h-full rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </motion.div>
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </motion.div>
                <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
                  {step.title}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            />
            {/* Shimmer effect */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Mobile Preview Toggle Button - Only on mobile */}
      {isMobile && (
        <div className="container mx-auto px-4 mb-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-2 hover:border-blue-400 transition-all duration-300"
              onClick={() => setShowMobilePreview(!showMobilePreview)}
            >
              <FileText className="w-4 h-4" />
              {showMobilePreview ? "Hide Preview" : "Show Preview"}
              <ArrowRight
                className={`w-4 h-4 transition-transform duration-300 ${showMobilePreview ? "rotate-90" : ""}`}
              />
            </Button>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        {/* Mobile Layout - Stacked */}
        {isMobile ? (
          <div className="flex flex-col gap-4">
            {/* Form Section - Always visible on mobile */}
            <Card className="p-4 shadow-xl border-0 dark:bg-gray-900/90 dark:border-gray-800 backdrop-blur-sm bg-white/90">
              <Tabs defaultValue="form" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl transition-all duration-300">
                  <TabsTrigger
                    value="form"
                    className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Layout className="w-4 h-4 mr-2" />
                    Data Extraction
                  </TabsTrigger>
                  <TabsTrigger
                    value="analysis"
                    className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Audit Gauntlet
                  </TabsTrigger>
                  <TabsTrigger
                    value="versions"
                    className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Deployment History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="form">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="mb-4">
                        <motion.h2
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                        >
                          {steps[currentStep].title}
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-gray-600 dark:text-gray-400 text-sm"
                        >
                          Fill in your {steps[currentStep].title.toLowerCase()}{" "}
                          details
                        </motion.p>
                      </div>

                      <CurrentStepComponent
                        data={resumeData}
                        updateData={updateResumeData}
                      />

                      {/* Navigation Buttons */}
                      <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
                        <Button
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentStep === 0}
                          className="flex items-center space-x-2 transition-all duration-200 disabled:opacity-50 border-gray-200 dark:border-gray-800 dark:hover:bg-gray-800 h-11 px-6"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </Button>

                        {currentStep === steps.length - 1 ? (
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 shadow-sm transition-all duration-200 h-11 px-8"
                            onClick={() => setShowGenerateModal(true)}
                          >
                            <span>Generate Resume</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleNext}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 shadow-sm transition-all duration-200 h-11 px-8"
                          >
                            <span>Next</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="mt-8">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-5 border border-gray-100 dark:border-gray-800"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] capitalize tracking-widest font-bold text-gray-500 dark:text-gray-400">
                              Builder progress
                            </p>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                              {Math.round(((completedSteps + 1) / steps.length) * 100)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                            <motion.div
                              className="h-full bg-blue-600"
                              initial={{ width: 0 }}
                              animate={{ width: `${((completedSteps + 1) / steps.length) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {completedSteps + 1} / {steps.length} sections complete
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {remainingSteps >= 0
                              ? `Next up: ${nextSectionTitle}`
                              : "All sections complete!"}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="analysis">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ResumeAnalysisComponent
                      data={resumeData}
                      jobDescription={jobDescription}
                      onUpdateJD={handleUpdateJD}
                      onEnhance={handleEnhanceResume}
                      onExtractedData={handleExtractedData}
                      templateName={templateName}
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="generate">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ResumeGenerator
                      data={resumeData}
                      templateName={templateName}
                    />
                  </motion.div>
                </TabsContent>
                <TabsContent value="versions" className="mt-0">
                  <Card className="p-6 border-0 shadow-xl bg-white dark:bg-gray-950">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold">Deployment History</h3>
                        <p className="text-xs text-gray-500 capitalize tracking-widest font-bold">Version Control for your Career</p>
                      </div>
                      <History className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="space-y-4">
                      {resumeVersions.length > 0 ? (
                        resumeVersions.map((v) => (
                          <div key={v.id} className="p-4 border-2 border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between group hover:border-blue-500 transition-all cursor-pointer">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-lg ${v.score > 80 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                <span className="font-bold text-lg">{v.score}%</span>
                              </div>
                              <div>
                                <p className="font-bold text-sm capitalize">{v.job}</p>
                                <p className="text-[10px] text-gray-500">{new Date(v.date).toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="sm" variant="outline" className="h-7 text-[10px]">Restore</Button>
                              <Button size="sm" variant="outline" className="h-7 text-[10px] text-red-500">Delete</Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl border-gray-100 dark:border-gray-800">
                          <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 font-bold capitalize text-xs">No Deployments Found</p>
                          <p className="text-[10px] text-gray-400 mt-1">Run an audit to save your first version.</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Preview Section - Conditionally shown on mobile */}
            {showMobilePreview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="shadow-xl border-0 overflow-hidden flex flex-col bg-gradient-to-br from-gray-100 to-gray-50">
                  <div className="p-4 bg-white border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Preview
                    </h2>
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Choose Template
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            "default",
                            "modern",
                            "professional",
                            "creative",
                            "minimalist",
                            "bold",
                          ] as const
                        ).map((template) => (
                          <Button
                            key={template}
                            variant={
                              templateName === template
                                ? "default"
                                : "outline"
                            }
                            className={`text-xs h-9 px-3 w-full transition-all duration-200 ${templateName === template
                              ? "bg-blue-600 text-white shadow-sm"
                              : "hover:bg-gray-50 border-gray-200"
                              }`}
                            onClick={() => handleTemplateChange(template)}
                          >
                            {template === "professional"
                              ? "Pro"
                              : template === "minimalist"
                                ? "Minimal"
                                : template.charAt(0).toUpperCase() +
                                template.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto bg-gray-200 p-4 min-h-[400px] flex justify-center">
                    <motion.div
                      key={templateName + (isMigratingTemplate ? '-migrating' : '')}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className={`w-full ${templateName === "creative" ? "max-w-full" : "max-w-[800px]"} bg-white shadow-2xl transition-all duration-300 ease-in-out`}
                    >
                      {isMigratingTemplate ? (
                        <div className="p-8 space-y-8 animate-pulse">
                          <div className="flex justify-between items-start">
                            <div className="space-y-3 w-1/2">
                              <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
                              <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
                            </div>
                            <div className="w-20 h-20 bg-gray-100 rounded-full"></div>
                          </div>
                          <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                                <div className="h-3 bg-gray-100 rounded-md w-3/4"></div>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-6 pt-4">
                            {[1, 2].map(i => (
                              <div key={i} className="space-y-3">
                                <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
                                <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                                <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <ResumePreview
                          data={resumeData}
                          templateName={templateName}
                          showAIChanges={showAIChanges}
                          jobDescription={jobDescription}
                          isScanning={isScanning}
                          scanStep={scanStep}
                          activeSection={steps[currentStep].title}
                        />
                      )}
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        ) : (
          /* Desktop Layout - Side by Side with Resizer */
          <div className="flex gap-0 max-w-full mx-auto relative">
            {/* Form Section */}
            <Card
              style={{ width: `${leftWidth}%` }}
              className="p-6 shadow-2xl border-r border-white/20 dark:border-white/5 dark:bg-black/40 backdrop-blur-xl bg-white/80 transition-all duration-500 ease-in-out z-10 rounded-none border-y-0 border-l-0 relative overflow-hidden"
            >
              {/* Glassmorphism Highlight Effects */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 opacity-30" />
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <Link to="/">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Home className="w-5 h-5" />
                    </Button>
                  </Link>
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold capitalize tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                      Resume Builder
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1"
                      >
                        <CheckCircle className="w-2 h-2" />
                        Auto-Save Active
                      </motion.span>
                    </h1>
                    <AnimatePresence mode="wait">
                      {lastSaved && (
                        <motion.span
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 capitalize tracking-tight flex items-center"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                          All changes saved at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Sticky Scorecard Indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    backgroundColor: realTimeATS?.score >= 80 ? "rgba(16, 185, 129, 0.1)" : realTimeATS?.score >= 60 ? "rgba(234, 179, 8, 0.1)" : "rgba(239, 68, 68, 0.1)"
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.5 }}
                  className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-colors duration-500 shadow-sm cursor-default ${realTimeATS?.score >= 80
                    ? "border-emerald-100 dark:border-emerald-800/50"
                    : realTimeATS?.score >= 60
                      ? "border-yellow-100 dark:border-yellow-800/50"
                      : "border-red-100 dark:border-red-800/50"
                    }`}
                >
                  <div className="relative">
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={`w-2.5 h-2.5 rounded-full absolute inset-0 ${realTimeATS?.score >= 80 ? "bg-emerald-500" : realTimeATS?.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                    />
                    <div className={`w-2.5 h-2.5 rounded-full relative ${realTimeATS?.score >= 80 ? "bg-emerald-600" : realTimeATS?.score >= 60 ? "bg-yellow-600" : "bg-red-600"
                      }`} />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] font-black capitalize tracking-tight ${realTimeATS?.score >= 80 ? "text-emerald-600" : realTimeATS?.score >= 60 ? "text-yellow-600" : "text-red-600"
                        }`}>
                        ATS Fitness
                      </span>
                      {realTimeATS?.score >= 80 && <Zap className="w-2 h-2 text-emerald-500 fill-emerald-500" />}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <motion.span
                        key={realTimeATS?.score}
                        initial={{ y: -5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-lg font-black text-gray-900 dark:text-white leading-none"
                      >
                        {realTimeATS?.score}
                      </motion.span>
                      <span className="text-[10px] font-bold text-gray-400">%</span>
                    </div>
                  </div>

                  {/* Subtle progress ring or mini-chart could go here */}
                  <div className="ml-1 flex gap-0.5 items-end h-3">
                    {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [`${h * 100}%`, `${(h * 0.5) * 100}%`, `${h * 100}%`] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                        className={`w-0.5 rounded-full ${realTimeATS?.score >= 80 ? "bg-emerald-500/50" : realTimeATS?.score >= 60 ? "bg-yellow-500/50" : "bg-red-500/50"
                          }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                  <TabsTrigger
                    value="form"
                    className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    Data Extraction
                  </TabsTrigger>
                  <TabsTrigger
                    value="analysis"
                    className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Audit Gauntlet
                  </TabsTrigger>
                  <TabsTrigger
                    value="generate"
                    className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    Generate
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="form" className="mt-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="mb-6">
                        <motion.h2
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                        >
                          {steps[currentStep].title}
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-gray-600 dark:text-gray-400"
                        >
                          Fill in your {steps[currentStep].title.toLowerCase()}{" "}
                          details
                        </motion.p>
                      </div>

                      <CurrentStepComponent
                        data={resumeData}
                        updateData={updateResumeData}
                      />

                      {/* Navigation Buttons */}
                      <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
                        <Button
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentStep === 0}
                          className="flex items-center space-x-2 transition-all duration-200 disabled:opacity-50 border-gray-200 dark:border-gray-800 dark:hover:bg-gray-800 h-11 px-6"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </Button>

                        {currentStep === steps.length - 1 ? (
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 shadow-sm transition-all duration-200 h-11 px-8"
                            onClick={() => setShowGenerateModal(true)}
                          >
                            <span>Generate Resume</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleNext}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 shadow-sm transition-all duration-200 h-11 px-8"
                          >
                            <span>Next</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-5 border border-gray-100 dark:border-gray-800"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-[10px] capitalize tracking-widest font-bold text-gray-500 dark:text-gray-300">
                                Builder progress
                              </p>
                              <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                                {completedSteps + 1} / {steps.length} sections complete
                              </h3>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] capitalize tracking-wider text-blue-600 dark:text-blue-400 font-bold">Platform Stats</p>
                              <div className="flex items-center mt-1 space-x-3">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    {localStorage.getItem("resume-creator-analytics-extractions") || "0"}
                                  </span>
                                  <span className="text-[8px] text-gray-500">Extractions</span>
                                </div>
                                <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-700" />
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    {versions.length}
                                  </span>
                                  <span className="text-[8px] text-gray-500">Versions</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                            <motion.div
                              className="h-full bg-blue-600"
                              initial={{ width: 0 }}
                              animate={{ width: `${((completedSteps + 1) / steps.length) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {remainingSteps >= 0
                              ? `Currently editing ${steps[currentStep].title}. Next: ${nextSectionTitle}.`
                              : "All sections complete — ready to generate!"}
                          </p>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Card className="p-5 border-dashed border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              Quick polish checklist
                            </p>
                            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                              <li>Lead bullets with strong action verbs.</li>
                              <li>
                                Back wins with data (e.g. "Cut costs by 12%").
                              </li>
                              <li>
                                Keep sentences under two lines for readability.
                              </li>
                            </ul>
                          </Card>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="analysis" className="mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ResumeAnalysisComponent
                      data={resumeData}
                      jobDescription={jobDescription}
                      onUpdateJD={handleUpdateJD}
                      onEnhance={handleEnhanceResume}
                      onExtractedData={handleExtractedData}
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="generate" className="mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ResumeGenerator
                      data={resumeData}
                      templateName={templateName}
                    />
                  </motion.div>
                </TabsContent>
              </Tabs>
            </Card>

            <AnimatePresence>
              {showCelebration && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 100 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -100 }}
                  className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
                >
                  <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-[2px] rounded-2xl shadow-2xl">
                    <div className="bg-white dark:bg-gray-900 px-8 py-6 rounded-2xl flex flex-col items-center text-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-yellow-400/50"
                      >
                        <Zap className="w-8 h-8 text-white fill-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Elite Resume!</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                          {displayScore}% ATS SCORE
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">You're in the top 1% of candidates!</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Resizer - Desktop Only */}
            {isPowerUserMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onMouseDown={startResize}
                onDoubleClick={(e) => e.preventDefault()}
                className="w-1.5 cursor-col-resize bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-600 transition-all select-none hidden md:flex items-center justify-center group/resizer z-50 overflow-visible"
                style={{ userSelect: "none" }}
              >
                <div className="w-1 h-8 bg-gray-300 dark:bg-gray-700 rounded-full group-hover/resizer:bg-white transition-colors" />
              </motion.div>
            )}

            {/* Preview Section */}
            <Card
              style={{ width: `${100 - leftWidth}%` }}
              className="shadow-xl border-0 overflow-hidden flex flex-col h-screen bg-slate-200 transition-all duration-300 ease-in-out hidden md:flex"
            >
              <div className="p-4 bg-white border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Design & Preview
                </h2>

                {/* AI CHANGES TOGGLE */}
                <div className="flex items-center justify-between p-2 mb-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-green-600" />
                    <span className="text-[10px] font-bold text-green-800 capitalize tracking-wider">Highlight AI Improvements</span>
                  </div>
                  <button
                    onClick={() => setShowAIChanges(!showAIChanges)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${showAIChanges ? 'bg-green-600' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showAIChanges ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Choose Template
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        "default",
                        "modern",
                        "professional",
                        "creative",
                        "minimalist",
                        "bold",
                      ] as const
                    ).map((template) => (
                      <Button
                        key={template}
                        variant={
                          templateName === template ? "default" : "outline"
                        }
                        className={`text-xs h-9 px-3 w-full transition-all duration-200 ${templateName === template
                          ? "bg-blue-600 text-white shadow-sm"
                          : "hover:bg-gray-50 border-gray-200"
                          }`}
                        onClick={() => handleTemplateChange(template)}
                      >
                        {template === "professional"
                          ? "Pro"
                          : template === "minimalist"
                            ? "Minimal"
                            : template.charAt(0).toUpperCase() +
                            template.slice(1).substring(0, 3)}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFullPreview(true)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-50/50 hover:bg-blue-100/50 border-blue-100 text-blue-700 transition-all duration-200 h-10"
                  >
                    <FileText className="w-4 h-4" />
                    View Full Preview
                  </Button>
                </div>

                {/* VERSION HISTORY */}
                <div className="mt-6 p-4 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-100 shadow-inner group/versions">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[10px] font-black capitalize tracking-widest text-gray-500 flex items-center gap-1.5">
                        <History className="w-3 h-3" />
                        Version History
                      </h4>
                      <motion.span
                        key={versions.length}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-1.5 py-0.5 rounded-full bg-blue-100 text-[8px] font-black text-blue-600 border border-blue-200"
                      >
                        {versions.length}
                      </motion.span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-100 transition-all flex items-center gap-1"
                            onClick={() => saveResumeVersion(realTimeATS.score)}
                          >
                            <Save className="w-2.5 h-2.5" />
                            Snapshot
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-[10px]">Create a manual restore point</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                    {versions.length === 0 ? (
                      <p className="text-[10px] text-gray-400 italic">No saved versions yet.</p>
                    ) : (
                      versions.map((v: any) => (
                        <div key={v.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100 group">
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-[11px] font-medium truncate">{v.name}</span>
                            <span className="text-[9px] text-gray-400">{new Date(v.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => loadResumeVersion(v)}
                          >
                            <ArrowRight className="w-3 h-3 text-blue-600" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-slate-200/50 p-6 md:p-10 lg:p-14 min-h-[600px] flex justify-center custom-scrollbar relative">
                {/* Visual Canvas Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                  <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full" />
                  <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 blur-[120px] rounded-full" />
                </div>

                <motion.div
                  key={templateName + (isMigratingTemplate ? '-migrating' : '')}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full ${templateName === "creative" ? "max-w-full" : "max-w-[840px]"} bg-white shadow-[0_25px_60px_rgba(0,0,0,0.15)] rounded-sm ring-1 ring-gray-950/10 transition-all duration-300 ease-in-out relative z-10 border border-gray-100/50`}
                >
                  {isMigratingTemplate ? (
                    <div className="p-8 space-y-8 animate-pulse">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 w-1/2">
                          <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
                          <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
                        </div>
                        <div className="w-20 h-20 bg-gray-100 rounded-full"></div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                            <div className="h-3 bg-gray-100 rounded-md w-3/4"></div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-6 pt-4">
                        {[1, 2].map(i => (
                          <div key={i} className="space-y-3">
                            <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
                            <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                            <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <ResumePreview
                      data={resumeData}
                      templateName={templateName}
                      showAIChanges={showAIChanges}
                      jobDescription={jobDescription}
                      isScanning={isScanning}
                      scanStep={scanStep}
                      activeSection={steps[currentStep].title}
                    />
                  )}
                </motion.div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Floating Chat Bot */}
      <FloatingChatBot resumeData={resumeData} jobDescription={jobDescription} />

      {/* Full Preview Modal */}
      <FullPreviewModal
        isOpen={showFullPreview}
        onClose={() => setShowFullPreview(false)}
        data={resumeData}
        templateName={templateName}
      />

      {/* Generate Modal */}
      <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export your resume</DialogTitle>
          </DialogHeader>
          <ResumeDownloadOptions
            data={resumeData}
            templateName={templateName}
            showHeading={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Builder;
