import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Users, TrendingUp, LogIn } from 'lucide-react';
import CareerQuiz from '../components/quiz/CareerQuiz';
import AuthModal from '../components/auth/AuthModal';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleSignIn = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-purple-500 floating-blob"></div>
          <div className="absolute top-20 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-pink-500 floating-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-red-500 floating-blob" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center slide-up">
            <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">
                AI-Powered Career Guidance
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6">
              <span className="gradient-text">Dikshuch</span>
              <br />
              <span className="text-gray-900 dark:text-white">Alumni Career System</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
              Connect with successful alumni, discover career pathways, and get personalized
              recommendations powered by AI. Your journey to career success starts here.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
              <a href="#quiz" className="btn-primary flex items-center justify-center space-x-2 group w-full sm:w-auto">
                <span>Take Career Quiz</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              {!user && (
                <button
                  onClick={handleSignIn}
                  className="btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12 md:mt-16 px-4 fade-in">
              <div className="card">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">20+</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Alumni Mentors</div>
              </div>
              <div className="card">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600 dark:text-pink-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">8</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Learning Pathways</div>
              </div>
              <div className="card sm:col-span-2 md:col-span-1">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">95%</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Match Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="quiz" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Find Your Perfect Career Match
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Take our comprehensive 10-question career assessment and get matched with alumni
              who share your interests and goals.
            </p>
          </div>

          <CareerQuiz />
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose Dikshuch?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">
                      AI-Powered Matching
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Our advanced algorithm analyzes your skills, interests, and goals to connect
                      you with the most relevant alumni mentors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">
                      Extensive Alumni Network
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Connect with successful alumni from top companies like Google, Microsoft,
                      Amazon, and more.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">
                      Personalized Learning Paths
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Access curated learning resources and skill development pathways tailored
                      to your career goals.
                    </p>
                  </div>
                </div>
              </div>

              <Link to="/about" className="inline-flex items-center space-x-2 mt-8 text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                <span>Learn More About Us</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="relative">
              <div className="card p-8 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Success Rate</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">95% accuracy</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
    </div>
  );
}
