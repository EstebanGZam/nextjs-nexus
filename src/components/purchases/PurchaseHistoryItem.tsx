/**
 * Purchase History Item Component
 * Displays a single purchase in the history list
 */

import Link from 'next/link';
import type { Purchase } from '@/src/lib/types';

interface PurchaseHistoryItemProps {
  purchase: Purchase;
}

export default function PurchaseHistoryItem({ purchase }: PurchaseHistoryItemProps) {
  const totalAmount = Number(purchase.totalAmount);

  // Format date
  const purchaseDate = new Date(purchase.purchaseDate);
  const formattedDate = purchaseDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = purchaseDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Status colors
  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    FAILED: 'bg-red-100 text-red-800 border-red-200',
  };

  // Status labels
  const statusLabels: Record<string, string> = {
    PENDING: 'Pendiente',
    COMPLETED: 'Completada',
    CANCELLED: 'Cancelada',
    FAILED: 'Fallida',
  };

  return (
    <Link href={`/purchases/${purchase.id}`}>
      <div className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold text-gray-900 group-hover:text-blue-600">
              {purchase.event.title}
            </h3>
            <p className="text-sm text-gray-500">
              {formattedDate} a las {formattedTime}
            </p>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[purchase.status] || 'border-gray-200 bg-gray-100 text-gray-800'}`}
          >
            {statusLabels[purchase.status] || purchase.status}
          </span>
        </div>

        {/* Event details */}
        {purchase.event.venue && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{purchase.event.venue.name}</span>
          </div>
        )}

        {/* Ticket count and total */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            <span>
              {purchase.tickets.length} {purchase.tickets.length === 1 ? 'ticket' : 'tickets'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* View details link */}
        <div className="mt-4 flex items-center justify-end text-sm font-medium text-blue-600 group-hover:text-blue-700">
          Ver detalles
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
