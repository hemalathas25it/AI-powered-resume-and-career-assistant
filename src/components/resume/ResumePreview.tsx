import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';
import { ResumeData } from '../../types';

interface ResumePreviewProps {
  data: ResumeData;
  template?: 'modern' | 'minimal';
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template = 'modern' }) => {
  const { personalInfo, summary, experiences, education, skills, projects, certifications } = data;

  return (
    <div className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200/90 p-8 sm:p-10 max-w-4xl mx-auto font-sans leading-relaxed text-sm select-text print:p-0 print:border-0 print:shadow-none print:rounded-none">
      {/* Header Section */}
      <div className="border-b border-slate-300 pb-5 mb-5 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-1 font-display">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-sm sm:text-base font-semibold text-indigo-700 mb-3">
          {personalInfo.headline || 'Target Role / Professional Title'}
        </p>

        {/* Contact info row */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1.5 gap-x-4 text-xs text-slate-600">
          {personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-indigo-600 underline decoration-indigo-200">{personalInfo.portfolio}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{personalInfo.github.replace('https://', '')}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{personalInfo.linkedin.replace('https://', '')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 font-display">
            Professional Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            {summary}
          </p>
        </div>
      )}

      {/* Technical Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 font-display">
            Core Competencies & Technical Skills
          </h2>
          <div className="space-y-1.5 text-xs">
            {skills.map((grp, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="font-bold text-slate-900 shrink-0 min-w-[170px]">
                  {grp.category}:
                </span>
                <span className="text-slate-700">
                  {grp.items.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {experiences && experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3 font-display">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="font-bold text-slate-950 text-sm">
                    <span>{exp.role}</span>
                    <span className="text-indigo-600 font-semibold"> • {exp.company}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate} | {exp.location}
                  </div>
                </div>

                {exp.description && (
                  <p className="text-xs italic text-slate-600 mb-1">
                    {exp.description}
                  </p>
                )}

                <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700">
                  {exp.highlights.map((bullet, bIdx) => (
                    <li key={bIdx} className="leading-normal">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3 font-display">
            Key Engineering Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                  <div className="font-bold text-slate-950 text-xs sm:text-sm">
                    <span>{proj.title}</span>
                    {proj.role && <span className="font-normal text-slate-600"> ({proj.role})</span>}
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    {proj.techStack.join(' • ')}
                  </div>
                </div>
                <p className="text-xs text-slate-700">
                  {proj.description}
                </p>
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-slate-700">
                    {proj.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 font-display">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-950">{edu.institution}</span>
                  <span className="text-slate-700"> — {edu.degree} in {edu.fieldOfStudy}</span>
                  {edu.gpa && <span className="text-slate-500"> (GPA: {edu.gpa})</span>}
                  {edu.honors && <span className="text-slate-600 italic"> • {edu.honors}</span>}
                </div>
                <div className="text-slate-500">
                  {edu.startDate} – {edu.endDate} | {edu.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 font-display">
            Certifications & Credentials
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-slate-700">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900">{cert.name}</span>
                <span className="text-slate-500">({cert.issuer}, {cert.issueDate})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
