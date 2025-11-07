'use client';

import * as React from 'react';
import { cn } from '@/src/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = React.useMemo(() => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Anterior
      </button>

      {pages.map((page, idx) =>
        typeof page === 'number' ? (
          <button
            key={idx}
            onClick={() => onPageChange(page)}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              page === currentPage ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            {page}
          </button>
        ) : (
          <span key={idx} className="px-2 text-slate-400">
            {page}
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}
