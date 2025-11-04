'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import eventService from '@/src/services/eventService';
import type { Event, TicketType } from '@/src/lib/types';
import useRequireAuth from '@/src/hooks/useRequireAuth';

export default function EventDetailPage() {
  const { eventId } = useParams();
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();

  const [event, setEvent] = React.useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = React.useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated && typeof eventId === 'string') {
      const fetchEventData = async () => {
        try {
          setIsLoading(true);
          const [eventData, ticketTypesData] = await Promise.all([
            eventService.getEventById(eventId as string),
            eventService.getTicketTypes(eventId as string),
          ]);
          setEvent(eventData);
          setTicketTypes(ticketTypesData);
        } catch (err) {
          setError(
            'Error al cargar los detalles del evento. Por favor, intenta de nuevo más tarde.'
          );
          toast.error('Error al cargar los detalles del evento.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchEventData();
    }
  }, [eventId, isAuthenticated]);

  if (isLoading || authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Cargando detalles del evento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Evento no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Event Header */}
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{event.title}</h1>
              <p className="mt-2 text-lg text-gray-600">{event.description}</p>
            </div>
          </div>

          {/* Event Details & Venue */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="mb-4 text-xl font-semibold text-gray-800">Detalles del Evento</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <dt className="text-sm font-medium text-gray-500">Fecha</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(event.date).toLocaleString('es-ES', {
                            dateStyle: 'full',
                            timeStyle: 'short',
                          })}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
                      </div>
                      <div className="ml-3">
                        <dt className="text-sm font-medium text-gray-500">Lugar</dt>
                        <dd className="mt-1 text-sm text-gray-900">{event.venue.name}</dd>
                        <dd className="mt-1 text-sm text-gray-600">{event.venue.address}</dd>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <dt className="text-sm font-medium text-gray-500">Categoría</dt>
                        <dd className="mt-1 text-sm text-gray-900">{event.category.name}</dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Types */}
            <div className="md:col-span-1">
              <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="mb-4 text-xl font-semibold text-gray-800">Tickets</h2>
                  {ticketTypes.length > 0 ? (
                    <ul className="space-y-4">
                      {ticketTypes.map((ticket) => (
                        <li
                          key={ticket.id}
                          className="rounded-lg border p-4 transition hover:bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-800">{ticket.name}</p>
                              <p className="text-sm text-gray-600">{ticket.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                {new Intl.NumberFormat('es-CO', {
                                  style: 'currency',
                                  currency: 'COP',
                                }).format(ticket.price)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Disponibles: {ticket.quantity}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No hay tickets disponibles para este evento.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
