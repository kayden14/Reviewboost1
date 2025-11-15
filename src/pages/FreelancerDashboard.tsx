import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, FreelancerProfile, ReviewRequest, Notification } from '../lib/supabase';
import { User, FileText, Bell, Award, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type FreelancerDashboardProps = {
  onNavigate: (page: string) => void;
};

export default function FreelancerDashboard({ onNavigate }: FreelancerDashboardProps) {
  const { user, profile } = useAuth();
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfile | null>(null);
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'requests' | 'notifications'>('profile');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const { data: fpData } = await supabase
        .from('freelancer_profiles')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      setFreelancerProfile(fpData);

      if (fpData) {
        const { data: rrData } = await supabase
          .from('review_requests')
          .select('*')
          .eq('freelancer_id', fpData.id)
          .order('created_at', { ascending: false });

        setReviewRequests(rrData || []);
      }

      const { data: notifData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setNotifications(notifData || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      onboarded: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Onboarded' },
      matched: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, text: 'Matched' },
      reviewed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Reviewed' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejected' },
      submitted: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Submitted' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approved' },
      issued: { color: 'bg-emerald-100 text-emerald-800', icon: Award, text: 'Issued' },
    };

    const badge = badges[status as keyof typeof badges] || badges.onboarded;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        <span>{badge.text}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name}</h1>
          <p className="text-gray-600 mt-2">Manage your profile and track your review requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vetting Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{freelancerProfile?.vetting_score || 0}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Review Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{reviewRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profile Status</p>
                <div className="mt-2">{getStatusBadge(freelancerProfile?.status || 'onboarded')}</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {!freelancerProfile && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Complete Your Profile</h3>
            <p className="text-yellow-800 mb-4">You haven't set up your freelancer profile yet. Complete your profile to start getting matched with review opportunities.</p>
            <button
              onClick={() => onNavigate('setup-profile')}
              className="px-6 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Set Up Profile
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'requests'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Review Requests
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === 'notifications'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Notifications
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {freelancerProfile ? (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                          <div className="flex flex-wrap gap-2">
                            {freelancerProfile.skills.map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
                          <p className="text-gray-900">{freelancerProfile.portfolio_url || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('setup-profile')}
                      className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No profile information available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-4">
                {reviewRequests.length > 0 ? (
                  reviewRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">Review Request</h4>
                          <p className="text-sm text-gray-600 mt-1">{request.explanation}</p>
                        </div>
                        {getStatusBadge(request.request_status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Amount</p>
                          <p className="font-medium text-gray-900">${request.amount}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Platforms</p>
                          <p className="font-medium text-gray-900">{request.platforms.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment</p>
                          <p className="font-medium text-gray-900">{request.payment_status}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Created</p>
                          <p className="font-medium text-gray-900">
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No review requests yet</p>
                    <button
                      onClick={() => onNavigate('review-request')}
                      className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Request Your First Review
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read ? 'bg-white border-gray-200' : 'bg-teal-50 border-teal-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Bell className="w-4 h-4 text-gray-600" />
                            <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No notifications yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
