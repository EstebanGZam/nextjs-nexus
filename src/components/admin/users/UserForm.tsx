'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm, type SubmitHandler, type DefaultValues } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import type { User, Role, UpdateUserDto } from '@/src/lib/types';
import userService from '@/src/services/userService';
import roleService from '@/src/services/roleService';
import Button from '@/src/components/ui/Button';
import FormError from '@/src/components/ui/FormError';

interface UserFormProps {
  userToEdit?: User | null;
  onSuccess: () => void;
}

const FormSchema = z.object({
  firstName: z.string().min(1, 'Requerido'),
  lastName: z.string().min(1, 'Requerido'),
  email: z.string().email('Email inválido'),
  roleIds: z.array(z.string().min(1)).min(1, 'El usuario debe tener al menos 1 rol'),
});

type FormValues = z.infer<typeof FormSchema>;

function deriveInitialRoleIds(user: unknown): string[] {
  const u = user as { roleIds?: unknown; roles?: unknown } | null | undefined;
  if (!u) return [];
  if (Array.isArray(u.roleIds)) {
    return (u.roleIds as unknown[]).filter((x): x is string => typeof x === 'string');
  }
  if (Array.isArray(u.roles)) {
    const raw = u.roles as unknown[];
    const asStrings = raw.filter((x): x is string => typeof x === 'string');
    if (asStrings.length) return asStrings;
    return raw
      .map((r) => {
        const id = (r as { id?: unknown })?.id;
        return typeof id === 'string' ? id : undefined;
      })
      .filter((x): x is string => Boolean(x));
  }
  return [];
}

function hasDataArray<T>(v: unknown): v is { data: T[] } {
  return !!v && typeof v === 'object' && Array.isArray((v as { data?: unknown }).data);
}
function asRoles(resp: unknown): Role[] {
  if (Array.isArray(resp)) return resp as Role[];
  if (hasDataArray<Role>(resp)) return (resp as { data: Role[] }).data;
  return [];
}
function extractErrorMessage(err: unknown): string {
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object') {
    const resp = (err as { response?: { data?: unknown } }).response;
    const msg = (resp?.data as { message?: unknown } | undefined)?.message;
    if (Array.isArray(msg)) return (msg as unknown[]).map(String).join(', ');
    if (typeof msg === 'string') return msg;
    const m = (err as { message?: unknown }).message;
    if (typeof m === 'string') return m;
  }
  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
}

