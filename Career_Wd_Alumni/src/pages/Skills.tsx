import { useState, useEffect } from 'react';
import { BookOpen, Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { supabase, SkillPathway } from '../utils/supabase';

export default function Skills() {
  const [pathways, setPathways] = useState<SkillPathway[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPathways();
  }, []);

  const fetchPathways = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_pathways')
        .select('*')
        .order('category');

      if (error) throw error;
      setPathways(data || []);
    } catch (error) {
      console.error('Error fetching pathways:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPathways = pathways.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const categories = ['All', ...Array.from(new Set(pathways.map(p => p.category)))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const difficultyColors: Record<string, string> = {
    Beginner: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    Intermediate: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    Advanced: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Skill Learning Pathways
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Curated learning paths to master in-demand skills
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="input-field"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pathways */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading pathways...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPathways.map((pathway) => (
              <div key={pathway.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {pathway.skill_name}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className={`px-2 py-1 rounded-full font-medium ${difficultyColors[pathway.difficulty]}`}>
                        {pathway.difficulty}
                      </span>
                      <span className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {pathway.duration}
                      </span>
                    </div>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>

                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                    {pathway.category}
                  </span>
                </div>

                {pathway.prerequisites.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prerequisites:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pathway.prerequisites.map(prereq => (
                        <span
                          key={prereq}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setExpandedId(expandedId === pathway.id ? null : pathway.id)}
                  className="w-full flex items-center justify-between text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                >
                  <span>View Resources</span>
                  {expandedId === pathway.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {expandedId === pathway.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    {pathway.resources.map((resource: any, idx: number) => (
                      <a
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {resource.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {resource.type}
                            </p>
                          </div>
                          <ExternalLink className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
