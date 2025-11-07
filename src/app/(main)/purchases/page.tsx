'use client';

/**
 * Purchase Page (Redirect)
 * Redirects to purchase history
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PurchasePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to history page
    router.replace('/purchases/history');
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    </div>
  );
}
