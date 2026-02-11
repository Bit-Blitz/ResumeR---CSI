import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface GhostwriterCritiqueProps {
  text: string;
  type: 'summary' | 'experience';
}

const ACTION_VERBS = [
  "accelerated", "accomplished", "achieved", "acquired", "adapted", "administered", "advanced", "advised", "analyzed",
  "architected", "assessed", "attained", "augmented", "authored", "automated", "balanced", "blocked", "boosted",
  "briefed", "budged", "built", "calculated", "capitalized", "captured", "championed", "clarified", "coached",
  "collaborated", "collected", "combined", "commissioned", "communicated", "composed", "computed", "conceived",
  "conducted", "consolidated", "constructed", "consulted", "contributed", "converted", "coordinated", "counseled",
  "crafted", "created", "cultivated", "debugged", "decreased", "defined", "delegated", "delivered", "demonstrated",
  "deployed", "designed", "detected", "determined", "developed", "devised", "diagnosed", "directed", "discovered",
  "dispatched", "displayed", "distributed", "diversified", "documented", "doubled", "drafted", "drove", "earned",
  "edited", "educated", "eliminated", "enabled", "enforced", "engineered", "enhanced", "enlarged", "ensured",
  "established", "estimated", "evaluated", "examined", "executed", "expanded", "expedited", "experienced",
  "experimented", "explored", "facilitated", "filtered", "finalized", "fixed", "focused", "forecasted", "formed",
  "formulated", "fostered", "founded", "gained", "gathered", "generated", "governed", "guided", "handled",
  "headed", "hired", "identified", "illustrated", "implemented", "improved", "improvised", "increased", "indexed",
  "influenced", "initiated", "innovated", "inspected", "inspired", "installed", "instituted", "instructed",
  "integrated", "investigated", "justified", "launched", "led", "lectured", "leveraged", "licensed", "localized",
  "located", "maintained", "managed", "mapped", "marketed", "maximized", "measured", "mediated", "mentored",
  "merged", "migrated", "minimized", "modeled", "modified", "monitored", "motivation", "negotiated", "observed",
  "obtained", "operated", "optimized", "orchestrated", "organized", "originated", "outperformed", "overcame",
  "overhauled", "oversaw", "participated", "partnered", "performed", "persuaded", "pioneered", "planned",
  "predicted", "prepared", "presented", "prevented", "processed", "produced", "programmed", "promoted", "proposed",
  "proved", "provided", "published", "purchased", "quantified", "quoted", "raised", "reached", "recommended",
  "reconciled", "recorded", "recruited", "redesigned", "reduced", "refactored", "refined", "focused", "regulated",
  "reinforced", "rejuvenated", "rendered", "renewed", "reorganized", "reported", "represented", "researched",
  "resolved", "restored", "restructured", "revamped", "reviewed", "revitalized", "revived", "scheduled", "screened",
  "secured", "selected", "separated", "served", "shaped", "simplified", "simulated", "solved", "spearheaded",
  "specified", "staffed", "standardized", "started", "strengthened", "structured", "studied", "supervised",
  "supplied", "supported", "surpassed", "synthesized", "systematized", "targeted", "taught", "tested", "tracked",
  "trained", "transformed", "translated", "traveled", "trimmed", "upgraded", "utilized", "validated", "verified",
  "visualized", "won", "wrote"
];

const WEAK_VERBS = [
  "help", "helped", "work", "worked", "responsible", "handled", "assisted", "was", "were", "did"
];

const BUZZWORDS = [
  "synergy", "detail-oriented", "team player", "hard worker", "results-driven", "passionate", "motivated"
];

