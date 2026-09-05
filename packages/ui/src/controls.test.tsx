import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { DCombobox } from './combobox';
import { DInput } from './input';
import { DSelect } from './select';
import { DDataTable, getPaginationPages } from './data-table';

afterEach(cleanup);

describe('shared field controls', () => {
  it('keeps a controlled input mounted and focused as clear affordance appears', () => {
    function ControlledInput() {
      const [value, setValue] = useState('');
      return (
        <DInput
          aria-label="Name"
          value={value}
          clearable
          onClear={() => setValue('')}
          onNativeChange={(event) => setValue(event.target.value)}
        />
      );
    }

    render(<ControlledInput />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    act(() => input.focus());
    fireEvent.change(input, { target: { value: 'Alya' } });
    expect(document.activeElement).toBe(input);
    expect((input as HTMLInputElement).value).toBe('Alya');
  });

  it('uses a custom select panel and reports the selected controlled value', () => {
    function ControlledSelect() {
      const [value, setValue] = useState('CASH');
      return (
        <DSelect aria-label="Payment method" value={value} onValueChange={(next) => setValue(String(next ?? ''))}>
          <option value="CASH">Cash</option>
          <option value="QRIS">QRIS</option>
        </DSelect>
      );
    }

    render(<ControlledSelect />);
    const trigger = screen.getByRole('button', { name: 'Payment method' });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(trigger.textContent).toContain('QRIS');
  });

  it('reopens DSelect with the selected option as the only persistent highlight', () => {
    function ControlledSelect() {
      const [value, setValue] = useState<string | number | null>('active');
      return (
        <DSelect
          aria-label="Status"
          value={value}
          onChange={setValue}
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Draft', value: 'draft' },
            { label: 'Archived', value: 'archived' },
          ]}
        />
      );
    }

    render(<ControlledSelect />);
    const trigger = screen.getByRole('button', { name: 'Status' });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('option', { name: 'Draft' }));
    fireEvent.click(trigger);

    const active = screen.getByRole('option', { name: 'Active' });
    const draft = screen.getByRole('option', { name: 'Draft' });
    expect(draft.getAttribute('aria-selected')).toBe('true');
    expect(draft.className.split(/\s+/)).toContain('bg-[var(--color-brand)]/10');
    expect(active.getAttribute('aria-selected')).toBe('false');
    expect(active.className.split(/\s+/)).not.toContain('bg-[var(--color-surface-muted)]');
  });

  it('filters and selects a combobox option without losing text focus', () => {
    function ControlledCombobox() {
      const [value, setValue] = useState('');
      return (
        <DCombobox
          ariaLabel="Employee"
          value={value}
          onChange={(next) => setValue(String(next ?? ''))}
          options={[
            { value: 'ari', label: 'Ari' },
            { value: 'bima', label: 'Bima' },
          ]}
        />
      );
    }

    render(<ControlledCombobox />);
    const input = screen.getByRole('combobox', { name: 'Employee' });
    act(() => input.focus());
    fireEvent.change(input, { target: { value: 'bim' } });
    expect(document.activeElement).toBe(input);
    fireEvent.click(screen.getByRole('option', { name: 'Bima' }));
    expect((input as HTMLInputElement).value).toBe('Bima');
  });

  it('renders table pagination and reports generic page changes', () => {
    const pages: number[] = [];
    render(
      <DDataTable
        columns={[{ key: 'name', label: 'Name', render: (row: { name: string }) => row.name }]}
        data={[{ name: 'Alya' }]}
        rowKey={(row) => row.name}
        pagination={{ page: 2, pageSize: 10, total: 60 }}
        onPageChange={(page) => pages.push(page)}
      />,
    );
    expect(screen.getByRole('cell', { name: 'Alya' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(pages).toEqual([3]);
    expect(getPaginationPages(6, 10)).toEqual([4, 5, 6, 7, 8]);
  });
});
