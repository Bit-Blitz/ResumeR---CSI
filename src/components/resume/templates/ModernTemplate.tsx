import { ResumeData } from "@/pages/Builder";
import { highlightResumeContent } from "@/utils/resumeHighlighting";

interface TemplateProps {
  data: ResumeData;
  showAIChanges?: boolean;
  jobDescription?: string;
  activeSection?: string;
}

const ModernTemplate = ({ 
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
      className="bg-white p-8 min-h-[1200px] font-resume-serif text-gray-800 transition-colors duration-300"
      style={{ overflow: "visible" }}
    >
      <header className={`border-b-4 border-blue-600 pb-6 mb-6 ${getHighlightClass("Personal Info")}`}>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium text-gray-600">
          {data.personalInfo.email && (
            <a
              href={`mailto:${data.personalInfo.email}`}
              className="hover:text-blue-600 hover:underline transition-colors"
            >
              {data.personalInfo.email}
            </a>
          )}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && (
            <span>• {data.personalInfo.location}</span>
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
              • {data.personalInfo.linkedin}
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
              • {data.personalInfo.portfolio}
            </a>
          )}
        </div>
      </header>

      {data.personalInfo.summary && (
        <section className={`mb-8 ${getHighlightClass("Personal Info")}`}>
          <p className="text-gray-700 leading-relaxed text-lg">
            {highlightResumeContent(data.personalInfo.summary, jobDescription, showAIChanges)}
          </p>
        </section>
      )}

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {data.experience?.length > 0 && (
            <section className={getHighlightClass("Experience")}>
              <h2 className="text-2xl font-bold text-blue-600 mb-4 tracking-wide">
                Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative pl-4 border-l-2 border-gray-200"
                  >
                    <h3 className="text-xl font-bold text-gray-900">
                      {exp.title}
                    </h3>
                    <div className="flex justify-between items-center text-gray-600 mb-2">
                      <span className="font-semibold">{exp.company}</span>
                      <span className="text-sm">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700">
                        {highlightResumeContent(exp.description, jobDescription, showAIChanges)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education?.length > 0 && (
            <section className={getHighlightClass("Education")}>
              <h2 className="text-2xl font-bold text-blue-600 mb-4 capitalize tracking-wide">
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-lg font-bold text-gray-900">
                      {edu.school}
                    </h3>
                    <div className="flex justify-between text-gray-600">
                      <span>{edu.degree}</span>
                      <span>{edu.graduationDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-1 space-y-8 border-l border-gray-100 pl-8">
          <section className={getHighlightClass("Skills")}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills?.technical?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}

              {data.hobbies && data.hobbies?.length > 0 && (
                <section className={`mt-8 ${getHighlightClass("Hobbies")}`}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                    Interests
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {data.hobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </section>

          {Object.entries(data.codingProfiles || {}).filter(([_, url]) => url)
            .length > 0 && (
            <section className={getHighlightClass("Coding Profiles")}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                Coding Profiles
              </h2>
              <ul className="space-y-2">
                {Object.entries(data.codingProfiles || {}).map(
                  ([platform, url]) => {
                    if (!url) return null;
                    const link = url.startsWith("http")
                      ? url
                      : `https://${url}`;
                    return (
                      <li
                        key={platform}
                        className="text-gray-700 flex flex-col"
                      >
                        <span className="font-semibold text-sm capitalize">
                          {platform}
                        </span>
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 text-xs hover:underline break-all"
                        >
                          {url.replace(/^https?:\/\//, "")}
                        </a>
                      </li>
                    );
                  },
                )}
              </ul>
            </section>
          )}

          {data.skills?.languages?.length > 0 && (
            <section className={getHighlightClass("Skills")}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                Languages
              </h2>
              <ul className="space-y-2">
                {data.skills.languages.map((lang, index) => (
                  <li key={index} className="text-gray-700">
                    {lang}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.skills?.certifications?.length > 0 && (
            <section className={getHighlightClass("Skills")}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                Certifications
              </h2>
              <ul className="space-y-2">
                {data.skills.certifications.map((cert, index) => (
                  <li key={index} className="text-gray-700 text-sm">
                    {cert}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
