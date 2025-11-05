/**
 * Cart Item Component
 * Displays a single item in the shopping cart
 */

import type { CartItem as CartItemType } from '@/src/lib/types';
import { useCartStore } from '@/src/stores/useCartStore';
import { showToast } from '@/src/lib/toast';
import { useState } from 'react';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateItemQuantity, removeItem } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsUpdating(true);
    try {
      await updateItemQuantity(item.id, newQuantity);
      showToast.success('Cantidad actualizada');
    } catch {
      showToast.error('Error al actualizar cantidad');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItem(item.id);
      showToast.success('Item eliminado del carrito');
    } catch {
      showToast.error('Error al eliminar item');
    } finally {
      setIsUpdating(false);
    }
  };

  const unitPrice = Number(item.unitPrice);
  const subtotal = Number(item.subtotal);

  return (
    <div className="flex items-center gap-4 border-b border-slate-200 py-4 last:border-b-0">
      {/* Item info */}
      <div className="flex-1">
        <h4 className="font-semibold text-slate-900">{item.ticketType.name}</h4>
        {item.ticketType.description && (
          <p className="text-sm text-slate-600">{item.ticketType.description}</p>
        )}
        <p className="mt-1 text-sm text-slate-500">${unitPrice.toFixed(2)} c/u</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          -
        </button>
        <span className="w-8 text-center font-medium text-slate-900">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating || item.quantity >= item.ticketType.quantity}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="w-24 text-right">
        <p className="font-bold text-slate-900">${subtotal.toFixed(2)}</p>
      </div>

      {/* Remove button */}
      <button
        onClick={handleRemove}
        disabled={isUpdating}
        className="text-red-600 transition-colors hover:text-red-700 disabled:opacity-50"
        title="Eliminar"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
