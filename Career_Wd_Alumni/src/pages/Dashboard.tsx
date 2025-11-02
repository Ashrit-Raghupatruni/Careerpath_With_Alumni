import { useState, useEffect } from 'react';
import { Search, TrendingUp, Users, Building2, Award } from 'lucide-react';
import { supabase, Alumni } from '../utils/supabase';

export default function Dashboard() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<Alumni[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    filterAlumni();
  }, [searchQuery, selectedBatch, selectedCompany, alumni]);

  const fetchAlumni = async () => {
    try {
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlumni(data || []);
      setFilteredAlumni(data || []);
    } catch (error) {
      console.error('Error fetching alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAlumni = () => {
    let filtered = [...alumni];

    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedBatch !== 'All') {
      filtered = filtered.filter((a) => a.batch === selectedBatch);
    }

    if (selectedCompany !== 'All') {
      filtered = filtered.filter((a) => a.company === selectedCompany);
    }

    setFilteredAlumni(filtered);
  };

  const batches = ['All', ...Array.from(new Set(alumni.map((a) => a.batch)))];
  const companies = ['All', ...Array.from(new Set(alumni.map((a) => a.company)))];
  const topSkills = getTopSkills();
  const topCompanies = getTopCompanies();

  function getTopSkills() {
    const skillCount: Record<string, number> = {};
    alumni.forEach((a) => {
      a.skills.forEach((skill) => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });
    return Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }

  function getTopCompanies() {
    const companyCount: Record<string, number> = {};
    alumni.forEach((a) => {
      companyCount[a.company] = (companyCount[a.company] || 0) + 1;
    });
    return Object.entries(companyCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Alumni Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore our network of successful alumni and their career journeys
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Alumni</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{alumni.length}</p>
              </div>
              <Users className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Companies</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{companies.length - 1}</p>
              </div>
              <Building2 className="w-12 h-12 text-pink-600 dark:text-pink-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Batches</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{batches.length - 1}</p>
              </div>
              <Award className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Mentors</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{alumni.length}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Top Skills & Companies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Top Skills
            </h3>
            <div className="space-y-3">
              {topSkills.map(([skill, count]) => (
                <div key={skill}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{count} alumni</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                      style={{ width: `${(count / alumni.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-pink-600 dark:text-pink-400" />
              Top Companies
            </h3>
            <div className="space-y-3">
              {topCompanies.map(([company, count]) => (
                <div key={company}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{company}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{count} alumni</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-600 to-red-600 rounded-full"
                      style={{ width: `${(count / alumni.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search alumni, skills, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="input-field"
            >
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch === 'All' ? 'All Batches' : `Batch ${batch}`}
                </option>
              ))}
            </select>

            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="input-field"
            >
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company === 'All' ? 'All Companies' : company}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alumni Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading alumni...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumnus) => (
              <div key={alumnus.id} className="card hover:shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {alumnus.name}
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium mb-1">
                      {alumnus.role}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {alumnus.company} • Batch {alumnus.batch}
                    </p>
                  </div>
                </div>

                {alumnus.summary && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {alumnus.summary}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {alumnus.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {alumnus.skills.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs font-medium">
                      +{alumnus.skills.length - 4} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={`mailto:${alumnus.email}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {alumnus.email}
                  </a>
                  {alumnus.linkedin_url && (
                    <a
                      href={alumnus.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredAlumni.length === 0 && (
          <div className="text-center py-12 card">
            <p className="text-gray-600 dark:text-gray-400">
              No alumni found matching your filters. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
