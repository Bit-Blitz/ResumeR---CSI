import { ResumeData } from "@/pages/Builder";

interface TemplateProps {
  data: ResumeData;
  showAIChanges?: boolean;
  jobDescription?: string;
  activeSection?: string;
}

const MinimalistTemplate = ({ 
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
            <span className="absolute -top-3 left-0 text-[8px] font-black capitalize text-green-600 tracking-tighter">AI-Improved</span>
          </span>
        );
      }
      return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  return (
    <div
      className="bg-white min-h-[1200px] p-12 font-resume-serif transition-colors duration-300"
      style={{ overflow: "visible" }}
    >
      {/* Header - Clean and Simple */}
      <div className={`mb-8 ${getHighlightClass("Personal Info")}`}>
        <h1 className="text-3xl font-light tracking-wide text-gray-900 mb-2">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>•</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>•</span>}
          {data.personalInfo.location && (
            <span>{data.personalInfo.location}</span>
          )}
        </div>
        {data.personalInfo.linkedin && (
          <div className="text-sm text-gray-500 mt-1">
            {data.personalInfo.linkedin}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className={`mb-10 ${getHighlightClass("Personal Info")}`}>
          <p className="text-gray-700 leading-relaxed text-justify">
            {highlightChanges(data.personalInfo.summary)}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className={`mb-10 ${getHighlightClass("Experience")}`}>
          <h2 className="text-sm capitalize tracking-widest text-gray-500 mb-6 font-medium">
            Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{exp.title}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {exp.company} • {exp.location}
                </p>
                {exp.description && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {highlightChanges(exp.description)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <div className={`mb-10 ${getHighlightClass("Education")}`}>
          <h2 className="text-sm capitalize tracking-widest text-gray-500 mb-6 font-medium">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{edu.school}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {edu.graduationDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{edu.degree}</p>
                {edu.gpa && (
                  <p className="text-sm text-gray-500 mt-1">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(data.skills?.technical?.length > 0 ||
        data.skills?.languages?.length > 0) && (
        <div className={`mb-10 ${getHighlightClass("Skills")}`}>
          <h2 className="text-sm capitalize tracking-widest text-gray-500 mb-6 font-medium">
            Skills
          </h2>
          <div className="space-y-3">
            {data.skills?.technical?.length > 0 && (
              <div>
                <span className="text-xs text-gray-500 capitalize tracking-wider">
                  Technical:
                </span>
                <p className="text-sm text-gray-700 mt-1">
                  {data.skills.technical.join(" • ")}
                </p>
              </div>
            )}
            {data.skills?.languages?.length > 0 && (
              <div>
                <span className="text-xs text-gray-500 capitalize tracking-wider">
                  Languages:
                </span>
                <p className="text-sm text-gray-700 mt-1">
                  {data.skills.languages.join(" • ")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coding Profiles */}
      {Object.entries(data.codingProfiles || {}).filter(([_, url]) => url)
        .length > 0 && (
        <div className={`mb-6 ${getHighlightClass("Coding Profiles")}`}>
          <h2 className="text-sm capitalize tracking-widest text-gray-500 mb-6 font-medium">
            Coding Profiles
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(data.codingProfiles || {}).map(
              ([platform, url]) => {
                if (!url) return null;
                return (
                  <div key={platform} className="text-sm">
                    <span className="text-gray-500">
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}:
                    </span>
                    <span className="text-gray-700 ml-2">{url}</span>
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalistTemplate;
