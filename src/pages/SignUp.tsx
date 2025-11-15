import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail } from 'lucide-react';

type SignUpProps = { onNavigate: (page: string) => void };

export default function SignUp({ onNavigate }: SignUpProps) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'freelancer' | 'admin'>('freelancer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(email, password, fullName, role);
      setEmailSent(true);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-teal-50 to-emerald-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4 mx-auto">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join ReviewBoost</h1>

        {!emailSent ? (
          <>
            <p className="text-gray-600 mb-6">Create your account to get started</p>
            {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-3 border rounded-lg" />
              <select value={role} onChange={(e) => setRole(e.target.value as 'freelancer' | 'admin')} className="w-full px-4 py-3 border rounded-lg">
                <option value="freelancer">Freelancer</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            <p className="mt-6 text-sm">
              Already have an account? <button onClick={() => onNavigate('signin')} className="text-teal-600">Sign in</button>
            </p>
          </>
        ) : (
          <div className="space-y-4">
            <Mail className="w-12 h-12 text-teal-500 mx-auto" />
            <h2 className="text-xl font-semibold text-teal-600">Check your email 🎉</h2>
            <p className="text-gray-600">We sent a verification link to <strong>{email}</strong>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
