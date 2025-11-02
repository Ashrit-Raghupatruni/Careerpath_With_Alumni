import { useState } from 'react';
import { Sparkles, Download, Eye, EyeOff } from 'lucide-react';

export default function AIResume() {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [style, setStyle] = useState('Professional');
  const [color, setColor] = useState('Blue');
  const [visibleSections, setVisibleSections] = useState({
    summary: true,
    experience: true,
    education: true,
    skills: true,
    certifications: true
  });
  const [resume, setResume] = useState({
    name: '',
    title: '',
    summary: '',
    experience: [] as any[],
    education: [] as any[],
    skills: [] as string[],
    certifications: [] as string[]
  });

  const styles = ['Professional', 'Modern', 'Creative', 'Minimal'];
  const colors = ['Blue', 'Purple', 'Green', 'Red', 'Gray'];

  const generateResume = async () => {
    setGenerating(true);

    setTimeout(() => {
      setResume({
        name: 'John Doe',
        title: 'Software Engineer',
        summary: 'Experienced software engineer with 5+ years of expertise in full-stack development, cloud architecture, and team leadership. Passionate about building scalable solutions and mentoring junior developers.',
        experience: [
          {
            company: 'Tech Corp',
            role: 'Senior Software Engineer',
            duration: '2021 - Present',
            description: 'Leading development of microservices architecture serving 1M+ users. Mentored team of 5 junior developers.'
          },
          {
            company: 'StartupXYZ',
            role: 'Full Stack Developer',
            duration: '2019 - 2021',
            description: 'Built and deployed 10+ features for SaaS platform. Improved page load time by 40%.'
          }
        ],
        education: [
          {
            institution: 'SRM University AP',
            degree: 'B.Tech in Computer Science',
            year: '2019'
          }
        ],
        skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'TypeScript'],
        certifications: ['AWS Solutions Architect', 'Google Cloud Professional']
      });
      setGenerated(true);
      setGenerating(false);
    }, 2000);
  };

  const toggleSection = (section: keyof typeof visibleSections) => {
    setVisibleSections({ ...visibleSections, [section]: !visibleSections[section] });
  };

  const downloadResume = () => {
    let content = `${resume.name}\n${resume.title}\n\n`;

    if (visibleSections.summary) {
      content += `SUMMARY\n${resume.summary}\n\n`;
    }

    if (visibleSections.experience) {
      content += `EXPERIENCE\n`;
      resume.experience.forEach(exp => {
        content += `${exp.role} at ${exp.company}\n${exp.duration}\n${exp.description}\n\n`;
      });
    }

    if (visibleSections.education) {
      content += `EDUCATION\n`;
      resume.education.forEach(edu => {
        content += `${edu.degree} - ${edu.institution} (${edu.year})\n`;
      });
      content += '\n';
    }

    if (visibleSections.skills) {
      content += `SKILLS\n${resume.skills.join(', ')}\n\n`;
    }

    if (visibleSections.certifications) {
      content += `CERTIFICATIONS\n${resume.certifications.join(', ')}\n`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.name.replace(/\s+/g, '_')}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const colorSchemes: Record<string, string> = {
    Blue: 'from-blue-600 to-cyan-600',
    Purple: 'from-purple-600 to-pink-600',
    Green: 'from-green-600 to-teal-600',
    Red: 'from-red-600 to-orange-600',
    Gray: 'from-gray-700 to-gray-900'
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              AI-Powered Resume Generator
            </span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Generate Resume from LinkedIn
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your LinkedIn profile URL and let AI create a professional resume
          </p>
        </div>

        {!generated ? (
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Style
                  </label>
                  <select value={style} onChange={(e) => setStyle(e.target.value)} className="input-field">
                    {styles.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Theme
                  </label>
                  <select value={color} onChange={(e) => setColor(e.target.value)} className="input-field">
                    {colors.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={generateResume}
                disabled={!linkedinUrl || generating}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating Resume...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="card h-fit sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Customize Resume
              </h3>

              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white">Toggle Sections</h4>
                {Object.entries(visibleSections).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => toggleSection(key as keyof typeof visibleSections)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="capitalize text-gray-900 dark:text-white">{key}</span>
                    {value ? (
                      <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={downloadResume}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Resume</span>
              </button>

              <button
                onClick={() => setGenerated(false)}
                className="w-full mt-3 btn-secondary"
              >
                Generate New
              </button>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className={`bg-gradient-to-r ${colorSchemes[color]} text-white p-8 rounded-t-xl -m-6 mb-6`}>
                  <h2 className="text-3xl font-bold mb-2">{resume.name}</h2>
                  <p className="text-xl opacity-90">{resume.title}</p>
                </div>

                <div className="space-y-6">
                  {visibleSections.summary && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-300 dark:border-gray-600">
                        Professional Summary
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">{resume.summary}</p>
                    </div>
                  )}

                  {visibleSections.experience && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-300 dark:border-gray-600">
                        Experience
                      </h3>
                      <div className="space-y-4">
                        {resume.experience.map((exp, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">{exp.role}</h4>
                                <p className="text-purple-600 dark:text-purple-400">{exp.company}</p>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{exp.duration}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {visibleSections.education && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-300 dark:border-gray-600">
                        Education
                      </h3>
                      {resume.education.map((edu, idx) => (
                        <div key={idx} className="mb-2">
                          <p className="font-semibold text-gray-900 dark:text-white">{edu.degree}</p>
                          <p className="text-gray-700 dark:text-gray-300">{edu.institution} • {edu.year}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {visibleSections.skills && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-300 dark:border-gray-600">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills.map(skill => (
                          <span key={skill} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {visibleSections.certifications && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-300 dark:border-gray-600">
                        Certifications
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                        {resume.certifications.map(cert => (
                          <li key={cert}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
