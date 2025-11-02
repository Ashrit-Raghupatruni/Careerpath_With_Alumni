import { useState, useEffect } from 'react';
import { Shield, Users, MessageSquare, TrendingUp, Database, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase, PaymentHistory } from '../utils/supabase';

export default function Admin() {
  const [stats, setStats] = useState({
    totalAlumni: 0,
    totalStudents: 0,
    totalFeedback: 0,
    totalQuizzes: 0,
    totalPayments: 0,
    totalRevenue: 0
  });
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    fetchPayments();
  }, []);

  const fetchStats = async () => {
    try {
      const [alumni, profiles, feedback, quizzes, paymentData] = await Promise.all([
        supabase.from('alumni').select('id', { count: 'exact', head: true }),
        supabase.from('student_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('feedback').select('id', { count: 'exact', head: true }),
        supabase.from('quiz_responses').select('id', { count: 'exact', head: true }),
        supabase.from('payment_history').select('amount')
      ]);

      const totalRevenue = paymentData.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setStats({
        totalAlumni: alumni.count || 0,
        totalStudents: profiles.count || 0,
        totalFeedback: feedback.count || 0,
        totalQuizzes: quizzes.count || 0,
        totalPayments: paymentData.data?.length || 0,
        totalRevenue: totalRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleManageAlumni = () => {
    setActiveSection('alumni');
    alert('Manage Alumni feature - This will show a list of all alumni members where you can add, edit, or remove them.');
  };

  const handleViewFeedback = () => {
    setActiveSection('feedback');
    alert('View Feedback feature - This will display all student feedback and ratings submitted through the platform.');
  };

  const handleManageStudents = () => {
    setActiveSection('students');
    alert('Manage Students feature - This will show a list of all registered student profiles with their details.');
  };

  const handleViewAnalytics = () => {
    setActiveSection('analytics');
    alert('View Analytics feature - This will display detailed statistics, charts, and insights about platform usage.');
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h1 className="font-heading text-4xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage system data and monitor platform activity
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admin data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="card hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Total Alumni
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalAlumni}
                    </p>
                  </div>
                  <Users className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </div>
              </div>

              <div className="card hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Student Profiles
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalStudents}
                    </p>
                  </div>
                  <Database className="w-12 h-12 text-pink-600 dark:text-pink-400" />
                </div>
              </div>

              <div className="card hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Feedback Received
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalFeedback}
                    </p>
                  </div>
                  <MessageSquare className="w-12 h-12 text-red-600 dark:text-red-400" />
                </div>
              </div>

              <div className="card hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Quiz Completions
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalQuizzes}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <div className="card hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Total Payments
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalPayments}
                    </p>
                  </div>
                  <DollarSign className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              <div className="card hover:shadow-2xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={handleManageAlumni}
                    className="w-full btn-primary text-left px-6 py-4 flex items-center justify-between group"
                  >
                    <span className="font-semibold">Manage Alumni</span>
                    <Users className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    onClick={handleViewFeedback}
                    className="w-full btn-secondary text-left px-6 py-4 flex items-center justify-between group"
                  >
                    <span className="font-semibold">View Feedback</span>
                    <MessageSquare className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    onClick={handleManageStudents}
                    className="w-full btn-secondary text-left px-6 py-4 flex items-center justify-between group"
                  >
                    <span className="font-semibold">Manage Students</span>
                    <Database className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    onClick={handleViewAnalytics}
                    className="w-full btn-secondary text-left px-6 py-4 flex items-center justify-between group"
                  >
                    <span className="font-semibold">View Analytics</span>
                    <TrendingUp className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {activeSection ? (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-1">
                        Last Action
                      </p>
                      <p className="text-sm text-purple-700 dark:text-purple-400">
                        Clicked: {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        No recent activity to display. Click on any Quick Action to get started.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <span>Payment History</span>
                </h2>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Last 10 transactions
                </span>
              </div>

              {payments.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No payment history available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Plan
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {payment.plan}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              ${Number(payment.amount).toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(payment.status)}
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(payment.status)}`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(payment.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
