import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DLocalizationProvider } from '../localization';
import { DForm, DFormField, DValidationMessage } from './form';
import { email, required, sameAs } from './validation';

afterEach(cleanup);

describe('DForm validation', () => {
  it('validates registered fields on submit and localizes built-in errors', async () => {
    const submit = vi.fn();

    function Example() {
      const [emailValue, setEmailValue] = useState('invalid');
      return (
        <DForm onSubmit={submit}>
          <DFormField name="email" label="Email" value={emailValue} rules={[required(), email()]}>
            {({ error }) => (
              <>
                <input aria-label="Email" value={emailValue} onChange={(event) => setEmailValue(event.target.value)} />
                <DValidationMessage error={error} />
              </>
            )}
          </DFormField>
          <button type="submit">Submit</button>
        </DForm>
      );
    }

    render(<Example />);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect((await screen.findByRole('alert')).textContent).toContain('Email harus berupa email yang valid.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('supports project locale changes and cross-field rules', async () => {
    function Example() {
      const [password, setPassword] = useState('secret123');
      const [confirm, setConfirm] = useState('different');
      return (
        <DLocalizationProvider locale="en-US">
          <DForm>
            <DFormField name="password" label="Password" value={password} rules={[required()]}>
              {() => <input aria-label="Password" value={password} onChange={(event) => setPassword(event.target.value)} />}
            </DFormField>
            <DFormField name="confirm" label="Confirmation" value={confirm} rules={[sameAs('password', 'Password')]}>
              {({ error }) => (
                <>
                  <input aria-label="Confirmation" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
                  <DValidationMessage error={error} />
                </>
              )}
            </DFormField>
            <button type="submit">Submit</button>
          </DForm>
        </DLocalizationProvider>
      );
    }

    render(<Example />);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Confirmation must match Password.'));
  });

  it('validates on change when requested', async () => {
    function Example() {
      const [value, setValue] = useState('valid@example.com');
      return (
        <DForm validateOn="change">
          <DFormField name="email" label="Email" value={value} rules={[required(), email()]}>
            {({ error }) => (
              <>
                <input aria-label="Email change" value={value} onChange={(event) => setValue(event.target.value)} />
                <DValidationMessage error={error} />
              </>
            )}
          </DFormField>
        </DForm>
      );
    }

    render(<Example />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Email change' }), { target: { value: 'invalid' } });
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Email harus berupa email yang valid.'));
  });

});
