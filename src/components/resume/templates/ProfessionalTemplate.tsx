import { ResumeData } from "@/pages/Builder";
import { highlightResumeContent } from "@/utils/resumeHighlighting";

interface TemplateProps {
  data: ResumeData;
  showAIChanges?: boolean;
  jobDescription?: string;
  activeSection?: string;
}

const ProfessionalTemplate = ({ 
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

  return (
    <div
      className="bg-white p-12 min-h-[1200px] font-resume-serif text-gray-900 max-w-[850px] mx-auto transition-colors duration-300"
      style={{ overflow: "visible" }}
    >
      <div className={`text-center border-b-2 border-gray-900 pb-6 mb-8 ${getHighlightClass("Personal Info")}`}>
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">
          {data.personalInfo?.fullName || "Your Name"}
        </h1>
        <div className="flex justify-center flex-wrap gap-6 text-sm text-gray-700">
          {data.personalInfo?.email && (
            <a
              href={`mailto:${data.personalInfo?.email}`}
              className="hover:text-blue-600 hover:underline transition-colors"
            >
              {data.personalInfo?.email}
            </a>
          )}
          {data.personalInfo?.phone && <span>{data.personalInfo?.phone}</span>}
          {data.personalInfo?.location && (
            <span>{data.personalInfo?.location}</span>
          )}
          {data.personalInfo?.linkedin && (
            <a
              href={
                data.personalInfo?.linkedin.startsWith("http")
                  ? data.personalInfo?.linkedin
                  : `https://${data.personalInfo?.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 hover:underline transition-colors"
            >
              {data.personalInfo?.linkedin}
            </a>
          )}
          {data.personalInfo?.portfolio && (
            <a
              href={
                data.personalInfo?.portfolio.startsWith("http")
                  ? data.personalInfo?.portfolio
                  : `https://${data.personalInfo?.portfolio}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 hover:underline transition-colors"
            >
              {data.personalInfo?.portfolio}
            </a>
          )}
        </div>
      </div>

      {data.personalInfo.summary && (
        <section className={`mb-8 ${getHighlightClass("Personal Info")}`}>
          <h2 className="text-sm font-bold border-b border-gray-400 mb-3 pb-1 text-gray-900">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-justify text-gray-800">
            {highlightResumeContent(data.personalInfo.summary, jobDescription, showAIChanges)}
          </p>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section className={`mb-8 ${getHighlightClass("Experience")}`}>
          <h2 className="text-sm font-bold border-b border-gray-400 mb-4 pb-1 text-gray-900">
            Work Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base text-gray-900">{exp.title}</h3>
                  <span className="text-sm italic text-gray-600">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-sm italic text-gray-700 mb-2">
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                <div className="text-sm leading-relaxed text-justify text-gray-800">
                  {highlightResumeContent(exp.description, jobDescription, showAIChanges)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education?.length > 0 && (
        <section className={`mb-8 ${getHighlightClass("Education")}`}>
          <h2 className="text-sm font-bold border-b border-gray-400 mb-4 pb-1 text-gray-900">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-sm text-gray-900">{edu.school}</h3>
                  <span className="text-sm italic text-gray-600">
                    {edu.graduationDate}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>{edu.degree}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {(data.skills?.technical?.length > 0 ||
          data.skills?.languages?.length > 0) && (
          <section className={getHighlightClass("Skills")}>
            <h2 className="text-sm font-bold border-b border-gray-400 mb-3 pb-1 text-gray-900">
              Skills
            </h2>
            <div className="text-sm text-gray-800 leading-relaxed">
              {data.skills?.technical?.length > 0 && (
                <div className="mb-2">
                  <span className="font-bold">Technical: </span>
                  {data.skills.technical.join(", ")}
                </div>
              )}
              {data.skills.languages.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-800">Languages: </span>
                  <span className="text-gray-700">{data.skills.languages.join(", ")}</span>
                </div>
              )}

              {data.hobbies && data.hobbies.length > 0 && (
                <section className={`mt-4 ${getHighlightClass("Hobbies")}`}>
                  <h2 className="text-sm font-bold capitalize border-b border-gray-400 mb-4 pb-1 text-gray-900">
                    Interests
                  </h2>
                  <p className="text-sm text-gray-700">{data.hobbies.join(", ")}</p>
                </section>
              )}
            </div>
          </section>
        )}

        {data.skills.certifications.length > 0 && (
          <section className={getHighlightClass("Skills")}>
            <h2 className="text-sm font-bold capitalize border-b border-gray-400 mb-4 pb-1 text-gray-900">
              Certifications
            </h2>
            <ul className="text-sm list-disc pl-4 text-gray-700">
              {data.skills.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Coding Profiles */}
      {Object.entries(data.codingProfiles || {}).filter(([_, url]) => url)
        .length > 0 && (
        <section className={`mt-8 ${getHighlightClass("Coding Profiles")}`}>
          <h2 className="text-sm font-bold capitalize border-b border-gray-400 mb-4 pb-1 text-gray-900">
            Coding Profiles
          </h2>
          <div className="space-y-2 text-sm">
            {Object.entries(data.codingProfiles || {}).map(
              ([platform, url]) => {
                if (!url) return null;
                const link = url.startsWith("http") ? url : `https://${url}`;
                return (
                  <div key={platform} className="flex justify-between">
                    <span className="font-semibold text-gray-800">
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}:
                    </span>
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {url}
                    </a>
                  </div>
                );
              },
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProfessionalTemplate;

