import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "@/context/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Builder from "./pages/Builder";
import NotFound from "./pages/NotFound";
import Templates from "./pages/Templates";
import ResumeGuide from "./pages/ResumeGuide";
import InterviewQuestions from "./pages/InterviewQuestions";
import CodingPrep from "./pages/CodingPrep";
import SoftSkills from "./pages/SoftSkills";
import ATSScreen from "./pages/ATSScreen";
import LoadingScreen from "./components/LoadingScreen";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -10,
    },
  };

  const pageTransition = {
    type: "tween" as const,
    ease: "easeOut" as const,
    duration: 0.3,
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Index />
            </motion.div>
          }
        />
        <Route
          path="/builder"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Builder />
            </motion.div>
          }
        />
        <Route
          path="/templates"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Templates />
            </motion.div>
          }
        />
        <Route
          path="/resume-guide"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ResumeGuide />
            </motion.div>
          }
        />
        <Route
          path="/interview-questions"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <InterviewQuestions />
            </motion.div>
          }
        />
        <Route
          path="/coding-prep"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <CodingPrep />
            </motion.div>
          }
        />
        <Route
          path="/soft-skills"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <SoftSkills />
            </motion.div>
          }
        />
        <Route
          path="/ats-screen"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ATSScreen />
            </motion.div>
          }
        />
        <Route
          path="*"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <NotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [showLoading, setShowLoading] = useState(false);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showLoading ? (
            <LoadingScreen onComplete={handleLoadingComplete} />
          ) : (
            <ErrorBoundary>
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <AnimatedRoutes />
              </BrowserRouter>
            </ErrorBoundary>
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
