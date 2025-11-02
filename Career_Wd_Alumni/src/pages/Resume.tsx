import { useState } from 'react';
import { Download, Upload, Plus, Trash2 } from 'lucide-react';

interface ResumeSection {
  id: string;
  title: string;
  content: string;
}

export default function Resume() {
  const [sections, setSections] = useState<ResumeSection[]>([
    { id: '1', title: 'Personal Information', content: '' },
    { id: '2', title: 'Education', content: '' },
    { id: '3', title: 'Experience', content: '' },
    { id: '4', title: 'Skills', content: '' },
    { id: '5', title: 'Projects', content: '' }
  ]);
  const [fileName, setFileName] = useState('resume.txt');

  const updateSection = (id: string, content: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, content } : s));
  };

  const addSection = () => {
    const newSection: ResumeSection = {
      id: Date.now().toString(),
      title: 'New Section',
      content: ''
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const updateSectionTitle = (id: string, title: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, title } : s));
  };

  const downloadResume = () => {
    const content = sections
      .filter(s => s.content.trim())
      .map(s => `${s.title.toUpperCase()}\n${'='.repeat(s.title.length)}\n${s.content}\n`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();

    setSections([
      { id: '1', title: 'Parsed Content', content: text }
    ]);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Resume Builder
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and download your professional resume
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div>
            <div className="card mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editor</h2>
                <div className="flex space-x-2">
                  <label className="btn-secondary cursor-pointer flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button onClick={addSection} className="btn-primary flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Add Section</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                        className="font-semibold text-lg bg-transparent border-none focus:outline-none text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => removeSection(section.id)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, e.target.value)}
                      placeholder={`Enter ${section.title.toLowerCase()} details...`}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows={5}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="card sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preview</h2>
                <div>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="input-field text-sm mb-2"
                    placeholder="resume.txt"
                  />
                  <button
                    onClick={downloadResume}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-300 dark:border-gray-600 min-h-[600px] font-mono text-sm overflow-auto">
                {sections.filter(s => s.content.trim()).map((section) => (
                  <div key={section.id} className="mb-6">
                    <div className="font-bold text-lg mb-2 text-gray-900 dark:text-white uppercase">
                      {section.title}
                    </div>
                    <div className="border-b-2 border-gray-900 dark:border-white mb-2"></div>
                    <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
