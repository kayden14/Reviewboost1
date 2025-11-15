// src/pages/Confirm.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Confirm() {
  const [status, setStatus] = useState('Verifying...');
  const [error, setError] = useState('');

  useEffect(() => {
    // Get access_token and refresh_token from URL
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!accessToken) {
      setError('Invalid verification link');
      setStatus('');
      return;
    }

    const confirmEmail = async () => {
      try {
        // Set session from access_token and refresh_token (refresh_token may be absent)
        const { error } = await supabase.auth.setSession({
          access_token: accessToken!,
          refresh_token: refreshToken ?? '',
        });
        if (error) throw error;

        setStatus('Email verified successfully! 🎉 Redirecting...');
        setTimeout(() => {
          window.location.href = '/signin'; // redirect after 3s
        }, 3000);
      } catch (err: any) {
        setError(err.message || 'Failed to verify email.');
        setStatus('');
      }
    };

    confirmEmail();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center">
        {status && <h1 className="text-xl font-semibold text-teal-600">{status}</h1>}
        {error && <h1 className="text-red-600 font-medium">{error}</h1>}
      </div>
    </div>
  );
}
