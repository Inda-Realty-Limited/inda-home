import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MarketingService } from '@/api/marketing';

type CanvaCallbackState = 'connecting' | 'success' | 'error';

export default function CanvaCallbackPage() {
  const router = useRouter();
  const [state, setState] = useState<CanvaCallbackState>('connecting');
  const [message, setMessage] = useState('Connecting your Canva account...');

  useEffect(() => {
    if (!router.isReady) return;

    const code = typeof router.query.code === 'string' ? router.query.code : '';
    const error = typeof router.query.error === 'string' ? router.query.error : '';

    if (error) {
      setState('error');
      setMessage('Canva authorization was not completed.');
      return;
    }

    if (!code) {
      setState('error');
      setMessage('Missing Canva authorization code.');
      return;
    }

    const state = typeof router.query.state === 'string' ? router.query.state : '';
    if (!state) {
      setState('error');
      setMessage('Missing Canva authorization state.');
      return;
    }

    const run = async () => {
      try {
        const redirectUri = `${window.location.origin}/marketing/canva/callback`;
        await MarketingService.exchangeCanvaCode({
          code,
          state,
          redirectUri,
        });
        setState('success');
        setMessage('Canva connected. Returning to email templates...');

        window.setTimeout(() => {
          void router.replace('/marketing?step=email&canva=connected');
        }, 700);
      } catch (callbackError) {
        setState('error');
        setMessage(
          callbackError instanceof Error
            ? callbackError.message
            : 'Failed to connect Canva.',
        );
      }
    };

    void run();
  }, [router, router.isReady, router.query.code, router.query.error, router.query.state]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-16">
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-[#4ea8a1]/10 text-[#4ea8a1] flex items-center justify-center mx-auto mb-4 text-2xl">
              {state === 'success' ? '✓' : state === 'error' ? '!' : '…'}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {state === 'success'
                ? 'Canva Connected'
                : state === 'error'
                  ? 'Canva Connection Failed'
                  : 'Connecting Canva'}
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            {state === 'error' ? (
              <button
                onClick={() => router.push('/marketing?step=email')}
                className="bg-[#4ea8a1] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#3d8780]"
              >
                Back to Marketing
              </button>
            ) : null}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
