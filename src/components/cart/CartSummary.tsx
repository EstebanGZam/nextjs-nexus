/**
 * Cart Summary Component
 * Displays cart total and checkout actions
 */

import type { Cart } from '@/src/lib/types';
import { useCartStore } from '@/src/stores/useCartStore';
import { showToast } from '@/src/lib/toast';
import { useState } from 'react';

interface CartSummaryProps {
  cart: Cart;
}

export default function CartSummary({ cart }: CartSummaryProps) {
  const { checkoutMercadoPago } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = Number(cart.totalAmount);

  const handleMercadoPagoCheckout = async () => {
    setIsProcessing(true);
    try {
      const preference = await checkoutMercadoPago(cart.id);
      showToast.success('Redirigiendo a MercadoPago...');
      // Redirect to MercadoPago checkout
      // Use sandboxInitPoint for testing, initPoint for production
      const checkoutUrl = preference.sandboxInitPoint || preference.initPoint;
      window.location.href = checkoutUrl;
    } catch {
      showToast.error('Error al crear preferencia de pago');
      setIsProcessing(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-900">Resumen del pedido</h3>

      {/* Event info */}
      <div className="mb-4 rounded-md bg-slate-50 p-3">
        <p className="text-sm font-medium text-slate-700">Evento</p>
        <p className="text-base font-semibold text-slate-900">{cart.event.title}</p>
      </div>

      {/* Items count */}
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-600">Items</span>
        <span className="font-medium text-slate-900">
          {cart.items.reduce((sum, item) => sum + item.quantity, 0)} tickets
        </span>
      </div>

      {/* Total */}
      <div className="mb-6 flex justify-between border-t border-slate-200 pt-4">
        <span className="text-lg font-bold text-slate-900">Total</span>
        <span className="text-2xl font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
      </div>

      {/* Checkout buttons */}
      <div className="space-y-3">
        <button
          onClick={handleMercadoPagoCheckout}
          disabled={isProcessing || cart.items.length === 0}
          className="w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? 'Procesando...' : 'Proceder al pago'}
        </button>
      </div>

      {/* Info text */}
      <p className="mt-4 text-xs text-slate-500">
        Al finalizar la compra, se generaran tus tickets electronicos.
      </p>
    </div>
  );
}
