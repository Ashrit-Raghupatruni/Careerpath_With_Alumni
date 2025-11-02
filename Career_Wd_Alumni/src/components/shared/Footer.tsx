import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading font-bold text-xl gradient-text mb-3">Dikshuch</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Alumni Career Recommendation System
            </p>
            <a
              href="https://srmap.edu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <span className="text-sm font-medium">SRM University AP</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Home</a></li>
              <li><a href="/dashboard" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Dashboard</a></li>
              <li><a href="/skills" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Learning Paths</a></li>
              <li><a href="/pricing" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="/contact" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact Us</a></li>
              <li><a href="/about" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">About</a></li>
              <li><a href="/admin" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Admin</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 Dikshuch Alumni Career Recommendation System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
