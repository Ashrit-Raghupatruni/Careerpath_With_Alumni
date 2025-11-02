import { Target, Users, Sparkles, TrendingUp, ExternalLink } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About Dikshuch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Empowering students with AI-driven career guidance and alumni connections
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Dikshuch is an innovative Alumni Career Recommendation System designed to bridge
              the gap between students and successful alumni. Our platform leverages artificial
              intelligence to provide personalized career guidance, mentorship opportunities,
              and skill development resources.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              We believe that learning from those who have walked the path before you is one
              of the most effective ways to accelerate your career growth. Our mission is to
              make this knowledge accessible to every student at SRM University AP.
            </p>
          </div>

          <div className="space-y-6">
            <div className="card">
              <Target className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Our Vision
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                To create a thriving ecosystem where every student has access to personalized
                career guidance from experienced professionals.
              </p>
            </div>

            <div className="card">
              <Users className="w-10 h-10 text-pink-600 dark:text-pink-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Our Community
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                A network of 20+ successful alumni from top companies worldwide, ready to
                guide and mentor the next generation.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <Sparkles className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                AI Matching
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Advanced algorithms match you with the most relevant alumni mentors
              </p>
            </div>

            <div className="card text-center">
              <Users className="w-12 h-12 text-pink-600 dark:text-pink-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Alumni Network
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with alumni from Google, Microsoft, Amazon, and more
              </p>
            </div>

            <div className="card text-center">
              <Target className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Learning Paths
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Curated skill development pathways for various career tracks
              </p>
            </div>

            <div className="card text-center">
              <TrendingUp className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Career Growth
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your progress and achieve your career goals
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Powered by SRM University AP
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Dikshuch is proudly developed as part of SRM University AP's initiative to
              provide cutting-edge career support to our students. We combine academic
              excellence with industry insights to prepare students for successful careers.
            </p>
            <a
              href="https://srmap.edu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 btn-primary"
            >
              <span>Visit SRM University AP</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
