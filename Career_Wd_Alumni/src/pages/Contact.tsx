import { useState } from 'react';
import { Send, Mail, MessageSquare } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    message: '',
    rating: 5
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('feedback').insert({
        user_id: user?.id,
        message: formData.message,
        rating: formData.rating
      });

      setSubmitted(true);
      setFormData({ message: '', rating: 5 });

      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Contact & Feedback
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            We'd love to hear from you. Send us your feedback or questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <Mail className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Us</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              For general inquiries and support
            </p>
            <a
              href="mailto:support@dikshuch.edu"
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              support@dikshuch.edu
            </a>
          </div>

          <div className="card">
            <MessageSquare className="w-12 h-12 text-pink-600 dark:text-pink-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Live Chat
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Available Monday-Friday, 9am-5pm
            </p>
            <button className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
              Start Chat
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Send Feedback
          </h2>

          {submitted && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-medium">
                Thank you! Your feedback has been submitted successfully.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="input-field min-h-[150px] resize-none"
                placeholder="Tell us what you think..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating (1-5)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className={`w-12 h-12 rounded-lg font-bold transition-all duration-300 ${
                      formData.rating >= rating
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !formData.message}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
