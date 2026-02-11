import { ResumeData } from "@/pages/Builder";

interface TemplateProps {
  data: ResumeData;
  showAIChanges?: boolean;
  jobDescription?: string;
  activeSection?: string;
}

const BoldTemplate = ({ 
  data, 
  showAIChanges = false, 
  jobDescription = "",
  activeSection = "" 
}: TemplateProps) => {
  const getHighlightClass = (sectionName: string) => {
    return activeSection === sectionName 
      ? "ring-2 ring-blue-500/50 ring-offset-4 rounded-sm bg-blue-50/30 transition-all duration-500" 
      : "transition-all duration-500";
  };

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
          <span key={i} className="relative inline-block px-1 rounded bg-green-100 text-green-900 border-b-2 border-green-500 font-medium">
            <span dangerouslySetInnerHTML={{ __html: content }} />
            <span className="absolute -top-3 left-0 text-[8px] font-black capitalize text-green-600 tracking-tight">AI-Improved</span>
          </span>
        );
      }
      return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  return (
    <div className="bg-white min-h-[1200px] font-resume-serif transition-colors duration-300" style={{ overflow: "visible" }}>
      {/* Bold Header with Accent */}
      <div className={`bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 ${getHighlightClass("Personal Info")}`}>
        <h1 className="text-4xl font-black capitalize mb-3 tracking-tight">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm font-medium opacity-95">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>|</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>|</span>}
          {data.personalInfo.location && (
            <span>{data.personalInfo.location}</span>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {data.personalInfo.summary && (
          <div className={`mb-8 bg-gray-50 p-6 rounded-lg border-l-4 border-orange-500 transition-colors duration-300 ${getHighlightClass("Personal Info")}`}>
            <h2 className="text-lg font-black capitalize text-orange-600 mb-3">
              Profile
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {highlightChanges(data.personalInfo.summary)}
            </p>
          </div>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <div className={`mb-8 ${getHighlightClass("Experience")}`}>
            <h2 className="text-lg font-black capitalize text-orange-600 mb-4 pb-2 border-b-4 border-orange-500">
              Work Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-6">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-orange-500 rounded-full"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {exp.title}
                      </h3>
                      <p className="text-md font-semibold text-orange-600">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-600 whitespace-nowrap">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{exp.location}</p>
                  {exp.description && (
                    <p className="text-gray-700 leading-relaxed">
                      {highlightChanges(exp.description)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two Column Layout for Education and Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          {data.education?.length > 0 && (
            <div className={getHighlightClass("Education")}>
              <h2 className="text-lg font-black capitalize text-orange-600 mb-4 pb-2 border-b-4 border-orange-500">
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-orange-600 font-semibold">
                      {edu.school}
                    </p>
                    <p className="text-sm text-gray-600">
                      {edu.graduationDate}
                    </p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {data.skills?.technical?.length > 0 && (
            <div className={getHighlightClass("Skills")}>
              <h2 className="text-lg font-black capitalize text-orange-600 mb-4 pb-2 border-b-4 border-orange-500">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.technical.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Coding Profiles */}
        {Object.entries(data.codingProfiles || {}).filter(([_, url]) => url)
          .length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-black capitalize text-orange-600 mb-4 pb-2 border-b-4 border-orange-500">
              Coding Profiles
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(data.codingProfiles || {}).map(
                ([platform, url]) => {
                  if (!url) return null;
                  return (
                    <div key={platform} className="flex items-center gap-2">
                      <span className="font-bold text-orange-600">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}:
                      </span>
                      <span className="text-gray-700 text-sm break-all">
                        {url}
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoldTemplate;
