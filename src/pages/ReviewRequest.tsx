import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, FreelancerProfile } from '../lib/supabase';
import { Send, CreditCard } from 'lucide-react';

type ReviewRequestProps = {
  onNavigate: (page: string) => void;
};

export default function ReviewRequest({ onNavigate }: ReviewRequestProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfile | null>(null);

  const [explanation, setExplanation] = useState('');
  const [amount, setAmount] = useState('50');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const platformOptions = ['Upwork', 'Fiverr', 'Freelancer', 'Toptal', 'PeoplePerHour', 'Other'];
  const amountOptions = [
    { value: '50', label: '$50 - Basic Review Package' },
    { value: '100', label: '$100 - Standard Review Package' },
    { value: '200', label: '$200 - Premium Review Package' },
    { value: '500', label: '$500 - Elite Review Package' },
  ];

  useEffect(() => {
    loadFreelancerProfile();
  }, [user]);

  const loadFreelancerProfile = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('freelancer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setFreelancerProfile(data);
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const togglePlatform = (platform: string) => {
    setPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!freelancerProfile) {
      setError('Please set up your freelancer profile first');
      return;
    }

    if (platforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('review_requests')
        .insert({
          freelancer_id: freelancerProfile.id,
          explanation,
          amount: parseFloat(amount),
          platforms,
          additional_info: additionalInfo || null,
          payment_status: 'pending',
          request_status: 'submitted',
        });

      if (insertError) throw insertError;

      await supabase.from('notifications').insert({
        user_id: user!.id,
        title: 'Review Request Submitted',
        message: 'Your review request has been submitted successfully. Our team will review it shortly.',
        type: 'success',
      });

      setSuccess('Review request submitted successfully! Redirecting to payment...');

      setTimeout(() => {
        onNavigate('freelancer-dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review request');
    } finally {
      setLoading(false);
    }
  };

  if (!freelancerProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Required</h2>
            <p className="text-gray-600 mb-6">
              You need to set up your freelancer profile before requesting reviews
            </p>
            <button
              onClick={() => onNavigate('setup-profile')}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all"
            >
              Set Up Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Request Review</h1>
            <p className="text-gray-600 mt-2">
              Submit your review request and complete payment to get started
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
                What kind of reviews do you need?
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                required
                rows={4}
                placeholder="Describe the type of reviews you're looking for, your target niche, and any specific requirements..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Package
              </label>
              <div className="space-y-3">
                {amountOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      amount === option.value
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={amount === option.value}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-4 h-4 text-teal-600"
                    />
                    <span className="ml-3 font-medium text-gray-900">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Platforms
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {platformOptions.map((platform) => (
                  <label
                    key={platform}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      platforms.includes(platform)
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={platforms.includes(platform)}
                      onChange={() => togglePlatform(platform)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-900">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
                <span className="text-gray-500 font-normal ml-2">(optional)</span>
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={3}
                placeholder="Any special requests or additional details..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Package:</span>
                  <span className="font-medium text-gray-900">
                    {amountOptions.find(o => o.value === amount)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platforms:</span>
                  <span className="font-medium text-gray-900">
                    {platforms.length > 0 ? platforms.join(', ') : 'None selected'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-teal-600">${amount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span>{loading ? 'Submitting...' : 'Submit & Proceed to Payment'}</span>
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
