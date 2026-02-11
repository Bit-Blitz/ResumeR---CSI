import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Upload,
  FileText,
  Briefcase,
  Building2,
  Target,
  CheckCircle,
  AlertCircle,
  Loader2,
  Bot,
  Sparkles,
  Zap,
  Search,
  ShieldCheck,
  ArrowLeft,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeResume, ResumeAnalysis } from "@/services/groqService";
import { parseResumeFile } from "@/services/fileParserService";
import { useToast } from "@/hooks/use-toast";

const atsOptions = [
  { value: "workday", label: "Workday" },
  { value: "greenhouse", label: "Greenhouse" },
  { value: "lever", label: "Lever" },
  { value: "icims", label: "iCIMS" },
  { value: "taleo", label: "Taleo" },
  { value: "generic", label: "Generic ATS" }
];

const targetCompanies = [
  { value: "Google", label: "Google" },
  { value: "Meta", label: "Meta" },
  { value: "Amazon", label: "Amazon" },
  { value: "Netflix", label: "Netflix" },
  { value: "Apple", label: "Apple" },
  { value: "Microsoft", label: "Microsoft" },
  { value: "Goldman Sachs", label: "Goldman Sachs" }
];

export default function ATSScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(location.state?.file || null);
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [company, setCompany] = useState("");
  const [targetATS, setTargetATS] = useState("generic");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
    },
    maxFiles: 1
  });

  const handleScreen = async () => {
    if (!file || !jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please provide a resume and job description.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setAnalysis(null);

    const steps = [
      "Extracting text from document...",
      "OCR-Vision Analysis in progress...",
      "Simulating ATS parsing logic...",
      "Identifying keyword semantic gap...",
      "Generating recruiter readability score...",
      "Finalizing deep analysis report..."
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      setScanStep(steps[stepIdx]);
      stepIdx = (stepIdx + 1) % steps.length;
    }, 1500);

    try {
      // 1. Parse the file properly
      const rawText = await parseResumeFile(file);

      // 2. Analyze with AI
      const result = await analyzeResume(
        { personalInfo: { summary: rawText }, experience: [], skills: { technical: [] } },
        jobDescription,
        company,
        targetATS
      );

      setAnalysis(result);
      toast({
        title: "Screening Complete",
        description: "Your resume has been successfully audited against the job description.",
      });
    } catch (err) {
      console.error("ATS screening failed", err);
      toast({
        title: "Analysis Failed",
        description: "The AI agent couldn't process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      clearInterval(interval);
      setLoading(false);
      setScanStep("");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500 border-green-500 bg-green-500/10";
    if (score >= 60) return "text-amber-500 border-amber-500 bg-amber-500/10";
    return "text-red-500 border-red-500 bg-red-500/10";
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-gray-950 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/40">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back Home
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/LOGO.png" alt="ResumeR" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ResumeR Audit</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Side: Inputs */}
          <div className="lg:col-span-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                AI Adversarial <span className="text-blue-600">ATS Audit</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Bypass the bots. Our multi-agent committee ruthlessy critiques your CV against specific job parameters using raw ATS heuristics.
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <Card className="p-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-white/20 dark:border-white/5 shadow-2xl ring-1 ring-inset ring-gray-200 dark:ring-white/5">
              <div className="space-y-6">
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3 block">1. Target Parameters</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-xs font-bold text-gray-500 flex items-center gap-2">
                        <Building2 className="w-3 h-3" /> Company
                      </Label>
                      <Select value={company} onValueChange={setCompany}>
                        <SelectTrigger className="bg-white/50 dark:bg-black/20 border-gray-200 dark:border-white/10">
                          <SelectValue placeholder="Target Co." />
                        </SelectTrigger>
                        <SelectContent>
                          {targetCompanies.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ats" className="text-xs font-bold text-gray-500 flex items-center gap-2">
                        <Target className="w-3 h-3" /> Parser Engine
                      </Label>
                      <Select value={targetATS} onValueChange={setTargetATS}>
                        <SelectTrigger className="bg-white/50 dark:bg-black/20 border-gray-200 dark:border-white/10">
                          <SelectValue placeholder="Select ATS" />
                        </SelectTrigger>
                        <SelectContent>
                          {atsOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jd" className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">2. Job Description</Label>
                  <Textarea
                    id="jd"
                    rows={8}
                    className="bg-white/50 dark:bg-black/20 border-gray-200 dark:border-white/10 resize-none custom-scrollbar text-sm"
                    placeholder="Paste the full job description here (Role, Requirements, Stack)..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">3. Document Payload</Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${isDragActive ? "border-blue-600 bg-blue-50/50" : "border-gray-200 dark:border-white/10 bg-white/30 dark:bg-black/10 hover:border-blue-500/50"
                      }`}
                  >
                    <input {...getInputProps()} />
                    {file ? (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-full italic">{file.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-black mt-1">Payload Locked</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-4 text-xs h-8 text-red-500 hover:text-red-600"
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        >
                          <X className="w-3 h-3 mr-1" /> Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Upload className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">Upload Resume File</p>
                          <p className="text-[10px] text-gray-400 font-medium mt-1">PDF, DOCX up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleScreen}
                  disabled={!file || !jobDescription || loading}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="animate-pulse">{scanStep || "Analyzing..."}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 fill-white" />
                      Run Audit Engine
                    </div>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Side: Results */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white/20 dark:bg-black/10 rounded-3xl border border-white/10 backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/50 mb-8 relative">
                      <Bot className="w-12 h-12 text-white" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-950">
                        <Loader2 className="w-3 h-3 text-white animate-spin" />
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Initializing Multi-Agent Logic</h3>
                      <p className="text-sm font-bold text-blue-600 flex items-center justify-center gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                        {scanStep}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : analysis ? (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <Card className="p-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border-white/30 dark:border-white/5 shadow-2xl relative overflow-hidden ring-1 ring-inset ring-gray-100 dark:ring-white/5">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <ShieldCheck className="w-32 h-32" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">Audit Verdict</p>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                          {analysis.score >= 80 ? "Optimized Pass" : analysis.score >= 60 ? "Marginal Fit" : "High Rejection Risk"}
                        </h2>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`w-28 h-28 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed ${getScoreColor(analysis.score)}`}>
                          <span className="text-4xl font-black leading-none">{analysis.score}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest mt-1">Audit Score</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                      <div className="p-6 bg-white/50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                          <Target className="w-5 h-5 text-indigo-500" />
                          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">ATS Compliance</h4>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-2xl font-black text-indigo-600">{analysis.atsCompatibility.score}%</span>
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Matched</span>
                        </div>
                        <ul className="space-y-2">
                          {analysis.atsCompatibility.issues.map((i, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              {i}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-6 bg-white/50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                          <Zap className="w-5 h-5 text-amber-500" />
                          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Semantic Match</h4>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-2xl font-black text-amber-600">{analysis.semanticRelevancy?.score || Math.max(50, analysis.score - 10)}%</span>
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Relevancy</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed italic">
                          "{analysis.semanticRelevancy?.gapAnalysis || analysis.matchReasoning}"
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                          <Search className="w-4 h-4" /> Recruiter Logic Summary
                        </h3>
                        <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed italic">
                            "{analysis.agentCritiques?.recruiter || analysis.matchReasoning}"
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" /> Technical Strengths
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {analysis.strengths.slice(0, 5).map((s, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-green-500/5 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900 font-bold text-[10px] py-1">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                            <X className="w-3 h-3" /> Critical Gaps
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {analysis.missingKeywords.slice(0, 8).map((k, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-red-500/5 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900 font-bold text-[10px] py-1">
                                {k}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => navigate("/builder")}
                        className="w-full h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl"
                      >
                        Open Builder to Inject Keywords
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white/10 dark:bg-black/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10 opacity-60">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                    <Bot className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Audit Engine Idle</h3>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">Upload a resume and paste a job description to trigger the multi-agent committee review.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}