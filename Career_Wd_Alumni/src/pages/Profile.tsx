import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { supabase, StudentProfile } from '../utils/supabase';

export default function Profile() {
  const [profile, setProfile] = useState<Partial<StudentProfile>>({
    name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    github_url: '',
    graduation_year: '',
    current_education: '',
    bio: '',
    skills: [],
    interests: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

  const checkAuthAndLoadProfile = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (currentUser) {
      setUser(currentUser);
      await loadProfile(currentUser.id, currentUser.email || '');
    } else {
      setLoading(false);
    }
  };

  const loadProfile = async (userId: string, userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile(data);
      } else {
        setProfile({
          name: '',
          email: userEmail,
          phone: '',
          linkedin_url: '',
          github_url: '',
          graduation_year: '',
          current_education: '',
          bio: '',
          skills: [],
          interests: []
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile.name || !profile.email) {
      alert('Name and Email are required!');
      return;
    }

    if (!profile.linkedin_url || !profile.github_url) {
      alert('LinkedIn and GitHub URLs are required!');
      return;
    }

    setSaving(true);

    try {
      if (user) {
        const profileData = {
          user_id: user.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone || '',
          linkedin_url: profile.linkedin_url || '',
          github_url: profile.github_url || '',
          graduation_year: profile.graduation_year || '',
          current_education: profile.current_education || '',
          bio: profile.bio || '',
          skills: profile.skills || [],
          interests: profile.interests || [],
          experience: profile.experience || [],
          education: profile.education || [],
          certifications: profile.certifications || [],
          resume_text: profile.resume_text || '',
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('student_profiles')
          .upsert(profileData, { onConflict: 'user_id' });

        if (error) throw error;

        alert('Profile saved successfully!');
      } else {
        alert('Please sign in to save your profile. Your data has been filled in the form.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !profile.skills?.includes(skill)) {
      setProfile({ ...profile, skills: [...(profile.skills || []), skill] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills?.filter(s => s !== skill) });
  };

  const addInterest = () => {
    const interest = interestInput.trim();
    if (interest && !profile.interests?.includes(interest)) {
      setProfile({ ...profile, interests: [...(profile.interests || []), interest] });
      setInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    setProfile({ ...profile, interests: profile.interests?.filter(i => i !== interest) });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Student Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Complete your profile to get better career recommendations
          </p>
        </div>

        {!user && (
          <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              You can fill out the profile form, but you need to sign in to save your data permanently.
            </p>
          </div>
        )}

        <div className="card mb-6">
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="input-field"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="input-field"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="input-field"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* LinkedIn Profile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                LinkedIn Profile *
              </label>
              <input
                type="url"
                value={profile.linkedin_url || ''}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                className="input-field"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            {/* GitHub Profile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub Profile *
              </label>
              <input
                type="url"
                value={profile.github_url || ''}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                className="input-field"
                placeholder="https://github.com/yourusername"
              />
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Graduation Year
              </label>
              <input
                type="text"
                value={profile.graduation_year || ''}
                onChange={(e) => setProfile({ ...profile, graduation_year: e.target.value })}
                className="input-field"
                placeholder="2025"
              />
            </div>

            {/* Current Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Education
              </label>
              <input
                type="text"
                value={profile.current_education || ''}
                onChange={(e) => setProfile({ ...profile, current_education: e.target.value })}
                className="input-field"
                placeholder="e.g., MSC Computer Science"
              />
            </div>

            {/* Bio / About You */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio / About You
              </label>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="input-field min-h-[120px] resize-none"
                placeholder="Tell us about yourself, your goals, and what you're looking for..."
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skills
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center space-x-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic py-2">
                    No skills added yet
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="input-field flex-1"
                  placeholder="Add a skill..."
                />
                <button
                  onClick={addSkill}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interests
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {profile.interests && profile.interests.length > 0 ? (
                  profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center space-x-2 px-3 py-1.5 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-lg text-sm font-medium"
                    >
                      <span>{interest}</span>
                      <button
                        onClick={() => removeInterest(interest)}
                        className="hover:bg-pink-200 dark:hover:bg-pink-800 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic py-2">
                    No interests added yet
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addInterest();
                    }
                  }}
                  className="input-field flex-1"
                  placeholder="Add an interest..."
                />
                <button
                  onClick={addInterest}
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Saving Profile...' : 'Save Profile'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