const GhostwriterCritique: React.FC<GhostwriterCritiqueProps> = ({ text, type }) => {
  const analysis = useMemo(() => {
    if (!text || text.trim().length < 10) return null;

    const suggestions: string[] = [];
    const passes: string[] = [];
    let score = 0;

    const lowerText = text.toLowerCase();

    if (type === 'summary') {
      const words = text.trim().split(/\s+/).length;
      if (words < 25) {
        suggestions.push("Summary is too short. Aim for at least 25-30 words.");
      } else if (words > 80) {
        suggestions.push("Summary is a bit wordy. Try to condense it to under 80 words.");
      } else {
        passes.push("Perfect summary length.");
        score += 30;
      }

      const hasMetric = /[0-9]+|years|%|\$/.test(lowerText);
      if (!hasMetric) {
        suggestions.push("Add a metric (e.g., '5+ years experience', 'boosted sales by 20%').");
      } else {
        passes.push("Good use of metrics.");
        score += 30;
      }

      const foundBuzzwords = BUZZWORDS.filter(word => lowerText.includes(word));
      if (foundBuzzwords.length > 0) {
        suggestions.push(`Avoid generic buzzwords like "${foundBuzzwords[0]}". Use specific achievements instead.`);
      } else {
        passes.push("Clean of generic buzzwords.");
        score += 40;
      }
    } else {
      // Experience analysis
      const lines = text.split(/\n|\. /).filter(l => l.trim().length > 5);
      
      if (lines.length === 0) return null;

      let actionVerbCount = 0;
      let weakVerbCount = 0;
      let metricCount = 0;
      let longBulletCount = 0;
      let passiveCount = 0;

      lines.forEach(line => {
        const lowerLine = line.toLowerCase().trim();
        
        // Action verbs
        const hasActionVerb = ACTION_VERBS.some(verb => 
          lowerLine.startsWith(verb) || 
          lowerLine.startsWith(verb + "ed") || 
          lowerLine.startsWith(verb + "d")
        );
        if (hasActionVerb) actionVerbCount++;

        // Weak verbs
        if (WEAK_VERBS.some(verb => lowerLine.includes(verb))) weakVerbCount++;

        // Metrics
        if (/\d+%|\d+\+|\d+ users|\$\d+|\d+ clients|\d+x/.test(lowerLine)) {
          metricCount++;
        }

        // Sentence length
        if (line.split(" ").length > 25) {
          longBulletCount++;
        }

        // Passive voice (basic check)
        if (/\b(was|were|been|being)\b\s+\w+ed\b/.test(lowerLine)) {
          passiveCount++;
        }
      });

      const verbRatio = actionVerbCount / lines.length;
      const metricRatio = metricCount / lines.length;

      if (verbRatio < 0.6) {
        suggestions.push("Start bullets with strong action verbs (e.g., 'Led', 'Optimized').");
      } else {
        passes.push("Strong use of action verbs.");
        score += 30;
      }

      if (metricRatio < 0.3) {
        suggestions.push("Add more quantifiable results (%, $, numbers) to show impact.");
      } else {
        passes.push("Excellent impact quantification.");
        score += 30;
      }

      if (weakVerbCount > 0) {
        suggestions.push("Swap weak words like 'helped' or 'worked' for stronger action verbs.");
      } else {
        score += 20;
      }

      if (passiveCount > 0) {
        suggestions.push("Avoid passive voice (e.g., 'was managed by'). Use active voice instead.");
      } else {
        score += 10;
      }

      if (longBulletCount > 0) {
        suggestions.push("Some bullets are too long. Aim for 1-2 lines per point.");
      } else {
        passes.push("Concise and readable bullets.");
        score += 10;
      }
    }

    return { suggestions, passes, score: Math.min(100, score) };
  }, [text, type]);

  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-blue-100 dark:border-blue-900/30 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h4 className="text-xs font-bold capitalize tracking-widest text-blue-700 dark:text-blue-300">
          Ghostwriter Live Critique
        </h4>
        <div className="ml-auto flex items-center gap-1">
          <div className="h-1.5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${analysis.score}%` }}
              className="h-full bg-blue-600"
            />
          </div>
          <span className="text-[10px] font-bold text-gray-500">{analysis.score}%</span>
        </div>
      </div>

      <div className="space-y-2">
        {analysis.suggestions.map((suggestion, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>{suggestion}</span>
          </div>
        ))}
        {analysis.passes.map((pass, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 opacity-80">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
            <span>{pass}</span>
          </div>
        ))}
      </div>

      {analysis.suggestions.length === 0 && (
        <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-green-600 dark:text-green-400 capitalize tracking-tight">
          <Sparkles className="w-3 h-3" />
          Content looks professional!
        </div>
      )}
    </motion.div>
  );
};

export default GhostwriterCritique;
