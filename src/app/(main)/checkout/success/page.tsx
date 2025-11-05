'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { showToast } from '@/src/lib/toast';
import Button from '@/src/components/ui/Button';

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentId = searchParams.get('payment_id');
  const preferenceId = searchParams.get('preference_id');
  const status = searchParams.get('status');

  React.useEffect(() => {
    showToast.success('Pago procesado exitosamente!');
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-16 w-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-3xl font-bold text-slate-900">¡Pago Exitoso!</h1>
          <p className="mb-6 text-slate-600">
            Tu compra ha sido procesada correctamente. Los tickets electrónicos se han generado y
            están disponibles en tu historial de compras.
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

export default function CheckoutSuccessPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-slate-500">Cargando resultado...</p>
        </div>
      }
    >
      <SuccessPageContent />
    </React.Suspense>
  );
}
