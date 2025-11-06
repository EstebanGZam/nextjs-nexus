'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Role, Permission } from '@/src/lib/types';
import Button from '@/src/components/ui/Button';
import permissionService from '@/src/services/permissionService';

type RolesTableProps = {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
};

type PermById = Record<string, Permission>;

// Fallback por nombre si el backend no envía isGeneric
const GENERIC_ROLE_NAMES = new Set(['ADMINISTRATOR', 'BUYER', 'ORGANIZER', 'STAFF']);
function isGenericRole(role: Role): boolean {
  const flag = (role as unknown as { isGeneric?: boolean }).isGeneric;
  if (typeof flag === 'boolean') return flag;
  return GENERIC_ROLE_NAMES.has((role.name ?? '').toUpperCase());
}

export default function RolesTable({ roles, onEdit, onDelete }: RolesTableProps) {
  const safeRoles = useMemo<Role[]>(() => (Array.isArray(roles) ? roles : []), [roles]);

  // Catálogo de permisos para mostrar nombres bonitos
  const [permById, setPermById] = useState<PermById>({});

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const resp = await permissionService.getPermissions({ page: 1, limit: 1000 });
        const maybe = resp as unknown;
        let list: Permission[] = [];
        if (Array.isArray(maybe)) list = maybe as Permission[];
        else if (
          typeof maybe === 'object' &&
          maybe !== null &&
          Array.isArray((maybe as { data?: unknown }).data)
        ) {
          list = (maybe as { data: Permission[] }).data;
        }
        if (!cancelled) {
          const map: PermById = {};
          list.forEach((p) => {
            map[p.id] = p;
          });
          setPermById(map);
        }
      } catch {
        // sin catálogo no rompemos la UI
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const Pill: React.FC<{ label: string }> = ({ label }) => (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-600/20 ring-inset">
      {label}
    </span>
  );

  const MutedPill: React.FC<{ label: string }> = ({ label }) => (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
      {label}
    </span>
  );

  const renderPermissions = (permissionIds?: string[]) => {
    const ids = Array.isArray(permissionIds) ? permissionIds : [];
    if (!ids.length) return <MutedPill label="Sin permisos" />;
    const names = ids
      .map((id) => permById[id]?.name)
      .filter((n): n is string => typeof n === 'string' && n.length > 0);

    if (!names.length) return <MutedPill label={`(${ids.length})`} />;
    return (
      <div className="flex flex-wrap gap-1">
        {names.map((n) => (
          <Pill key={n} label={n} />
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
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                Permisos
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-slate-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {safeRoles.map((role) => {
              const generic = isGenericRole(role);
              return (
                <tr key={role.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{role.name}</div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {role.description || <span className="text-slate-400">—</span>}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {renderPermissions(role.permissionIds)}
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(role)}
                        disabled={generic}
                        className={generic ? 'cursor-not-allowed opacity-40' : ''}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(role)}
                        disabled={generic}
                        className={
                          generic
                            ? 'cursor-not-allowed opacity-40'
                            : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                        }
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {safeRoles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                  No hay roles para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
