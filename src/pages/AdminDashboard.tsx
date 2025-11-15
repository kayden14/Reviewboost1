import { useEffect, useState, useMemo, Dispatch, SetStateAction } from 'react';
import { supabase, FreelancerProfile, ReviewRequest, Match, ContactMessage } from '../lib/supabase';
import { Users, FileText, MessageSquare, Award } from 'lucide-react';

// Helper union for tabs
type TabKey = 'freelancers' | 'requests' | 'matches' | 'messages';

// Props for AdminDashboard
interface AdminDashboardProps {
  onNavigate?: Dispatch<SetStateAction<string>>;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('freelancers');
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to handle tab change and optional onNavigate callback
  const goToTab = (tab: TabKey) => {
    setActiveTab(tab);
    if (onNavigate) onNavigate(tab);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);

    try {
      const freelancersQ = supabase
        .from('freelancer_profiles')
        .select('*, profiles(full_name, email, id)')
        .order('created_at', { ascending: false });

      const requestsQ = supabase
        .from('review_requests')
        .select('*, freelancer_profiles(id, user_id, profiles(full_name, email))')
        .order('created_at', { ascending: false });

      const matchesQ = supabase.from('matches').select('*').order('created_at', { ascending: false });

      const messagesQ = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      const [fRes, rRes, mRes, msgRes] = await Promise.all([freelancersQ, requestsQ, matchesQ, messagesQ]);

      if (fRes.error) throw new Error(`Freelancers load error: ${fRes.error.message}`);
      if (rRes.error) throw new Error(`Requests load error: ${rRes.error.message}`);
      if (mRes.error) throw new Error(`Matches load error: ${mRes.error.message}`);
      if (msgRes.error) throw new Error(`Messages load error: ${msgRes.error.message}`);

      setFreelancers(fRes.data ?? []);
      setReviewRequests(rRes.data ?? []);
      setMatches(mRes.data ?? []);
      setMessages(msgRes.data ?? []);
    } catch (err: any) {
      console.error('Error loading admin data:', err);
      setError(err.message || 'Error loading admin data');
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (userId: string | null | undefined, title: string, message: string, type: 'success' | 'info' | 'error' = 'info') => {
    if (!userId) return;
    const { error: notifError } = await supabase.from('notifications').insert({
      user_id: userId,
      title,
      message,
      type,
    });
    if (notifError) console.warn('Notification error:', notifError.message);
  };

  const updateFreelancerStatus = async (profileId: string, status: FreelancerProfile['status'], rejectionReasons?: string[]) => {
    setActionLoading(profileId);
    setError(null);
    try {
      const updateData: Record<string, unknown> = { status };
      if (rejectionReasons) updateData.rejection_reasons = rejectionReasons;

      const { error: updateError } = await supabase.from('freelancer_profiles').update(updateData).eq('id', profileId);
      if (updateError) throw updateError;

      const freelancer = freelancers.find((f) => f.id === profileId);
      const userId = (freelancer as any)?.user_id ?? (freelancer as any)?.profiles?.id ?? null;

      if (userId) {
        await sendNotification(
          userId as string,
          `Profile ${status}`,
          `Your freelancer profile has been ${status}. ${rejectionReasons ? `Reasons: ${rejectionReasons.join(', ')}` : ''}`,
          status === 'rejected' ? 'error' : 'success'
        );
      }

      setFreelancers((prev) => prev.map((f) => (f.id === profileId ? { ...f, status } : f)));
    } catch (err: any) {
      console.error('Error updating freelancer status:', err);
      setError(err.message || 'Error updating freelancer status');
    } finally {
      setActionLoading(null);
    }
  };

  const updateReviewRequestStatus = async (requestId: string, status: ReviewRequest['request_status'], adminNotes?: string) => {
    setActionLoading(requestId);
    setError(null);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const updateData: Record<string, unknown> = { request_status: status, admin_notes: adminNotes ?? null };

      if (status === 'approved') {
        updateData.approved_by = authData.user?.id ?? null;
        updateData.approved_at = new Date().toISOString();
      }
      if (status === 'issued') {
        updateData.issued_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase.from('review_requests').update(updateData).eq('id', requestId);
      if (updateError) throw updateError;

      const request = reviewRequests.find((r) => r.id === requestId) as any;
      const userId = request?.freelancer_profiles?.user_id ?? null;

      if (userId) {
        await sendNotification(
          userId,
          `Review Request ${status}`,
          `Your review request has been ${status}. ${adminNotes ? `Note: ${adminNotes}` : ''}`,
          status === 'rejected' ? 'error' : status === 'issued' ? 'success' : 'info'
        );
      }

      setReviewRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, request_status: status } : r)));
    } catch (err: any) {
      console.error('Error updating review request:', err);
      setError(err.message || 'Error updating review request');
    } finally {
      setActionLoading(null);
    }
  };

  const createMatch = async (freelancerId: string) => {
    setActionLoading(freelancerId);
    setError(null);

    try {
      const matchScore = Math.floor(Math.random() * 30) + 70;
      const { error: insertError } = await supabase.from('matches').insert({
        freelancer_id: freelancerId,
        match_score: matchScore,
        match_criteria: { auto_generated: true },
        status: 'pending',
      });
      if (insertError) throw insertError;

      const freelancer = freelancers.find((f) => f.id === freelancerId) as any;
      const userId = freelancer?.user_id ?? null;
      if (userId) {
        await sendNotification(userId, 'New Match Available', `You've been matched with a review opportunity! Match score: ${matchScore}`, 'success');
      }

      const { data: matchesData, error: matchesError } = await supabase.from('matches').select('*').order('created_at', { ascending: false });
      if (!matchesError) setMatches(matchesData ?? []);
    } catch (err: any) {
      console.error('Error creating match:', err);
      setError(err.message || 'Error creating match');
    } finally {
      setActionLoading(null);
    }
  };

  const updateMessageStatus = async (messageId: string, status: ContactMessage['status']) => {
    setActionLoading(messageId);
    setError(null);

    try {
      const { error: updateError } = await supabase.from('contact_messages').update({ status }).eq('id', messageId);
      if (updateError) throw updateError;
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, status } : m)));
    } catch (err: any) {
      console.error('Error updating message status:', err);
      setError(err.message || 'Error updating message status');
    } finally {
      setActionLoading(null);
    }
  };

  const stats = useMemo(() => {
    return [
      { label: 'Total Freelancers', value: freelancers.length, icon: Users, color: 'bg-blue-100 text-blue-600' },
      { label: 'Review Requests', value: reviewRequests.length, icon: FileText, color: 'bg-emerald-100 text-emerald-600' },
      { label: 'Active Matches', value: matches.filter((m) => m.status === 'pending').length, icon: Award, color: 'bg-teal-100 text-teal-600' },
      { label: 'Messages', value: messages.filter((m) => m.status === 'new').length, icon: MessageSquare, color: 'bg-purple-100 text-purple-600' },
    ];
  }, [freelancers, reviewRequests, matches, messages]);

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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage freelancers, reviews, and platform operations</p>
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button onClick={() => goToTab('freelancers')} className={`py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'freelancers' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Freelancers</button>
              <button onClick={() => goToTab('requests')} className={`py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'requests' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Review Requests</button>
              <button onClick={() => goToTab('matches')} className={`py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'matches' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Matches</button>
              <button onClick={() => goToTab('messages')} className={`py-4 border-b-2 font-medium text-sm transition-colors relative ${activeTab === 'messages' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                Messages
                {messages.filter((m) => m.status === 'new').length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {messages.filter((m) => m.status === 'new').length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Render Tab Contents */}
          <div className="p-6">
            {/* Freelancers Tab */}
            {activeTab === 'freelancers' && (
              <div className="space-y-4">
                {freelancers.map((freelancer) => (
                  <div key={freelancer.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{(freelancer as any).profiles?.full_name ?? 'Unknown'}</h4>
                        <p className="text-sm text-gray-600">{(freelancer as any).profiles?.email ?? ''}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Array.isArray(freelancer.skills) ? freelancer.skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-teal-100 text-teal-800 rounded text-xs">{skill}</span>
                          )) : <span className="text-xs text-gray-500">No skills listed</span>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Score: {freelancer.vetting_score ?? 'N/A'}</span>
                        <span className={`px-3 py-1 rounded-full text-xs ${freelancer.status === 'reviewed' ? 'bg-green-100 text-green-800' : freelancer.status === 'matched' ? 'bg-yellow-100 text-yellow-800' : freelancer.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{freelancer.status}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {freelancer.status === 'onboarded' && (
                        <>
                          <button disabled={actionLoading === freelancer.id} onClick={() => updateFreelancerStatus(freelancer.id, 'matched')} className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700">{actionLoading === freelancer.id ? 'Working...' : 'Approve'}</button>
                          <button disabled={actionLoading === freelancer.id} onClick={() => updateFreelancerStatus(freelancer.id, 'rejected', ['Insufficient experience'])} className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">{actionLoading === freelancer.id ? 'Working...' : 'Reject'}</button>
                          <button disabled={actionLoading === freelancer.id} onClick={() => createMatch(freelancer.id)} className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">{actionLoading === freelancer.id ? 'Working...' : 'Create Match'}</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Review Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-4">
                {reviewRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Review Request</h4>
                        <p className="text-sm text-gray-600 mt-1">{(request as any).explanation ?? ''}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                          <div><p className="text-gray-600">Amount</p><p className="font-medium">${(request as any).amount ?? '0'}</p></div>
                          <div><p className="text-gray-600">Platforms</p><p className="font-medium">{Array.isArray((request as any).platforms) ? (request as any).platforms.join(', ') : (request as any).platforms ?? ''}</p></div>
                          <div><p className="text-gray-600">Payment</p><p className="font-medium">{(request as any).payment_status ?? ''}</p></div>
                          <div><p className="text-gray-600">Status</p><p className="font-medium">{(request as any).request_status ?? ''}</p></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {(request as any).request_status === 'submitted' && (
                        <>
                          <button disabled={actionLoading === request.id} onClick={() => updateReviewRequestStatus(request.id, 'approved')} className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700">{actionLoading === request.id ? 'Working...' : 'Approve'}</button>
                          <button disabled={actionLoading === request.id} onClick={() => updateReviewRequestStatus(request.id, 'rejected', 'Does not meet criteria')} className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">{actionLoading === request.id ? 'Working...' : 'Reject'}</button>
                        </>
                      )}
                      {(request as any).request_status === 'approved' && (
                        <button disabled={actionLoading === request.id} onClick={() => updateReviewRequestStatus(request.id, 'issued')} className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">{actionLoading === request.id ? 'Working...' : 'Mark as Issued'}</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Matches Tab */}
            {activeTab === 'matches' && (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900">Match ID: {String(match.id).slice(0, 8)}</h4>
                        <p className="text-sm text-gray-600">Score: {match.match_score}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${match.status === 'approved' ? 'bg-green-100 text-green-800' : match.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{match.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{message.name}</h4>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{message.message_type}</span>
                        </div>
                        <p className="text-sm text-gray-600">{message.email}</p>
                        <p className="text-sm text-gray-800 mt-2">{message.message}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${message.status === 'resolved' ? 'bg-green-100 text-green-800' : message.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{message.status}</span>
                    </div>

                    <div className="flex space-x-2">
                      {message.status === 'new' && (
                        <button disabled={actionLoading === message.id} onClick={() => updateMessageStatus(message.id, 'in_progress')} className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700">{actionLoading === message.id ? 'Working...' : 'Start Processing'}</button>
                      )}
                      {message.status === 'in_progress' && (
                        <button disabled={actionLoading === message.id} onClick={() => updateMessageStatus(message.id, 'resolved')} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">{actionLoading === message.id ? 'Working...' : 'Mark as Resolved'}</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
