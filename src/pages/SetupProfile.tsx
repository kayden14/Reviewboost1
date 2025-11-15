import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, FreelancerProfile } from '../lib/supabase';
import { Save } from 'lucide-react';

type SetupProfileProps = {
  onNavigate: (page: string) => void;
};

export default function SetupProfile({ onNavigate }: SetupProfileProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingProfile, setExistingProfile] = useState<FreelancerProfile | null>(null);

  const [skills, setSkills] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [credentials, setCredentials] = useState('');

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('freelancer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setExistingProfile(data);
        setSkills(data.skills.join(', '));
        setPortfolioUrl(data.portfolio_url || '');
        setCredentials(data.credentials || '');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);

      const profileData = {
        user_id: user!.id,
        skills: skillsArray,
        portfolio_url: portfolioUrl || null,
        credentials: credentials || null,
        status: 'onboarded',
        vetting_score: Math.floor(Math.random() * 30) + 50,
      };

      if (existingProfile) {
        const { error: updateError } = await supabase
          .from('freelancer_profiles')
          .update(profileData)
          .eq('id', existingProfile.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('freelancer_profiles')
          .insert(profileData);

        if (insertError) throw insertError;

        await supabase.from('notifications').insert({
          user_id: user!.id,
          title: 'Profile Created',
          message: 'Your freelancer profile has been created successfully. Our AI matching engine will review your profile.',
          type: 'success',
        });
      }

      setSuccess('Profile saved successfully!');
      setTimeout(() => {
        onNavigate('freelancer-dashboard');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {existingProfile ? 'Update Your Profile' : 'Set Up Your Freelancer Profile'}
            </h1>
            <p className="text-gray-600 mt-2">
              Provide your information to get matched with verified review opportunities
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
                <span className="text-gray-500 font-normal ml-2">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
                placeholder="e.g. Web Development, JavaScript, React, Node.js"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                List your main skills that you want to be matched for
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio URL
                <span className="text-gray-500 font-normal ml-2">(optional)</span>
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://yourportfolio.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credentials & Experience
                <span className="text-gray-500 font-normal ml-2">(optional)</span>
              </label>
              <textarea
                value={credentials}
                onChange={(e) => setCredentials(e.target.value)}
                rows={4}
                placeholder="Describe your certifications, degrees, and relevant experience..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Saving...' : 'Save Profile'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('freelancer-dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
