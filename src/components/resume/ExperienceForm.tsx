import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { ResumeData } from "@/pages/Builder";
import { User, Edit2, Trash2, X, Check, Briefcase, Calendar, MapPin, AlignLeft, ChevronDown, ChevronUp } from "lucide-react";
import GhostwriterCritique from "./GhostwriterCritique";
import { motion, AnimatePresence } from "framer-motion";

interface ExperienceFormProps {
  data: ResumeData;
  updateData: (section: keyof ResumeData, data: any) => void;
}

const ExperienceForm = ({ data, updateData }: ExperienceFormProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const resetForm = () => {
    setNewExperience({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    setEditingId(null);
    setIsExpanded(false);
  };

  const handleSubmit = () => {
    if (newExperience.title && newExperience.company) {
      if (editingId) {
        // Update existing entry
        const updatedExperience = data.experience.map((exp) =>
          exp.id === editingId ? { ...newExperience, id: editingId } : exp
        );
        updateData('experience', updatedExperience);
      } else {
        // Add new entry
        const experience = {
          id: Date.now().toString(),
          ...newExperience,
        };
        updateData('experience', [...data.experience, experience]);
      }
      resetForm();
    }
  };

  const handleEdit = (exp: any) => {
    setEditingId(exp.id);
    setIsExpanded(true);
    setNewExperience({ 
      title: exp.title,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      description: exp.description,
    });
    // Scroll to form for accessibility
    const formElement = document.getElementById('experience-form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const removeExperience = (id: string) => {
    const expToRemove = data.experience.find(e => e.id === id);
    if (window.confirm(`Are you sure you want to remove your experience at ${expToRemove?.company}?`)) {
      updateData('experience', data.experience.filter(exp => exp.id !== id));
      if (editingId === id) {
        resetForm();
      }
    }
  };

  return (
    <div className="space-y-6" role="region" aria-label="Professional Experience Section">
      {/* Existing Experience */}
      <div className="space-y-4" role="list" aria-label="List of professional experiences">
        {data.experience.map((exp) => (
          <Card
            key={exp.id}
            role="listitem"
            className={`p-4 border-l-4 transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 ${
              editingId === exp.id 
                ? 'border-l-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-md' 
                : 'border-l-purple-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{exp.title}</h4>
                  {editingId === exp.id && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full capitalize font-bold tracking-wider">
                      Editing
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{exp.company}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {exp.location} • {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </p>
                {exp.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                    {exp.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 shrink-0 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(exp)}
                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/50"
                  aria-label={`Edit experience at ${exp.company}`}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExperience(exp.id)}
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/50"
                  aria-label={`Remove experience at ${exp.company}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Experience Form */}
      <Card 
        id="experience-form-container"
        className={`overflow-hidden border-2 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 ${
        editingId 
          ? 'border-blue-400 bg-blue-50/10 dark:border-blue-500 dark:bg-blue-900/10' 
          : isExpanded ? 'border-purple-300 bg-white shadow-lg' : 'border-dashed border-gray-300 bg-gray-50/50'
      }`}>
        <button 
          className={`w-full p-6 flex items-center justify-between cursor-pointer group text-left ${!isExpanded && !editingId ? 'hover:bg-gray-100/80' : ''}`}
          onClick={() => !editingId && setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded || !!editingId}
          aria-controls="experience-form-content"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg transition-colors ${
              editingId ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
            }`}>
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {editingId ? 'Edit Professional Experience' : 'Add Experience'}
              </h3>
              {!isExpanded && !editingId && (
                <p className="text-xs text-gray-500 dark:text-gray-400">Add a new role to your professional journey</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {editingId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); resetForm(); }}
                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 text-xs flex items-center gap-1"
                aria-label="Cancel editing experience"
              >
                <X className="w-3 h-3" /> Cancel Edit
              </Button>
            )}
            {!editingId && (
              <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            )}
          </div>
        </button>

        <AnimatePresence>
          {(isExpanded || editingId) && (
            <motion.div
              id="experience-form-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-6 pb-6 pt-2 space-y-8">
                {/* Section 1: Role Details */}
                <div className="space-y-4" role="group" aria-labelledby="role-details-title">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <User className="w-4 h-4 text-blue-500" aria-hidden="true" />
                    <h4 id="role-details-title" className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Role Details</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label htmlFor="title" className="text-sm font-medium dark:text-gray-300">
                        Job Title
                      </Label>
                      <Input
                        id="title"
                        value={newExperience.title}
                        onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                        placeholder="e.g. Software Engineer"
                        className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20"
                        aria-required="true"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="company" className="text-sm font-medium dark:text-gray-300">
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                        placeholder="e.g. Google"
                        className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="location" className="text-sm font-medium dark:text-gray-300 flex items-center gap-2">
                      <MapPin className="w-3 h-3" aria-hidden="true" /> Location
                    </Label>
                    <Input
                      id="location"
                      value={newExperience.location}
                      onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA"
                      className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Section 2: Timeline */}
                <div className="space-y-4" role="group" aria-labelledby="timeline-title">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <Calendar className="w-4 h-4 text-orange-500" aria-hidden="true" />
                    <h4 id="timeline-title" className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Timeline</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label htmlFor="startDate" className="text-sm font-medium dark:text-gray-300">
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        value={newExperience.startDate}
                        onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                        placeholder="e.g. Jan 2022"
                        className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="endDate" className="text-sm font-medium dark:text-gray-300">
                        End Date
                      </Label>
                      <Input
                        id="endDate"
                        value={newExperience.endDate}
                        onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                        placeholder="e.g. Present"
                        disabled={newExperience.current}
                        className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 py-1">
                    <Checkbox
                      id="current"
                      checked={newExperience.current}
                      onCheckedChange={(checked) => setNewExperience({ ...newExperience, current: checked as boolean })}
                      className="data-[state=checked]:bg-blue-600 border-blue-600 dark:border-blue-500 dark:data-[state=checked]:bg-blue-700"
                    />
                    <Label htmlFor="current" className="text-sm cursor-pointer select-none dark:text-gray-300">
                      I currently work here
                    </Label>
                  </div>
                </div>

                {/* Section 3: Impact & Description */}
                <div className="space-y-4" role="group" aria-labelledby="impact-title">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <AlignLeft className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                    <h4 id="impact-title" className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Impact & Description</h4>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-sm font-medium dark:text-gray-300">
                      Key Contributions
                    </Label>
                    <Textarea
                      id="description"
                      value={newExperience.description}
                      onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                      placeholder="Highlight your key achievements and responsibilities..."
                      className="min-h-[160px] bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 resize-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <GhostwriterCritique text={newExperience.description} type="experience" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSubmit}
                    className={`flex-1 h-11 font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                      editingId
                        ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white'
                    }`}
                  >
                    {editingId ? (
                      <><Check className="w-5 h-5" aria-hidden="true" /> Update Experience</>
                    ) : (
                      <><Check className="w-5 h-5" aria-hidden="true" /> Add to Resume</>
                    )}
                  </Button>
                  {editingId && (
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="flex-1 h-11 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300 font-bold"
                    >
                      Discard Changes
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default ExperienceForm;
