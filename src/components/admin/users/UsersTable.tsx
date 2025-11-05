'use client';

import React from 'react';
import type { User, Role } from '@/src/lib/types';
import Button from '@/src/components/ui/Button';
import { Can } from '@/src/components/auth/Can';
import { formatDate } from '@/src/lib/utils';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const safeUsers = Array.isArray(users) ? users : [];

  const formatRoles = (roles: Role[] | undefined) => {
    if (!roles || roles.length === 0) {
      return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
          Sin roles
        </span>
      );
    }
    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role) => (
          <span
            key={role.id}
            className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-600/20 ring-inset"
          >
            {role.name}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
              >
                Usuario
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
              >
                Roles
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
              >
                Registro
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium tracking-wider text-slate-500 uppercase"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {safeUsers.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-slate-50/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 font-medium text-slate-600">
                      {user.firstName.charAt(0).toUpperCase()}
                      {user.lastName.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-slate-900">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{formatRoles(user.roles)}</td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                  <div className="flex justify-end gap-2">
                    <Can permission="UPDATE_USER">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
                        Editar
                      </Button>
                    </Can>
                    <Can permission="DELETE_USER">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(user)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        Eliminar
                      </Button>
                    </Can>
                  </div>
                </td>
              </tr>
            ))}
            {safeUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="mb-2 h-10 w-10 text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p>No se encontraron usuarios.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
