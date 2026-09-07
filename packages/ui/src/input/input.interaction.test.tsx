import { act, fireEvent, render, screen } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { describe, expect, it } from 'vitest';

import { DCurrencyInput, DDecimalInput, DInput } from './input';

function assertContinuousTyping(
  input: HTMLInputElement,
  values: readonly string[],
  expectedValue: string,
  mounts: () => number,
  unmounts: () => number,
) {
  const mountedInput = input;
  act(() => input.focus());
  values.forEach((value) => {
    fireEvent.change(input, { target: { value } });
    expect(mountedInput.isConnected).toBe(true);
    expect(document.activeElement).toBe(mountedInput);
  });
  expect(mountedInput.value).toBe(expectedValue);
  expect(mounts()).toBe(1);
  expect(unmounts()).toBe(0);
}

describe('canonical input interactions', () => {
  it('supports uncontrolled password typing and visibility toggle', () => {
    render(<DInput aria-label="Password" type="password" />);

    const input = screen.getByLabelText('Password') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'secret123' } });
    expect(input.value).toBe('secret123');
    expect(input.type).toBe('password');

    fireEvent.click(screen.getByRole('button', { name: 'Tampilkan password' }));
    expect(input.type).toBe('text');
    expect(input.value).toBe('secret123');

    fireEvent.click(screen.getByRole('button', { name: 'Sembunyikan password' }));
    expect(input.type).toBe('password');
    expect(input.value).toBe('secret123');
  });

  it('keeps a controlled password mounted, editable, clearable, and retypable', () => {
    function PasswordField() {
      const [value, setValue] = useState('secret123');
      return <DInput aria-label="Controlled password" type="password" value={value} onChange={setValue} />;
    }

    render(<PasswordField />);
    const input = screen.getByLabelText('Controlled password') as HTMLInputElement;
    expect(input.value).toBe('secret123');

    fireEvent.change(input, { target: { value: '' } });
    expect(input.value).toBe('');

    fireEvent.change(input, { target: { value: 'digvation' } });
    expect(input.value).toBe('digvation');

    fireEvent.click(screen.getByRole('button', { name: 'Tampilkan password' }));
    expect(input.type).toBe('text');
    expect(input.value).toBe('digvation');
  });

  it('keeps a controlled text input mounted, focused, and updated through multiple characters', () => {
    let mountCount = 0;
    let unmountCount = 0;
    function ControlledTextInput() {
      const [value, setValue] = useState('');
      useEffect(() => {
        mountCount += 1;
        return () => {
          unmountCount += 1;
        };
      }, []);
      return (
        <DInput
          aria-label="Customer name"
          clearable
          value={value}
          onNativeChange={(event) => setValue(event.target.value)}
        />
      );
    }

    render(<ControlledTextInput />);
    assertContinuousTyping(
      screen.getByRole('textbox', { name: 'Customer name' }),
      ['A', 'Al', 'Aly', 'Alya'],
      'Alya',
      () => mountCount,
      () => unmountCount,
    );
  });

  it('formats DInput currency separators while typing without losing focus', () => {
    function CurrencyField() {
      const [value, setValue] = useState('');
      return <DInput aria-label="Amount" format="currency" value={value} onChange={setValue} />;
    }

    render(<CurrencyField />);
    const input = screen.getByRole('textbox', { name: 'Amount' }) as HTMLInputElement;
    act(() => input.focus());
    fireEvent.change(input, { target: { value: '1' } });
    expect(input.value).toBe('1');
    fireEvent.change(input, { target: { value: '10' } });
    expect(input.value).toBe('10');
    fireEvent.change(input, { target: { value: '1000' } });
    expect(input.value).toBe('1.000');
    fireEvent.change(input, { target: { value: '1000000' } });
    expect(input.value).toBe('1.000.000');
    expect(document.activeElement).toBe(input);
  });

  it('keeps a controlled numeric input mounted and focused while normalizing typed text', () => {
    let mountCount = 0;
    let unmountCount = 0;
    function ControlledNumericInput() {
      const [value, setValue] = useState('');
      useEffect(() => {
        mountCount += 1;
        return () => {
          unmountCount += 1;
        };
      }, []);
      return <DDecimalInput aria-label="Quantity" integer value={value} onValueChange={setValue} />;
    }

    render(<ControlledNumericInput />);
    assertContinuousTyping(
      screen.getByRole('textbox', { name: 'Quantity' }),
      ['0', '01', '012'],
      '12',
      () => mountCount,
      () => unmountCount,
    );
  });

  it('formats a controlled currency input live while retaining a canonical raw value', () => {
    let mountCount = 0;
    let unmountCount = 0;
    let latestRaw = '';
    function ControlledCurrencyInput() {
      const [value, setValue] = useState('');
      useEffect(() => {
        mountCount += 1;
        return () => {
          unmountCount += 1;
        };
      }, []);
      return <DCurrencyInput aria-label="Cash tendered" value={value} onValueChange={(next) => { latestRaw = next; setValue(next); }} />;
    }

    render(<ControlledCurrencyInput />);
    assertContinuousTyping(
      screen.getByRole('textbox', { name: 'Cash tendered' }),
      ['1', '12', '123', '1234'],
      '1.234',
      () => mountCount,
      () => unmountCount,
    );
    expect(latestRaw).toBe('1234');
  });
});
