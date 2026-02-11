import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Target,
  TrendingUp,
  Zap,
  Award,
  BookOpen,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const tipCategories = [
  {
    id: "impact",
    icon: <Target className="w-5 h-5" />,
    label: "Impact",
    color: "bg-purple-500",
    tips: [
      {
        title: "Result-Oriented Mapping",
        description:
          "Transform passive duties into measurable results. Recruiters and AI systems look for quantifiable growth and ownership.",
        example: {
          bad: "Responsible for improving team efficiency",
          good: "Engineered automated workflow pipeline that slashed deployment latency by 42% for 200k+ users",
        },
      },
      {
        title: "The Metric-First Strategy",
        description:
          "Start bullet points with hard numbers. This catches the attention of human recruiters and improves ATS relevance.",
        example: {
          bad: "Helped with marketing and sales",
          good: "Spearheaded $2M revenue growth by optimizing top-of-funnel conversion via A/B tested AI models",
        },
      },
    ],
  },
  {
    id: "keywords",
    icon: <Zap className="w-5 h-5" />,
    label: "Keywords",
    color: "bg-blue-500",
    tips: [
      {
        title: "Strategic Keyword Placement",
        description:
          "Embed keywords naturally within your achievement context. Modern ATS uses natural language processing to verify skill depth.",
        example: {
          bad: "Skills: React, Node, AWS, Docker",
          good: "Orchestrated containerized microservices using Docker and AWS EKS to support React-based frontend scaling",
        },
      },
      {
        title: "Job Description Alignment",
        description:
          "Align your resume with the specific technical requirements of the job description for better matching.",
        example: {
          bad: "Worked on many different projects",
          good: "Developed cross-platform solutions aligning with [Target Company]'s tech stack architecture",
        },
      },
    ],
  },
  {
    id: "format",
    icon: <Award className="w-5 h-5" />,
    label: "Structure",
    color: "bg-blue-600",
    tips: [
      {
        title: "ATS-Friendly Layout",
        description:
          "Avoid multi-column layouts or complex graphics. Simple, clean, single-column structures are easily parsed by all systems.",
        example: {
          bad: "Two-column creative resume with charts",
          good: "Single-column reverse chronological layout with standard section headers (Experience, Skills, Education)",
        },
      },
      {
        title: "Consistent Impact Metrics",
        description:
          "Ensure every experience block contains at least one measurable metric for professional consistency.",
        example: {
          bad: "List of tasks without numbers",
          good: "Each bullet point formatted as: [Action Verb] + [Quantifiable Task] + [Result/Impact]",
        },
      },
    ],
  },
  {
    id: "action",
    icon: <TrendingUp className="w-5 h-5" />,
    label: "Experience",
    color: "bg-blue-700",
    tips: [
      {
        title: "Professional Action Verbs",
        description:
          "Replace passive verbs like 'helped' or 'worked' with strong, professional action verbs.",
        example: {
          bad: "Helped build a new app",
          good: "Pioneered, Architected, Scaled, Optimized, or Transformed...",
        },
      },
      {
        title: "Seniority & Professionalism",
        description:
          "Use precise language that demonstrates leadership, autonomy, and professional seniority.",
        example: {
          bad: "Was a member of the development team",
          good: "Spearheaded technical roadmap for the core infrastructure squad",
        },
      },
    ],
  },
];

