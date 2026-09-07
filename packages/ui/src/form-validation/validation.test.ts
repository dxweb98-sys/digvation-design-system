import { describe, expect, it } from 'vitest';

import { accepted, date, email, minLength, required, sameAs, time, validateValue } from './validation';

describe('form validation rules', () => {
  it('supports standard required/email/length validation', async () => {
    const context = { name: 'email', label: 'Email', values: { email: '' } };
    expect((await validateValue('', [required(), email()], context))?.key).toBe('validation.required');
    expect((await validateValue('foo', [required(), email()], { ...context, values: { email: 'foo' } }))?.key).toBe('validation.email');
    expect(await validateValue('a@b.co', [required(), email(), minLength(5)], { ...context, values: { email: 'a@b.co' } })).toBeNull();
  });

  it('validates boolean acceptance, date/time and cross-field equality', async () => {
    expect((await validateValue(false, [accepted()], { name: 'terms', label: 'Terms', values: {} }))?.key).toBe('validation.accepted');
    expect(await validateValue('2026-02-29', [date()], { name: 'date', label: 'Date', values: {} })).not.toBeNull();
    expect(await validateValue('2028-02-29', [date()], { name: 'date', label: 'Date', values: {} })).toBeNull();
    expect(await validateValue('23:59', [time()], { name: 'time', label: 'Time', values: {} })).toBeNull();
    expect(await validateValue('24:00', [time()], { name: 'time', label: 'Time', values: {} })).not.toBeNull();
    expect(await validateValue('secret', [sameAs('password')], { name: 'confirm', label: 'Confirm', values: { password: 'secret' } })).toBeNull();
  });
});
