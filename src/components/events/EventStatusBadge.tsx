'use client';

import * as React from 'react';
import { cn } from '@/src/lib/utils';
import type { EventStatus } from '@/src/lib/types';

interface EventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

const STATUS_CONFIG: Record<EventStatus, { label: string; className: string }> = {
  active: {
    label: 'Activo',
    className: 'bg-green-100 text-green-800',
  },
  inactive: {
    label: 'Inactivo',
    className: 'bg-slate-100 text-slate-600',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-800',
  },
};

export default function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