export default function UserForm({ userToEdit, onSuccess }: UserFormProps) {
  const isEditMode = Boolean(userToEdit);

  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const defaultValues: DefaultValues<FormValues> = {
    firstName: userToEdit?.firstName ?? '',
    lastName: userToEdit?.lastName ?? '',
    email: userToEdit?.email ?? '',
    roleIds: deriveInitialRoleIds(userToEdit),
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset({
      firstName: userToEdit?.firstName ?? '',
      lastName: userToEdit?.lastName ?? '',
      email: userToEdit?.email ?? '',
      roleIds: deriveInitialRoleIds(userToEdit),
    });
  }, [userToEdit, reset]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const resp = await roleService.getRoles({ page: 1, limit: 200 });
        setAllRoles(asRoles(resp));
      } catch (error: unknown) {
        console.error('Failed to fetch roles:', error);
        setAllRoles([]);
        setFormError('No se pudieron cargar los roles.');
      }
    };
    fetchRoles();
  }, []);

  const roleIdsWatched = watch('roleIds');
  const assignedIds = useMemo(() => roleIdsWatched ?? [], [roleIdsWatched]);

  const assignedSet = useMemo(() => new Set(assignedIds), [assignedIds]);

  const availableRoles = useMemo(
    () => allRoles.filter((r) => !assignedSet.has(r.id)),
    [allRoles, assignedSet]
  );
  const assignedRoles = useMemo(
    () => allRoles.filter((r) => assignedSet.has(r.id)),
    [allRoles, assignedSet]
  );

  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([]);
  const [selectedAssigned, setSelectedAssigned] = useState<string[]>([]);

  const moveRight = () => {
    if (!selectedAvailable.length) return;
    const merged = Array.from(new Set([...assignedIds, ...selectedAvailable]));
    setValue('roleIds', merged, { shouldDirty: true, shouldValidate: true });
    setSelectedAvailable([]);
  };

  const moveAllRight = () => {
    if (!availableRoles.length) return;
    const allAvailIds = availableRoles.map((r) => r.id);
    const merged = Array.from(new Set([...assignedIds, ...allAvailIds]));
    setValue('roleIds', merged, { shouldDirty: true, shouldValidate: true });
    setSelectedAvailable([]);
  };

  const moveLeft = () => {
    if (!selectedAssigned.length) return;
    const remaining = assignedIds.filter((id) => !selectedAssigned.includes(id));
    if (remaining.length < 1) {
      setError('roleIds', { type: 'manual', message: 'Debe quedar al menos 1 rol asignado' });
      return;
    }
    setValue('roleIds', remaining, { shouldDirty: true, shouldValidate: true });
    setSelectedAssigned([]);
  };

  const moveAllLeft = () => {
    if (assignedIds.length <= 1) {
      setError('roleIds', { type: 'manual', message: 'Debe quedar al menos 1 rol asignado' });
      return;
    }
    setValue('roleIds', [assignedIds[0]], { shouldDirty: true, shouldValidate: true });
    setSelectedAssigned([]);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setFormError(null);

    try {
      if (!data.roleIds || data.roleIds.length < 1) {
        setError('roleIds', { type: 'manual', message: 'El usuario debe tener al menos 1 rol' });
        setIsLoading(false);
        return;
      }

      if (isEditMode && userToEdit) {
        const updateData: UpdateUserDto = { roleIds: data.roleIds };
        await userService.updateUser(userToEdit.id, updateData);
      }

      onSuccess();
    } catch (error: unknown) {
      console.error('Form submission error:', error);
      setFormError(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle =
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm';
  const labelStyle = 'block text-sm font-medium text-gray-700';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {formError && <FormError message={formError} />}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelStyle}>
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            {...register('firstName')}
            className={inputStyle}
            disabled
            readOnly
            aria-invalid={Boolean(errors.firstName)}
          />
          {errors.firstName && <FormError message={String(errors.firstName.message)} />}
        </div>

        <div>
          <label htmlFor="lastName" className={labelStyle}>
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            {...register('lastName')}
            className={inputStyle}
            disabled
            readOnly
            aria-invalid={Boolean(errors.lastName)}
          />
          {errors.lastName && <FormError message={String(errors.lastName.message)} />}
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelStyle}>
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={inputStyle}
          disabled
          readOnly
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <FormError message={String(errors.email.message)} />}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className={labelStyle}>Roles</label>
          <span className="text-xs text-gray-500">
            Asignados: {assignedRoles.length} / {allRoles.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div>
            <div className="mb-1 text-xs font-medium text-slate-600">Disponibles</div>
            <select
              multiple
              className={`${inputStyle} h-40`}
              value={selectedAvailable}
              onChange={(e) =>
                setSelectedAvailable(Array.from(e.target.selectedOptions).map((o) => o.value))
              }
            >
              {availableRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <button
              type="button"
              onClick={moveRight}
              className="rounded-md border px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-50"
              disabled={isLoading || isSubmitting || selectedAvailable.length === 0}
              aria-label="Asignar seleccionados"
              title="Asignar seleccionados"
            >
              &gt;
            </button>
            <button
              type="button"
              onClick={moveAllRight}
              className="rounded-md border px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-50"
              disabled={isLoading || isSubmitting || availableRoles.length === 0}
              aria-label="Asignar todos"
              title="Asignar todos"
            >
              &gt;&gt;
            </button>
            <button
              type="button"
              onClick={moveLeft}
              className="rounded-md border px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-50"
              disabled={
                isLoading ||
                isSubmitting ||
                selectedAssigned.length === 0 ||
                assignedRoles.length <= 1
              }
              aria-label="Quitar seleccionados"
              title="Quitar seleccionados"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={moveAllLeft}
              className="rounded-md border px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-50"
              disabled={isLoading || isSubmitting || assignedRoles.length <= 1}
              aria-label="Quitar todos salvo uno"
              title="Quitar todos salvo uno"
            >
              &lt;&lt;
            </button>
          </div>

          <div>
            <div className="mb-1 text-xs font-medium text-slate-600">Asignados</div>
            <select
              multiple
              className={`${inputStyle} h-40`}
              value={selectedAssigned}
              onChange={(e) =>
                setSelectedAssigned(Array.from(e.target.selectedOptions).map((o) => o.value))
              }
            >
              {assignedRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-1 text-xs text-gray-500">
          Siempre debe quedar al menos 1 rol en “Asignados”. Usa Ctrl o Cmd para selección múltiple.
        </p>
        {errors.roleIds && <FormError message={String(errors.roleIds.message)} />}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || isSubmitting}>
          {isLoading || isSubmitting ? 'Guardando...' : 'Update User'}
        </Button>
      </div>
    </form>
  );
}
