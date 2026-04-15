import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MarketingService } from '@/api/marketing';
import { verifyAuthenticatedPayment } from '@/api/payments';

type CheckoutState = 'verifying' | 'processing' | 'success' | 'error';

type PendingMarketingCheckout =
  | {
      type: 'booking';
      payload: {
        serviceType: 'PHOTOGRAPHY' | 'VIDEOGRAPHY' | 'TOUR_3D';
        packageId: string;
        propertyAddress: string;
        propertyType: string;
        contactName: string;
        contactPhone: string;
        date: string;
        time: string;
        specialRequests?: string;
      };
    }
  | {
      type: 'ad-campaign';
      payload: {
        platforms: string[];
        objective: string;
        budget: number;
        durationDays: number;
        startDate?: string;
        targeting: {
          locations?: string[];
          ageRanges?: string[];
          incomeLevel?: string[];
          interests?: string[];
        };
      };
    };

export default function MarketingCheckoutPage() {
  const router = useRouter();
  const [state, setState] = useState<CheckoutState>('verifying');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    if (!router.isReady) return;

    const reference =
      (router.query.reference as string) ||
      (router.query.tx_ref as string) ||
      (router.query.txRef as string) ||
      '';

    if (!reference) {
      setState('error');
      setMessage('Missing payment reference.');
      return;
    }

    const run = async () => {
      try {
        await verifyAuthenticatedPayment(reference, 'FLUTTERWAVE');
        setState('processing');
        setMessage('Finalizing your marketing order...');

        const raw = typeof window !== 'undefined'
          ? sessionStorage.getItem('inda_marketing_checkout')
          : null;

        if (!raw) {
          throw new Error('No pending marketing checkout found.');
        }

        const pending = JSON.parse(raw) as PendingMarketingCheckout;

        if (pending.type === 'booking') {
          await MarketingService.createBooking({
            ...pending.payload,
            paymentMethod: 'CARD',
          });
        } else if (pending.type === 'ad-campaign') {
          await MarketingService.createAdCampaign({
            ...pending.payload,
            paymentMethod: 'CARD',
          });
        }

        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('inda_marketing_checkout');
        }

        setState('success');
        setMessage('Payment verified and marketing order confirmed.');
      } catch (error) {
        setState('error');
        setMessage(
          error instanceof Error
            ? error.message
            : 'Unable to complete marketing checkout.',
        );
      }
    };

    void run();
  }, [router.isReady, router.query.reference, router.query.tx_ref, router.query.txRef]);

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
                ? 'Marketing Checkout Complete'
                : state === 'error'
                  ? 'Marketing Checkout Failed'
                  : 'Processing Payment'}
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => router.push('/marketing')}
              className="bg-[#4ea8a1] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#3d8780]"
            >
              Back to Marketing
            </button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
