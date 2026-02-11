import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
const MotionCard = motion(Card);
import { FileText, User, Users, Edit, MessageSquare, Menu, X, Code, ShieldCheck, AlertCircle, CheckCircle2, Ghost, Zap, BarChart3, Search, ArrowRight, LayoutTemplate, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/layout/Footer";
import LogoLoop from "@/components/LogoLoop";
import ResumeTipsSection from "@/components/resume/ResumeTipsSection";
import { GridScan } from "@/components/GridScan";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiVite,
  SiVercel,
  SiFigma,
  SiGithub,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiGooglecloud,
  SiFirebase,
} from "react-icons/si";

// Create a larger array of logos for better animation
const techLogos = [
  {
    node: <SiReact className="text-[#61DAFB]" size={48} />,
    title: "React",
    href: "https://react.dev",
  },
  {
    node: <SiNextdotjs className="text-white" size={48} />,
    title: "Next.js",
    href: "https://nextjs.org",
  },
  {
    node: <SiTypescript className="text-[#3178C6]" size={48} />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss className="text-[#06B6D4]" size={48} />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  {
    node: <SiVite className="text-[#646CFF]" size={48} />,
    title: "Vite",
    href: "https://vitejs.dev",
  },
  {
    node: <SiVercel className="text-white" size={48} />,
    title: "Vercel",
    href: "https://vercel.com",
  },
  {
    node: <SiFigma className="text-[#F24E1E]" size={48} />,
    title: "Figma",
    href: "https://figma.com",
  },
  {
    node: <SiGithub className="text-white" size={48} />,
    title: "GitHub",
    href: "https://github.com",
  },
  {
    node: <SiNodedotjs className="text-[#339933]" size={48} />,
    title: "Node.js",
    href: "https://nodejs.org",
  },
  {
    node: <SiExpress className="text-white" size={48} />,
    title: "Express",
    href: "https://expressjs.com",
  },
  {
    node: <SiMongodb className="text-[#47A248]" size={48} />,
    title: "MongoDB",
    href: "https://mongodb.com",
  },
  {
    node: <SiDocker className="text-[#2496ED]" size={48} />,
    title: "Docker",
    href: "https://docker.com",
  },
  {
    node: <SiGooglecloud className="text-white" size={48} />,
    title: "Google Cloud",
    href: "https://cloud.google.com",
  },
  {
    node: <SiFirebase className="text-[#FFCA28]" size={48} />,
    title: "Firebase",
    href: "https://firebase.google.com",
  },
];

import { useState, useRef } from "react";
import TestimonialsSection from "@/components/TestimonialsSection";
import ReviewForm from "@/components/ReviewForm";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleReviewSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      // Navigate to ATS Audit screen and pass the file
      navigate("/ats-screen", { state: { file } });
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-hidden font-sans transition-colors duration-300">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-white/80 dark:bg-gray-950/80 sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img alt="ResumeR" src="/LOGO.png" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ResumeR
              </span>
            </Link>

            {/* Navigation Actions */}
            <div className="flex items-center gap-6">
              {/* Desktop Menu Items - Always visible on desktop */}
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/coding-prep" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Coding Prep
                </Link>
                <Link to="/interview-questions" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Interview Prep
                </Link>
                <Link to="/soft-skills" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Soft Skills
                </Link>
                <Link to="/ats-screen" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  ATS Screen
                </Link>
                <Link to="/builder">
                  <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl font-bold capitalize tracking-wide text-xs"
                  >
                    Create your resume
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />

                {/* Hamburger Button - Only visible on Mobile */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  className="md:hidden text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 relative w-10 h-10 rounded-lg transition-all duration-300"
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Menu
                      className={`w-6 h-6 transition-all duration-300 ease-out ${isMenuOpen
                        ? 'opacity-0 rotate-90 scale-0'
                        : 'opacity-100 rotate-0 scale-100'
                        }`}
                    />
                    <X
                      className={`w-6 h-6 absolute transition-all duration-300 ease-out ${isMenuOpen
                        ? 'opacity-100 rotate-0 scale-100'
                        : 'opacity-0 -rotate-90 scale-0'
                        }`}
                    />
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Dropdown - Vertical list for mobile only */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="mt-4 pb-4">
                  <div className="flex flex-col space-y-3">
                    <Link to="/builder" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-300 font-medium"
                      >
                        <FileText className="w-5 h-5 mr-3" />
                        Create your resume
                      </Button>
                    </Link>
                    <Link to="/interview-questions" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-green-600 dark:hover:border-green-400 hover:text-green-600 dark:hover:text-green-400 px-4 py-3 rounded-lg transition-all duration-300 font-medium"
                      >
                        <MessageSquare className="w-5 h-5 mr-3" />
                        Interview Prep
                      </Button>
                    </Link>
                    <Link to="/soft-skills" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-3 rounded-lg transition-all duration-300 font-medium"
                      >
                        <Users className="w-5 h-5 mr-3" />
                        Soft Skills
                      </Button>
                    </Link>
                    <Link to="/ats-screen" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-3 rounded-lg transition-all duration-300 font-medium"
                      >
                        <Target className="w-5 h-5 mr-3" />
                        ATS Screen
                      </Button>
                    </Link>
                    <Link to="/coding-prep" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-purple-600 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 px-4 py-3 rounded-lg transition-all duration-300 font-medium"
                      >
                        <Code className="w-5 h-5 mr-3" />
                        Coding Prep
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section with GridScan Background */}
      <div className="relative min-h-[85vh] bg-gray-50 dark:bg-gray-950 transition-colors duration-300 overflow-hidden ">
        {/* Simplified Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          {/* Tech Orbs - Subtle, no pulsing to avoid distraction */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/[0.02] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/[0.02] rounded-full blur-[120px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-24 flex flex-col lg:flex-row items-center min-h-[85vh] gap-12">
          <div className="text-center lg:text-left max-w-4xl mx-auto lg:mx-0 w-full lg:w-3/5">
            <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-bold mb-6 animate-fade-in backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 capitalize tracking-wide">
              Live: Professional Resume Optimizer
            </div>
            <div className="relative inline-block">
              <h1 className="text-4xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.1] animate-fade-in tracking-wide">
                Optimize Your
                <span className="text-blue-600 dark:text-blue-400 block sm:inline">
                  {" "}
                  Resume for ATS{" "}
                </span>
                with AI
              </h1>
              {/* Hardware-accelerated scanning line */}
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent z-20 will-change-transform pointer-events-none"
                animate={{ y: ["0vh", "60vh", "0vh"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-delayed bg-white/40 dark:bg-zinc-900/40 p-6 rounded-2xl border border-white/10 dark:border-white/10 shadow-2xl tracking-tight">
              Create a professional resume that passes through
              <span className="font-bold text-blue-600 dark:text-blue-400"> Workday, Greenhouse, and Lever </span>
              filters with ease. Our AI-driven platform analyzes your CV just like a top recruiter.
            </p>

            {/* Quick Scan Dropzone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ delay: 0.8 }}
              onClick={triggerFileSelect}
              className="mb-10 p-6 bg-white/40 dark:bg-zinc-900/20 ring-1 ring-inset ring-gray-200 dark:ring-white/10 rounded-2xl hover:ring-blue-500/50 transition-all group cursor-pointer backdrop-blur-sm shadow-sm"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white capitalize tracking-wide">Free Resume Scan</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 tracking-tight">Upload your resume for a professional ATS analysis</p>
                </div>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileSelect();
                  }}
                  className="border-gray-200 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10"
                >
                  Select File
                </Button>
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-scale-in">
              <Link to="/ats-screen">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-bold text-lg border border-transparent capitalize tracking-wide"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Get your resume Rated
                </Button>
              </Link>
              <Link to="/builder">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 px-8 py-6 rounded-xl transition-all duration-300 font-bold text-lg tracking-wide"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Create your resume
                </Button>
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:block w-2/5"
          >
            <MotionCard
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
              className="p-8 bg-white dark:bg-gray-900 ring-1 ring-inset ring-gray-100 dark:ring-white/5 shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />

              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[10px] font-bold capitalize tracking-wide text-blue-600 dark:text-blue-400 mb-1">Live Analysis</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">Optimization Report</h3>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-3 capitalize tracking-wide text-gray-500">
                    <span>ATS Readiness Score</span>
                    <span className="text-blue-600">94%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "94%" }}
                      transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                      className="h-full bg-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl ring-1 ring-inset ring-gray-100 dark:ring-white/5">
                    <p className="text-[10px] font-bold text-gray-400 capitalize mb-1 tracking-wide">Workday</p>
                    <p className="text-lg font-bold text-blue-600 tracking-wide">PASSED</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl ring-1 ring-inset ring-gray-100 dark:ring-white/5">
                    <p className="text-[10px] font-bold text-gray-400 capitalize mb-1 tracking-wide">Greenhouse</p>
                    <p className="text-lg font-bold text-blue-600 tracking-wide">PASSED</p>
                  </div>
                </div>

                <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl ring-1 ring-inset ring-blue-100 dark:ring-blue-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 capitalize tracking-wide">AI Insight</p>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed tracking-tight">
                    Quantify your impact in the "Experience" section to reach 98% compatibility.
                  </p>
                </div>
              </div>
            </MotionCard>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-32 dark:bg-gray-950 transition-colors duration-300">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 capitalize tracking-tight">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our AI-powered tool helps you create resumes that stand out to both recruiters and automated systems.
          </p>
        </div>

        {/* Chronological Timeline */}
        <div className="max-w-4xl mx-auto mb-32 relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-lime-500 hidden md:block" />

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Upload",
                desc: "Upload your existing resume. Our AI instantly analyzes your experience without any manual entry.",
                icon: <FileText className="w-6 h-6 text-blue-500" />,
                color: "blue"
              },
              {
                step: "02",
                title: "Analyze",
                desc: "Our AI committee reviews your resume to identify key areas for improvement.",
                icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
                color: "purple"
              },
              {
                step: "03",
                title: "Optimize",
                desc: "AI rewrites your bullet points with relevant keywords and professional impact metrics.",
                icon: <Edit className="w-6 h-6 text-blue-500" />,
                color: "blue"
              },
              {
                step: "04",
                title: "Download",
                desc: "Export a professional, ATS-friendly PDF optimized for all major hiring platforms.",
                icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
                color: "green"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-8 relative"
              >
                <div className={`hidden md:flex w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/30 items-center justify-center shrink-0 z-10 border border-blue-200/50`}>
                  {item.icon}
                </div>
                <div className="flex-1 p-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl hover:shadow-2xl transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`text-sm font-black text-blue-600 dark:text-blue-400 capitalize tracking-widest`}>Step {item.step}</span>
                    <div className={`h-px flex-1 bg-blue-200/50 dark:bg-blue-800/50`} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white capitalize mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-32">
          <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 border border-white/10 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm animate-slide-in-left group hover:border-blue-500/50 dark:hover:border-blue-500/50">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
              <User className="w-10 h-10 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 capitalize tracking-tight">
              Smart Resume Upload
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Quickly upload your resume in any format. Our AI extracts your professional history automatically.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 border border-white/10 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm animate-fade-in animation-delay-200 group hover:border-blue-500/50 dark:hover:border-blue-500/50">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 transition-all duration-500 group-hover:-rotate-12 group-hover:scale-110">
              <Edit className="w-10 h-10 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 capitalize tracking-tight">
              AI-Powered Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              A team of specialized AI agents analyzes your resume from multiple professional perspectives.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 border border-white/10 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm animate-slide-in-right group hover:border-blue-500/50 dark:hover:border-blue-500/50">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
              <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 capitalize tracking-tight">
              ATS Optimization
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Download resumes designed to pass through top applicant tracking systems with high scores.
            </p>
          </Card>
        </div>

        {/* AI Committee Visualizer */}
        <div className="max-w-6xl mx-auto py-24 border-y border-white/10">
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 capitalize tracking-tight">
              Meet the AI Review Team
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Four specialized AI agents that simulate the hiring process to ensure your resume is effective.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "The Recruiter",
                role: "Professional Review",
                desc: "Scans for professional impact and metrics that catch a human eye instantly.",
                icon: <Search className="w-8 h-8 text-blue-500" />,
                color: "blue"
              },
              {
                name: "The Content Optimizer",
                role: "Professional Writing",
                desc: "Rewrites bullet points into clear, professional achievement statements.",
                icon: <Zap className="w-8 h-8 text-blue-600" />,
                color: "blue"
              },
              {
                name: "The ATS Specialist",
                role: "Optimization Expert",
                desc: "Ensures your resume is perfectly formatted for automated tracking systems.",
                icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
                color: "blue"
              },
              {
                name: "The Market Analyst",
                role: "Industry Benchmarking",
                desc: "Compares your skills against top professional standards in your field.",
                icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
                color: "blue"
              }
            ].map((agent, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full flex flex-col items-center text-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-white/10 hover:border-white/20 transition-all group">
                  <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center bg-blue-100 dark:bg-blue-950/30 group-hover:scale-110 transition-transform`}>
                    {agent.icon}
                  </div>
                  <h4 className="text-lg font-black text-gray-900 dark:text-white capitalize mb-1">{agent.name}</h4>
                  <p className={`text-[10px] font-bold text-blue-600 dark:text-blue-400 capitalize tracking-widest mb-3`}>{agent.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{agent.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <ResumeTipsSection />

      <TestimonialsSection refreshTrigger={refreshTrigger} />
      <ReviewForm onReviewSubmitted={handleReviewSubmitted} />

      {/* Built with Section (Simplified Logo Loop) */}
      <section className="py-12 border-t border-white/10 dark:bg-gray-950 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] font-black capitalize tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-8">
            Powered by Advanced AI Technology
          </p>
          <div className="max-w-4xl mx-auto opacity-50 hover:opacity-100 transition-opacity">
            <LogoLoop
              logos={techLogos}
              speed={40}
              direction="left"
              width="100%"
              logoHeight={32}
              gap={40}
              fadeOut={true}
              fadeOutColor="transparent"
              scaleOnHover={true}
              pauseOnHover={true}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
