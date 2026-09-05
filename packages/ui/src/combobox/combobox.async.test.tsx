import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { DCombobox } from './combobox';
import type { SelectOption } from '../select';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });
  return { promise, resolve, reject };
}

describe('DCombobox async behavior', () => {
  it('ignores stale async responses from an older query', async () => {
    const first = deferred<readonly SelectOption[]>();
    const second = deferred<readonly SelectOption[]>();
    const fetchOptions = vi.fn((query: string) => {
      if (query === '') return Promise.resolve([] as readonly SelectOption[]);
      if (query === 'a') return first.promise;
      return second.promise;
    });

    render(<DCombobox ariaLabel="Customer" debounceMs={0} fetchOptions={fetchOptions} />);
    const input = screen.getByRole('combobox', { name: 'Customer' });

    fireEvent.focus(input);
    await waitFor(() => expect(fetchOptions).toHaveBeenCalledWith(''));

    fireEvent.change(input, { target: { value: 'a' } });
    await waitFor(() => expect(fetchOptions).toHaveBeenCalledWith('a'));

    fireEvent.change(input, { target: { value: 'ab' } });
    await waitFor(() => expect(fetchOptions).toHaveBeenCalledWith('ab'));

    await act(async () => {
      second.resolve([{ value: 'new', label: 'Newest result' }]);
      await second.promise;
    });
    expect(await screen.findByText('Newest result')).toBeTruthy();

    await act(async () => {
      first.resolve([{ value: 'old', label: 'Stale result' }]);
      await first.promise;
    });
    expect(screen.queryByText('Stale result')).toBeNull();
    expect(screen.getByText('Newest result')).toBeTruthy();
  });

  it('refetches when refetchKey changes while open', async () => {
    const fetchOptions = vi.fn(async () => [{ value: '1', label: 'Option' }]);

    function Example() {
      const [key, setKey] = useState(0);
      return (
        <>
          <DCombobox ariaLabel="City" debounceMs={0} fetchOptions={fetchOptions} refetchKey={key} />
          <button type="button" onClick={() => setKey((value) => value + 1)}>Refresh options</button>
        </>
      );
    }

    render(<Example />);
    fireEvent.focus(screen.getByRole('combobox', { name: 'City' }));
    await waitFor(() => expect(fetchOptions).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole('button', { name: 'Refresh options' }));
    await waitFor(() => expect(fetchOptions).toHaveBeenCalledTimes(2));
  });

  it('reports async errors with a consumer-facing message', async () => {
    const onFetchError = vi.fn();
    const fetchOptions = vi.fn(async () => {
      throw new Error('network');
    });

    render(
      <DCombobox
        ariaLabel="Remote option"
        debounceMs={0}
        fetchOptions={fetchOptions}
        onFetchError={onFetchError}
        asyncErrorMessage="Tidak dapat memuat data"
      />,
    );

    fireEvent.focus(screen.getByRole('combobox', { name: 'Remote option' }));
    expect(await screen.findByText('Tidak dapat memuat data')).toBeTruthy();
    expect(onFetchError).toHaveBeenCalledTimes(1);
  });
});
