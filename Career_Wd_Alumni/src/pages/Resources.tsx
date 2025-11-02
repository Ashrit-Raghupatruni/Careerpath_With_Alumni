import { useState, useEffect } from 'react';
import { Search, BookOpen, Video, FileText, Code, Star, Clock, Filter, Bookmark, ExternalLink } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';

interface LearningResource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  career_paths: string[];
  level: string;
  duration: string;
  provider: string;
  thumbnail_url: string | null;
  is_free: boolean;
  rating: number;
}

interface SavedResource {
  resource_id: string;
  completed: boolean;
}

export default function Resources() {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<LearningResource[]>([]);
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCareer, setSelectedCareer] = useState('All');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchResources();
    if (user) {
      fetchSavedResources();
    }
  }, [user]);

  useEffect(() => {
    filterResources();
  }, [searchQuery, selectedType, selectedLevel, selectedCareer, resources]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_resources')
        .select('*')
        .eq('is_free', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setResources(data || []);
      setFilteredResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedResources = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_saved_resources')
        .select('resource_id, completed')
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedResources(data || []);
    } catch (error) {
      console.error('Error fetching saved resources:', error);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.career_paths.some(path => path.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter((r) => r.type === selectedType);
    }

    if (selectedLevel !== 'All') {
      filtered = filtered.filter((r) => r.level === selectedLevel);
    }

    if (selectedCareer !== 'All') {
      filtered = filtered.filter((r) => r.career_paths.includes(selectedCareer));
    }

    setFilteredResources(filtered);
  };

  const handleSaveResource = async (resourceId: string) => {
    if (!user) {
      alert('Please sign in to save resources');
      return;
    }

    const isSaved = savedResources.some(sr => sr.resource_id === resourceId);

    try {
      if (isSaved) {
        const { error } = await supabase
          .from('user_saved_resources')
          .delete()
          .eq('user_id', user.id)
          .eq('resource_id', resourceId);

        if (error) throw error;
        setSavedResources(savedResources.filter(sr => sr.resource_id !== resourceId));
      } else {
        const { error } = await supabase
          .from('user_saved_resources')
          .insert({ user_id: user.id, resource_id: resourceId });

        if (error) throw error;
        setSavedResources([...savedResources, { resource_id: resourceId, completed: false }]);
      }
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Failed to save resource');
    }
  };

  const isResourceSaved = (resourceId: string) => {
    return savedResources.some(sr => sr.resource_id === resourceId);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'course': return <BookOpen className="w-5 h-5" />;
      case 'article': return <FileText className="w-5 h-5" />;
      case 'tutorial': return <Code className="w-5 h-5" />;
      case 'interactive': return <Code className="w-5 h-5" />;
      case 'documentation': return <FileText className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const allCareerPaths = [...new Set(resources.flatMap(r => r.career_paths))].sort();
  const types = ['All', 'video', 'course', 'article', 'tutorial', 'interactive', 'documentation'];
  const levels = ['All', 'beginner', 'intermediate', 'advanced'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 slide-up">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Free Learning <span className="gradient-text">Resources</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover curated free resources to accelerate your career growth. From beginner tutorials to advanced courses.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources, topics, or providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12 w-full"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-purple-500 transition-all"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-purple-500 transition-all"
            >
              {levels.map(level => (
                <option key={level} value={level}>
                  {level === 'All' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-purple-500 transition-all"
            >
              <option value="All">All Career Paths</option>
              {allCareerPaths.map(path => (
                <option key={path} value={path}>{path}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredResources.length}</span> resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="card group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                    {getTypeIcon(resource.type)}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(resource.level)}`}>
                    {resource.level}
                  </span>
                </div>
                <button
                  onClick={() => handleSaveResource(resource.id)}
                  className={`p-2 rounded-lg transition-all ${
                    isResourceSaved(resource.id)
                      ? 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'
                      : 'text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                  }`}
                  title={isResourceSaved(resource.id) ? 'Remove from saved' : 'Save resource'}
                >
                  <Bookmark className={`w-5 h-5 ${isResourceSaved(resource.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {resource.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {resource.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {resource.career_paths.slice(0, 2).map((path, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                  >
                    {path}
                  </span>
                ))}
                {resource.career_paths.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                    +{resource.career_paths.length - 2} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{resource.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{resource.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">{resource.provider}</span>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm transition-colors"
                >
                  <span>View</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
