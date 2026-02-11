import { ResumeData } from "@/pages/Builder";
import ModernTemplate from "./templates/ModernTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import MinimalistTemplate from "./templates/MinimalistTemplate";
import BoldTemplate from "./templates/BoldTemplate";
import { motion } from "framer-motion";
import { Bot, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResumePreviewProps {
  data: ResumeData;
  templateName?:
  | "default"
  | "modern"
  | "professional"
  | "creative"
  | "minimalist"
  | "bold";
  showAIChanges?: boolean;
  jobDescription?: string;
  isScanning?: boolean;
  scanStep?: string;
  activeSection?: string;
}

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const characters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      display: "inline",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      display: "none",
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {characters.map((char, index) => (
        <motion.span key={index} variants={child}>
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const getRecruiterLogic = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes("spearheaded") || t.includes("led") || t.includes("managed")) {
    return "Recruiters prioritize 'Ownership Verbs'. Changing passive voice to active leadership verbs increases perceived seniority.";
  }
  if (t.includes("%") || t.includes("$") || t.includes("reduced") || t.includes("increased")) {
    return "Data-driven results. Quantifying your impact with metrics is the #1 way to build trust with hiring managers.";
  }
  if (t.includes("architected") || t.includes("designed") || t.includes("implemented")) {
    return "Technical Authority. Using precise engineering terminology demonstrates depth of expertise in the stack.";
  }
  return "Impact Optimization. AI has refined this phrasing to be more concise and aligned with industry-standard ATS patterns.";
};

const ResumePreview = ({
  data,
  templateName = "default",
  showAIChanges = false,
  jobDescription = "",
  isScanning = false,
  scanStep = "",
  activeSection = "",
}: ResumePreviewProps) => {
  const highlightKeywords = (text: string) => {
    if (!jobDescription || !text) return text;

    // Extract keywords from JD
    const keywords = jobDescription
      .toLowerCase()
      .split(/[\s,.]+/)
      .filter(w => w.length > 4);

    const uniqueKeywords = [...new Set(keywords)];

    let highlightedText = text;
    uniqueKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="bg-yellow-100 text-yellow-800 px-0.5 rounded">$1</span>');
    });

    return highlightedText;
  };

  const highlightChanges = (text: string) => {
    const textWithKeywords = highlightKeywords(text);
    if (!showAIChanges) return <span dangerouslySetInnerHTML={{ __html: textWithKeywords.replace(/\[AI\]|\[\/AI\]/g, "") }} />;

    // Split the text by [AI] tags to highlight specific parts
    const parts = textWithKeywords.split(/(\[AI\].*?\[\/AI\])/g);

    return parts.map((part, i) => {
      if (part.startsWith("[AI]") && part.endsWith("[/AI]")) {
        const content = part.replace(/\[AI\]|\[\/AI\]/g, "");
        return (
          <TooltipProvider key={i}>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <span className="relative inline-block px-1 rounded bg-green-100 text-green-900 border-b-2 border-green-500 font-medium cursor-help group">
                  <TypewriterText text={content} />
                  <span className="absolute -top-3 left-0 text-[8px] font-black capitalize text-green-600 tracking-tight flex items-center gap-0.5">
                    AI-Improved
                    <HelpCircle className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-zinc-900 text-white border-blue-500/50 p-3 shadow-2xl ring-1 ring-inset ring-white/10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black capitalize tracking-wide text-blue-400">Recruiter Logic</p>
                  <p className="text-xs leading-relaxed tracking-tight">{getRecruiterLogic(content)}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  if (isScanning) {
    const skeletonVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };

    return (
      <div className="bg-white p-8 shadow-lg rounded-lg min-h-full font-resume-serif transition-colors duration-300 relative overflow-hidden ring-1 ring-inset ring-gray-100">
        {/* Skeleton Header */}
        <div className="border-b-2 border-gray-100 pb-6 mb-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={skeletonVariants}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-8 bg-gray-100 rounded-lg w-1/3 mb-4 overflow-hidden relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          <div className="flex gap-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={skeletonVariants}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
              className="h-4 bg-gray-50 rounded w-24 overflow-hidden relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.1 }}
              />
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={skeletonVariants}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
              className="h-4 bg-gray-50 rounded w-32 overflow-hidden relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
              />
            </motion.div>
          </div>
        </div>

        {/* AI Scanning Status Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm z-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl shadow-2xl ring-1 ring-inset ring-blue-100 flex flex-col items-center space-y-6 max-w-sm w-full mx-4"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 relative overflow-hidden">
              <Bot className="w-9 h-9 text-white relative z-10" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-blue-400/20 to-transparent"
                animate={{ y: ["100%", "-100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black capitalize tracking-wide text-blue-600">Vision Analysis in Progress</p>
              <p className="text-base font-bold text-gray-900 px-2 leading-tight">{scanStep || "Analyzing Resume..."}</p>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-blue-600"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>

        {/* Skeleton Body Sections */}
        <div className="space-y-8 opacity-40">
          {/* Summary Skeleton */}
          <div className="space-y-3">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={skeletonVariants}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
              className="h-5 bg-gray-100 rounded w-1/4 mb-4"
            />
            <motion.div
              initial="hidden"
              animate="visible"
              variants={skeletonVariants}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
              className="h-3 bg-gray-50 rounded w-full"
            />
            <motion.div
              initial="hidden"
              animate="visible"
              variants={skeletonVariants}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
              className="h-3 bg-gray-50 rounded w-5/6"
            />
          </div>

          {/* Experience Skeleton */}
          <div className="space-y-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={skeletonVariants}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeInOut" }}
              className="h-5 bg-gray-100 rounded w-1/4 mb-4"
            />
            {[1, 2].map((i, idx) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={skeletonVariants}
                    transition={{ duration: 0.8, delay: 0.7 + (idx * 0.3), ease: "easeInOut" }}
                    className="h-4 bg-gray-100 rounded w-1/3"
                  />
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={skeletonVariants}
                    transition={{ duration: 0.8, delay: 0.8 + (idx * 0.3), ease: "easeInOut" }}
                    className="h-3 bg-gray-50 rounded w-20"
                  />
                </div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={skeletonVariants}
                  transition={{ duration: 0.8, delay: 0.9 + (idx * 0.3), ease: "easeInOut" }}
                  className="h-3 bg-gray-50 rounded w-full"
                />
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={skeletonVariants}
                  transition={{ duration: 0.8, delay: 1.0 + (idx * 0.3), ease: "easeInOut" }}
                  className="h-3 bg-gray-50 rounded w-4/5"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getHighlightClass = (sectionName: string) => {
    return activeSection === sectionName
      ? "ring-2 ring-blue-500/50 ring-offset-4 rounded-sm bg-blue-50/30 transition-all duration-500"
      : "transition-all duration-500";
  };

  return (
    <div className="relative group/canvas p-12 bg-zinc-100 min-h-full flex items-start justify-center overflow-auto custom-scrollbar transition-colors duration-500">
      {/* Decorative Canvas Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[850px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.15)] transition-shadow duration-700 rounded-sm"
      >
        {(() => {
          try {
            if (templateName === "modern") return <ModernTemplate data={data} showAIChanges={showAIChanges} jobDescription={jobDescription} activeSection={activeSection} />;
            if (templateName === "professional") return <ProfessionalTemplate data={data} showAIChanges={showAIChanges} jobDescription={jobDescription} activeSection={activeSection} />;
            if (templateName === "creative") return <CreativeTemplate data={data} showAIChanges={showAIChanges} jobDescription={jobDescription} activeSection={activeSection} />;
            if (templateName === "minimalist") return <MinimalistTemplate data={data} showAIChanges={showAIChanges} jobDescription={jobDescription} activeSection={activeSection} />;
            if (templateName === "bold") return <BoldTemplate data={data} showAIChanges={showAIChanges} jobDescription={jobDescription} activeSection={activeSection} />;
          } catch (error) {
            console.error("Template rendering error:", error);
            return (
              <div className="bg-white p-8 min-h-[1100px] flex items-center justify-center">
                <div className="text-center text-red-600">
                  <p>Error loading template. Please check your data.</p>
                </div>
              </div>
            );
          }

          // Default template fallback
          return (
            <div
              className="bg-white p-8 min-h-[1100px] font-resume-serif transition-colors duration-300"
              style={{ overflow: "visible" }}
            >
              {/* Header */}
              <div className={`border-b-2 border-gray-200 pb-4 mb-6 ${getHighlightClass("Personal Info")}`}>
                <h1 className="text-2xl font-bold text-gray-900">
                  {data.personalInfo.fullName || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  {data.personalInfo.email && (
                    <a
                      href={`mailto:${data.personalInfo.email}`}
                      className="hover:text-blue-600 hover:underline transition-colors"
                    >
                      {data.personalInfo.email}
                    </a>
                  )}
                  {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                  {data.personalInfo.location && (
                    <span>{data.personalInfo.location}</span>
                  )}
                  {data.personalInfo.linkedin && (
                    <a
                      href={
                        data.personalInfo.linkedin.startsWith("http")
                          ? data.personalInfo.linkedin
                          : `https://${data.personalInfo.linkedin}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-blue-600 hover:underline transition-colors"
                    >
                      {data.personalInfo.linkedin}
                    </a>
                  )}
                  {data.personalInfo.portfolio && (
                    <a
                      href={
                        data.personalInfo.portfolio.startsWith("http")
                          ? data.personalInfo.portfolio
                          : `https://${data.personalInfo.portfolio}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-blue-600 hover:underline transition-colors"
                    >
                      {data.personalInfo.portfolio}
                    </a>
                  )}
                </div>
              </div>

              {/* Summary */}
              {data.personalInfo.summary && (
                <div className={`mb-6 ${getHighlightClass("Personal Info")}`}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {highlightChanges(data.personalInfo.summary)}
                  </p>
                </div>
              )}

              {/* Experience */}
              {data.experience.length > 0 && (
                <div className={`mb-6 ${getHighlightClass("Experience")}`}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-1">
                    Experience
                  </h2>
                  <div className="space-y-4">
                    {data.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-gray-900">{exp.title}</h3>
                          <span className="text-xs text-gray-500">
                            {exp.startDate} -{" "}
                            {exp.current ? "Present" : exp.endDate}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          {exp.company}
                        </p>
                        {exp.description && (
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {highlightChanges(exp.description)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <div className={`mb-6 ${getHighlightClass("Education")}`}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-1">
                    Education
                  </h2>
                  <div className="space-y-3">
                    {data.education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-gray-900">
                            {edu.school}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {edu.graduationDate}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{edu.degree}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                {/* Skills */}
                {data.skills.technical.length > 0 && (
                  <div className={getHighlightClass("Skills")}>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {data.skills.technical.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-50 text-gray-700 rounded text-xs border border-gray-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages & Certs */}
                <div className="space-y-4">
                  {data.skills.languages.length > 0 && (
                    <div className={getHighlightClass("Skills")}>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">
                        Languages
                      </h2>
                      <p className="text-xs text-gray-700">
                        {data.skills.languages.join(", ")}
                      </p>
                    </div>
                  )}

                  {data.skills.certifications.length > 0 && (
                    <div className={getHighlightClass("Skills")}>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">
                        Certifications
                      </h2>
                      <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                        {data.skills.certifications.map((cert, index) => (
                          <li key={index}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Hobbies */}
              {data.hobbies && data.hobbies.length > 0 && (
                <div className={`mt-6 ${getHighlightClass("Hobbies")}`}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">
                    Interests
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {data.hobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="text-xs text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-100"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Coding Profiles */}
              {Object.entries(data.codingProfiles || {}).filter(([_, url]) => url)
                .length > 0 && (
                  <div className={`mt-6 ${getHighlightClass("Coding Profiles")}`}>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">
                      Coding Profiles
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(data.codingProfiles || {}).map(
                        ([platform, url]) => {
                          if (!url) return null;
                          const link = url.startsWith("http")
                            ? url
                            : `https://${url}`;
                          return (
                            <div key={platform} className="text-xs">
                              <span className="font-semibold text-gray-900 capitalize">
                                {platform}:{" "}
                              </span>
                              <a
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {url.replace(/^https?:\/\//, "")}
                              </a>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}

              {/* Empty State */}
              {!data.personalInfo.fullName &&
                data.experience.length === 0 &&
                data.education.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>Your resume preview will appear here as you fill in the form.</p>
                  </div>
                )}
            </div>
          );
        })()}
      </motion.div>
    </div>
  );
};

export default ResumePreview;
