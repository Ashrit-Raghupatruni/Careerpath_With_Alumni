import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, RefreshCw, ExternalLink, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, Alumni } from '../../utils/supabase';
import { matchAlumni } from '../../utils/quizMatcher';

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
  rating: number;
}

const quizQuestions = [
  {
    id: 1,
    question: 'What are your primary technical skills?',
    type: 'multi-select',
    options: ['Python', 'JavaScript', 'Java', 'C++', 'SQL', 'React', 'Machine Learning', 'Cloud Computing', 'Cybersecurity', 'Data Analysis'],
    field: 'skills'
  },
  {
    id: 2,
    question: 'What are your career interests?',
    type: 'multi-select',
    options: ['Software Development', 'Data Science', 'Product Management', 'UI/UX Design', 'DevOps', 'AI Research', 'Cybersecurity', 'Business Analysis'],
    field: 'interests'
  },
  {
    id: 3,
    question: 'What is your dream career role?',
    type: 'text',
    field: 'career_goal'
  },
  {
    id: 4,
    question: 'What is your preferred company size?',
    type: 'single-select',
    options: ['Startup (1-50)', 'Mid-size (51-500)', 'Large Enterprise (500+)', 'Any'],
    field: 'company_size'
  },
  {
    id: 5,
    question: 'What industries interest you most?',
    type: 'multi-select',
    options: ['Technology', 'Finance', 'Healthcare', 'E-commerce', 'Entertainment', 'Education', 'Gaming', 'Automotive'],
    field: 'industries'
  },
  {
    id: 6,
    question: 'What is your experience level?',
    type: 'single-select',
    options: ['Student', 'Entry Level (0-2 years)', 'Mid Level (3-5 years)', 'Senior (5+ years)'],
    field: 'experience_level'
  },
  {
    id: 7,
    question: 'What soft skills do you excel at?',
    type: 'multi-select',
    options: ['Communication', 'Leadership', 'Problem Solving', 'Team Collaboration', 'Time Management', 'Creativity', 'Adaptability'],
    field: 'soft_skills'
  },
  {
    id: 8,
    question: 'What motivates you in your career?',
    type: 'multi-select',
    options: ['Innovation', 'Impact', 'Learning', 'Financial Growth', 'Work-Life Balance', 'Recognition', 'Helping Others'],
    field: 'motivations'
  },
  {
    id: 9,
    question: 'What work environment do you prefer?',
    type: 'single-select',
    options: ['Remote', 'Hybrid', 'On-site', 'Flexible'],
    field: 'work_environment'
  },
  {
    id: 10,
    question: 'What are your long-term career goals?',
    type: 'text',
    field: 'long_term_goals'
  }
];

export default function CareerQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [matches, setMatches] = useState<Array<{ alumni: Alumni; score: number; explanation: string }>>([]);
  const [recommendedResources, setRecommendedResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(false);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleMultiSelect = (option: string) => {
    const currentAnswers = answers[question.field] || [];
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter((a: string) => a !== option)
      : [...currentAnswers, option];
    setAnswers({ ...answers, [question.field]: newAnswers });
  };

  const handleSingleSelect = (option: string) => {
    setAnswers({ ...answers, [question.field]: option });
  };

  const handleTextInput = (value: string) => {
    setAnswers({ ...answers, [question.field]: value });
  };

  const canProceed = () => {
    const answer = answers[question.field];
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return answer.trim().length > 0;
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Fetch all alumni
      const { data: allAlumni, error } = await supabase
        .from('alumni')
        .select('*');

      if (error) throw error;

      // Calculate matches
      const matchResults = matchAlumni(answers, allAlumni || []);
      setMatches(matchResults);

      // Fetch recommended resources based on career interests
      const careerInterests = answers.interests || [];
      const { data: resources } = await supabase
        .from('learning_resources')
        .select('*')
        .eq('is_free', true)
        .order('rating', { ascending: false })
        .limit(6);

      // Filter resources that match career interests
      const filteredResources = (resources || []).filter(r =>
        careerInterests.some((interest: string) =>
          r.career_paths.some((path: string) =>
            path.toLowerCase().includes(interest.toLowerCase()) ||
            interest.toLowerCase().includes(path.toLowerCase())
          )
        )
      );

      setRecommendedResources(filteredResources.length > 0 ? filteredResources : resources?.slice(0, 6) || []);

      // Save quiz response
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('quiz_responses').insert({
        user_id: user?.id,
        answers,
        matched_alumni_ids: matchResults.map(m => m.alumni.id),
        score: matchResults[0]?.score || 0
      });

      // Track analytics
      await supabase.from('analytics_events').insert({
        event_type: 'quiz_completed',
        user_id: user?.id,
        metadata: { total_questions: quizQuestions.length }
      });

      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setMatches([]);
    setRecommendedResources([]);
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Quiz Complete!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Here are your top 5 alumni matches based on your responses
            </p>
          </div>

          <div className="space-y-4">
            {matches.map((match, index) => (
              <div
                key={match.alumni.id}
                className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        #{index + 1}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {match.alumni.name}
                      </h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                      {match.alumni.role} at {match.alumni.company}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Batch {match.alumni.batch} • {match.explanation}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-1">
                      {match.score}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Match</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {match.alumni.skills.slice(0, 5).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {match.alumni.linkedin_url && (
                  <a
                    href={match.alumni.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
                  >
                    <span>View LinkedIn Profile</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleRetake}
            className="w-full mt-8 flex items-center justify-center space-x-2 btn-primary"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Retake Quiz</span>
          </button>
        </div>

        {recommendedResources.length > 0 && (
          <div className="card mt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Recommended Learning Resources
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Based on your career interests, here are some free resources to help you get started
                </p>
              </div>
              <Link
                to="/resources"
                className="btn-secondary flex items-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>View All</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedResources.map((resource) => (
                <div
                  key={resource.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {resource.title}
                    </h3>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-xs font-medium">
                      {resource.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{resource.provider}</span>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 hover:underline font-medium"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {question.question}
        </h2>

        {question.type === 'multi-select' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleMultiSelect(option)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  (answers[question.field] || []).includes(option)
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">{option}</span>
                  {(answers[question.field] || []).includes(option) && (
                    <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {question.type === 'single-select' && (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleSingleSelect(option)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  answers[question.field] === option
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">{option}</span>
                  {answers[question.field] === option && (
                    <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {question.type === 'text' && (
          <textarea
            value={answers[question.field] || ''}
            onChange={(e) => handleTextInput(e.target.value)}
            placeholder="Type your answer here..."
            className="input-field min-h-[120px] resize-none"
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        {currentQuestion === quizQuestions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || loading}
            className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Submit Quiz</span>
                <Check className="w-5 h-5" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
