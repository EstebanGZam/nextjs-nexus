'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { showToast } from '@/src/lib/toast';
import Button from '@/src/components/ui/Button';

function PendingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentId = searchParams.get('payment_id');
  const preferenceId = searchParams.get('preference_id');
  const status = searchParams.get('status');

  React.useEffect(() => {
    showToast.info('Pago pendiente de confirmación');
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">
            <svg
              className="h-16 w-16 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-3xl font-bold text-slate-900">Pago Pendiente</h1>
          <p className="mb-6 text-slate-600">
            Tu pago está siendo procesado. Te notificaremos por correo cuando se confirme. Esto
            puede tomar unos minutos.
          </p>

          {(paymentId || preferenceId || status) && (
            <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left">
              <h3 className="mb-2 text-sm font-semibold text-slate-700">Detalles del pago:</h3>
              {paymentId && (
                <p className="text-sm text-slate-600">
                  <span className="font-medium">ID de pago:</span> {paymentId}
                </p>
              )}
              {status && (
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Estado:</span> {status}
                </p>
              )}
            </div>
          )}

          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              Puedes revisar el estado de tu compra en tu historial de compras. Si el pago es
              confirmado, los tickets se generarán automáticamente.
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={() => router.push('/purchases/history')} fullWidth>
              Ver mis compras
            </Button>
            <Button onClick={() => router.push('/events')} variant="secondary" fullWidth>
              Volver a eventos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPendingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-slate-500">Cargando resultado...</p>
        </div>
      }
    >
      <PendingPageContent />
    </React.Suspense>
  );
}
