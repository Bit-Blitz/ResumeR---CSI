import { ResumeData } from "@/pages/Builder";
import { highlightResumeContent } from "@/utils/resumeHighlighting";

interface TemplateProps {
  data: ResumeData;
  showAIChanges?: boolean;
  jobDescription?: string;
  activeSection?: string;
}

const CreativeTemplate = ({ 
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
      className="bg-white min-h-[1200px] flex flex-col md:flex-row font-resume-serif transition-colors duration-300"
      style={{ overflow: "visible" }}
    >
      {/* Sidebar */}
      <aside className="w-full md:w-1/3 bg-slate-900 text-white p-8 transition-colors duration-300">
        <div className={`mb-10 text-center ${getHighlightClass("Personal Info")}`}>
          <div className="w-24 h-24 bg-slate-700 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 border-2 border-slate-500">
            {data.personalInfo.fullName
              ? data.personalInfo.fullName.charAt(0)
              : "U"}
          </div>
          <h1 className="text-2xl font-bold leading-tight mb-2 break-words">
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <p className="text-slate-400 text-sm">Professional Role</p>
        </div>

        <div className="space-y-8">
          <section className={getHighlightClass("Personal Info")}>
            <h3 className="text-slate-400 capitalize tracking-wide text-xs font-bold mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-slate-300">
              {data.personalInfo.email && (
                <a
                  href={`mailto:${data.personalInfo.email}`}
                  className="break-words block hover:text-blue-400 hover:underline transition-colors"
                >
                  {data.personalInfo.email}
                </a>
              )}
              {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
              {data.personalInfo.location && (
                <div>{data.personalInfo.location}</div>
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
                  className="text-xs break-all block hover:text-blue-400 hover:underline transition-colors"
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
                  className="text-xs break-all block hover:text-blue-400 hover:underline transition-colors"
                >
                  {data.personalInfo.portfolio}
                </a>
              )}
            </div>
          </section>

          {data.skills?.technical?.length > 0 && (
            <section className={getHighlightClass("Skills")}>
              <h3 className="text-slate-400 capitalize tracking-wide text-xs font-bold mb-4">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.technical.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.skills?.languages?.length > 0 && (
            <section className={getHighlightClass("Skills")}>
              <h3 className="text-slate-400 capitalize tracking-wide text-xs font-bold mb-4">
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-200"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.hobbies && data.hobbies.length > 0 && (
            <section className={getHighlightClass("Hobbies")}>
              <h3 className="text-slate-400 capitalize tracking-widest text-xs font-bold mb-4">
                Interests
              </h3>
              <ul className="space-y-1 text-sm text-slate-300">
                {data.hobbies.map((hobby, index) => (
                  <li key={index}>• {hobby}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full md:w-2/3 p-6 md:p-10 bg-white transition-colors duration-300">
        {data.personalInfo.summary && (
          <section className={`mb-10 ${getHighlightClass("Personal Info")}`}>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 border-l-4 border-slate-800 pl-4">
              Profile
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {highlightResumeContent(data.personalInfo.summary, jobDescription, showAIChanges)}
            </p>
          </section>
        )}

        {data.experience?.length > 0 && (
          <section className={`mb-10 ${getHighlightClass("Experience")}`}>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-l-4 border-slate-800 pl-4">
              Experience
            </h2>
            <div className="space-y-8">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <h3 className="text-xl font-bold text-gray-900">
                    {exp.title}
                  </h3>
                  <div className="text-slate-500 font-medium mb-2">
                    {exp.company} | {exp.startDate} -{" "}
                    {exp.current ? "Present" : exp.endDate}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {highlightResumeContent(exp.description, jobDescription, showAIChanges)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education?.length > 0 && (
          <section className={`mb-10 ${getHighlightClass("Education")}`}>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-l-4 border-slate-800 pl-4">
              Education
            </h2>
            <div className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-lg font-bold text-gray-900">
                    {edu.school}
                  </h3>
                  <div className="text-slate-500">{edu.degree}</div>
                  <div className="text-gray-400 text-sm">
                    {edu.graduationDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Coding Profiles */}
        {Object.entries(data.codingProfiles || {}).filter(([_, url]) => url)
          .length > 0 && (
          <section className={`mb-10 ${getHighlightClass("Coding Profiles")}`}>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-l-4 border-slate-800 pl-4">
              Coding Profiles
            </h2>
            <div className="space-y-3">
              {Object.entries(data.codingProfiles || {}).map(
                ([platform, url]) => {
                  if (!url) return null;
                  const link = url.startsWith("http") ? url : `https://${url}`;
                  return (
                    <div key={platform} className="flex items-center gap-4">
                      <span className="font-bold text-slate-700 w-24">
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
      </main>
    </div>
  );
};


export default CreativeTemplate;
