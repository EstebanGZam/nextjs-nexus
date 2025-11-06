'use client';

import * as React from 'react';
import type { Role, Permission } from '@/src/lib/types';

type Props = {
  role: Role;
  // Catálogo de permisos para mapear ids -> nombres
  permissionCatalog: Permission[];
};

// Para soportar opcionalmente roles con `permissions: { name }[]` embebidos
type MaybeEmbeddedPermissions = {
  permissions?: Array<{ name: string }>;
};

export default function RoleReadOnlyModal({ role, permissionCatalog }: Props) {
  // Map id -> name
  const idToName = React.useMemo(() => {
    const m = new Map<string, string>();
    for (const p of permissionCatalog) m.set(p.id, p.name);
    return m;
  }, [permissionCatalog]);

  // Nombres desde arreglo embebido (si existiera)
  const embedded = (role as MaybeEmbeddedPermissions).permissions;
  const namesFromEmbedded: string[] = Array.isArray(embedded)
    ? embedded.map((p: { name: string }) => p.name)
    : [];

  // Nombres por ids
  const ids: string[] = Array.isArray(role.permissionIds) ? role.permissionIds : [];
  const namesFromIds: string[] = ids.map((id: string) => idToName.get(id) ?? id);

  // Prioriza embebidos si vienen, si no, por ids
  const names: string[] = namesFromEmbedded.length > 0 ? namesFromEmbedded : namesFromIds;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium text-slate-700">Nombre</div>
        <div className="text-slate-900">{role.name}</div>
      </div>

      {role.description && (
        <div>
          <div className="text-sm font-medium text-slate-700">Descripción</div>
          <div className="text-slate-900">{role.description}</div>
        </div>
      )}

      <div>
        <div className="mb-1 text-sm font-medium text-slate-700">Permisos ({names.length})</div>
        <ul className="list-disc pl-5 text-slate-900">
          {names.map((n: string, idx: number) => (
            <li key={`${n}-${idx}`}>{n}</li>
          ))}
          {names.length === 0 && <li className="list-none text-slate-500">Sin permisos</li>}
        </ul>
      </div>
    </div>
  );
}
