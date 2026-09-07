import type { ReactNode } from 'react';
import { DButton } from '../button';
import { DDialog } from '../dialog';
import { useDLocalization } from '../localization';

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

export function DConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel, cancelLabel, variant = 'danger', loading = false }: ConfirmDialogProps) {
  const { t } = useDLocalization();
  return <DDialog open={open} onClose={onClose} title={title ?? t('confirmDialog.title')} size="sm" footer={<div className="flex justify-end gap-2"><DButton variant="outline" onClick={onClose} disabled={loading}>{cancelLabel ?? t('confirmDialog.cancel')}</DButton><DButton variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel ?? t('confirmDialog.confirm')}</DButton></div>}><p className="text-sm text-[var(--color-text-muted)]">{message ?? t('confirmDialog.message')}</p></DDialog>;
}
