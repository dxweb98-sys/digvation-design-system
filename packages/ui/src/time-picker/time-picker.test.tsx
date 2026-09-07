import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { DDatePicker } from '../date-picker';
import { DTimePicker } from './time-picker';

afterEach(cleanup);

describe('date and time pickers', () => {
  it('shows the full 00-59 minute range by default', () => {
    render(<DTimePicker label="Full minute time" value="09:15" onChange={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Full minute time' }));

    expect(screen.getByRole('button', { name: 'Menit 00' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Menit 01' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Menit 59' })).toBeTruthy();
  });

  it('selects hour and minute as a canonical HH:mm value', () => {
    function Example() {
      const [value, setValue] = useState('09:15');
      return <DTimePicker label="Meeting time" value={value} onChange={setValue} minuteStep={15} />;
    }

    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Meeting time' });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'Jam 14' }));
    fireEvent.click(screen.getByRole('button', { name: 'Menit 30' }));
    fireEvent.click(screen.getByRole('button', { name: 'Terapkan' }));

    expect(trigger.textContent).toContain('14:30');
  });

  it('normalizes the hour-only variant to zero minutes', () => {
    function Example() {
      const [value, setValue] = useState('09:45');
      return <DTimePicker label="Start hour" value={value} onChange={setValue} variant="hour" />;
    }

    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Start hour' });
    expect(trigger.textContent).toContain('09:00');
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'Jam 16' }));
    fireEvent.click(screen.getByRole('button', { name: 'Terapkan' }));

    expect(trigger.textContent).toContain('16:00');
  });

  it('keeps DDatePicker date behavior while composing date-time values for time variants', () => {
    function Example() {
      const [value, setValue] = useState('2026-09-04T09:15');
      return <DDatePicker label="Deployment" value={value} onChange={setValue} variant="date-time" minuteStep={15} />;
    }

    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Deployment' });
    expect(trigger.textContent).toContain('4 September 2026 · 09:15');
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'Jam 14' }));
    fireEvent.click(screen.getByRole('button', { name: 'Menit 30' }));
    fireEvent.click(screen.getByRole('button', { name: 'Terapkan' }));

    expect(trigger.textContent).toContain('4 September 2026 · 14:30');
  });
});