const resumeExamples = [
  {
    role: "Software Engineer",
    icon: "💻",
    summary:
      "Results-driven software engineer with 4+ years building scalable applications. Reduced deployment time by 60% through CI/CD implementation.",
    highlights: [
      "Architected microservices handling 1M+ daily requests",
      "Mentored 5 junior developers, improving team velocity by 40%",
      "Open-source contributor with 2K+ GitHub stars",
    ],
  },
  {
    role: "Product Manager",
    icon: "📊",
    summary:
      "Strategic product leader who launched 3 products generating $5M ARR. Expert in data-driven decision making and cross-functional leadership.",
    highlights: [
      "Grew user base from 10K to 500K in 18 months",
      "Achieved 92 NPS score through customer-centric design",
      "Reduced churn by 25% with targeted feature releases",
    ],
  },
  {
    role: "UX Designer",
    icon: "🎨",
    summary:
      "Human-centered designer with a track record of increasing conversion rates by 150%. Passionate about accessible, inclusive design systems.",
    highlights: [
      "Redesigned checkout flow, boosting completion by 34%",
      "Created design system adopted by 8 product teams",
      "Led usability studies with 200+ participants",
    ],
  },
];

export default function ResumeTipsSection() {
  const [activeCategory, setActiveCategory] = useState(tipCategories[0].id);
  const [activeTipIndex, setActiveTipIndex] = useState(0);

  const currentCategory = tipCategories.find((c) => c.id === activeCategory);
  const currentTip = currentCategory?.tips[activeTipIndex];

  return (
    <section className="relative overflow-hidden py-24 bg-white dark:bg-black transition-colors duration-500">
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="container mx-auto w-full max-w-7xl px-4 relative">
        {/* Massive Header - Brutalist Style */}
        <div className="relative mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="absolute -top-12 -left-4 text-[12rem] font-black text-gray-100 dark:text-gray-900/30 select-none hidden lg:block capitalize tracking-tighter leading-none"
          >
            Optimize
          </motion.div>
          
          <div className="relative z-10 pl-4 border-l-8 border-blue-600">
            <div className="flex items-center gap-4 mb-4 font-mono text-xs font-black capitalize tracking-[0.3em] text-blue-600 dark:text-blue-400">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              System Status: Analyzing
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-gray-900 dark:text-white capitalize tracking-tighter leading-[0.8] mb-6">
              Optimize Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-600">
                Career
              </span>
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl font-bold capitalize tracking-tight leading-tight">
              Improve your resume's visibility with data-driven content and professional keyword optimization.
            </p>
          </div>
        </div>

        {/* Main Console Layout */}
        <div className="relative flex flex-col lg:flex-row gap-0 border border-gray-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden bg-gray-50/50 dark:bg-gray-950/50 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]">
          
          {/* Left Navigation - Sidebar Console */}
          <div className="w-full lg:w-72 border-r border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/20 p-8 flex flex-col gap-4">
            <div className="font-mono text-[10px] font-black capitalize tracking-widest text-gray-400 mb-4 flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
              Category Selector
            </div>
            {tipCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setActiveTipIndex(0);
                }}
                className={`group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
                  activeCategory === category.id
                    ? "bg-white dark:bg-white/10 shadow-xl scale-[1.02]"
                    : "hover:bg-gray-100 dark:hover:bg-white/5 opacity-50 hover:opacity-100"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12`}>
                  {category.icon}
                </div>
                <div className="text-left">
                  <div className="text-xs font-black capitalize tracking-widest text-gray-900 dark:text-white">{category.label}</div>
                  <div className="text-[10px] font-mono text-gray-500 capitalize">View professional tips</div>
                </div>
                {activeCategory === category.id && (
                  <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-8 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Center Content - Main Terminal Area */}
          <div className="flex-1 p-8 lg:p-16 relative overflow-hidden">
            {/* Terminal Decorations */}
            <div className="absolute top-8 right-8 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-blue-600" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${activeTipIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "anticipate" }}
              >
                <div className="flex items-center gap-3 mb-12">
                  <div className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 font-mono text-[10px] font-black capitalize tracking-widest text-gray-500 dark:text-gray-400">
                    Vault ID: {activeCategory.toUpperCase()}-{activeTipIndex + 1}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent" />
                </div>

                <h3 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white capitalize tracking-tighter leading-none mb-8">
                  {currentTip?.title}
                </h3>
                
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-16 font-medium leading-tight max-w-3xl">
                  {currentTip?.description}
                </p>

                {/* Example Comparison - Code Style */}
                <div className="grid md:grid-cols-2 gap-12 mb-16">
                  <div className="relative group">
                    <div className="absolute -top-4 -left-4 px-3 py-1 bg-yellow-600 text-white text-[10px] font-black capitalize tracking-widest z-10">
                      Area for Improvement
                    </div>
                    <div className="p-8 pt-10 rounded-3xl bg-yellow-500/5 border border-yellow-500/10 font-mono text-sm text-gray-600 dark:text-yellow-200/60 leading-relaxed shadow-inner">
                      {currentTip?.example.bad}
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute -top-4 -left-4 px-3 py-1 bg-blue-500 text-white text-[10px] font-black capitalize tracking-widest z-10">
                      Optimized Content
                    </div>
                    <div className="p-8 pt-10 rounded-3xl bg-blue-500/5 border border-blue-500/10 font-mono text-sm text-gray-900 dark:text-blue-200 leading-relaxed shadow-inner">
                      {currentTip?.example.good}
                    </div>
                  </div>
                </div>

                {/* Internal Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveTipIndex((prev) => Math.max(0, prev - 1))}
                      disabled={activeTipIndex === 0}
                      className="w-12 h-12 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-20 transition-all"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <button
                      onClick={() => setActiveTipIndex((prev) => Math.min((currentCategory?.tips.length || 1) - 1, prev + 1))}
                      disabled={activeTipIndex === (currentCategory?.tips.length || 1) - 1}
                      className="flex items-center gap-4 bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black capitalize tracking-widest text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                    >
                      Next Tip <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="hidden sm:flex items-center gap-8 font-mono text-[10px] font-black text-gray-400 capitalize tracking-widest">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-1 bg-blue-600" />
                      Step {activeTipIndex + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-1 bg-gray-200 dark:bg-white/10" />
                      Total 02
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Overlapping Benchmark Section */}
        <div className="mt-32 relative">
          <div className="flex flex-col lg:flex-row items-end gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-600 text-white font-black capitalize tracking-widest text-[10px] mb-8">
                <BookOpen className="w-4 h-4" />
                Live Benchmarks
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white capitalize tracking-tighter leading-none mb-8">
                Verified<br />Outputs
              </h3>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-bold capitalize tracking-tight max-w-md">
                Cross-referenced with Tier-1 engineering benchmarks and ATS parsing engines.
              </p>
            </div>

            <div className="w-full lg:w-auto flex flex-col md:flex-row gap-6">
              {resumeExamples.map((example, index) => (
                <motion.div
                  key={example.role}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full md:w-80 group"
                >
                  <div className="relative p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-2xl hover:border-blue-600/50 transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 group-hover:scale-110 transition-all text-4xl">
                      {example.icon}
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="px-3 py-1 bg-lime-500 text-black text-[10px] font-black capitalize tracking-widest">
                          98% PASS
                        </div>
                        <div className="h-px w-8 bg-gray-200 dark:bg-white/10" />
                      </div>
                      
                      <h4 className="text-xl font-black text-gray-900 dark:text-white capitalize tracking-tight mb-4">{example.role}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold capitalize tracking-tight italic mb-8 leading-relaxed">
                        "{example.summary}"
                      </p>
                      
                      <div className="space-y-3">
                        {example.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-3 font-mono text-[10px] text-gray-400 capitalize tracking-tight leading-none">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                            {h}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final Floating CTA */}
          <div className="mt-24 flex justify-center">
            <Link to="/resume-guide" className="relative group">
              <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <button className="relative flex items-center gap-8 bg-white dark:bg-white text-gray-900 dark:text-black px-12 py-8 rounded-[2rem] font-black capitalize tracking-[0.3em] text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all">
                Full Resume Guide
                <ArrowRight className="w-6 h-6 group-hover:translate-x-4 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
