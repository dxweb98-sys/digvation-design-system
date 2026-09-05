import type { ReactNode } from 'react';
import { DButton } from '../button';
import { DDialog } from '../dialog';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: ReactNode;
  message?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export function DConfirmDialog({ open, onClose, onConfirm, title = 'Konfirmasi', message = 'Apakah Anda yakin ingin melakukan aksi ini?', confirmLabel = 'Ya, Lanjutkan', cancelLabel = 'Batal', variant = 'danger', loading = false }: ConfirmDialogProps) {
  return <DDialog open={open} onClose={onClose} title={title} size="sm" footer={<div className="flex justify-end gap-2"><DButton variant="outline" onClick={onClose} disabled={loading}>{cancelLabel}</DButton><DButton variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</DButton></div>}><p className="text-sm text-[var(--color-text-muted)]">{message}</p></DDialog>;
}
