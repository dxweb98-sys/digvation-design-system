import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { DAccordion, DAccordionItem } from './accordion';
import { DDataTable } from './data-table';
import { DPagination } from './pagination';
import { DSearchInput } from './search-input';
import { DTabs, DTabsContent, DTabsList, DTabsTrigger } from './tabs';

afterEach(cleanup);

describe('component normalization boundaries', () => {
  it('marks native-control composites so browser defaults cannot leak into them', () => {
    const { container: search } = render(<DSearchInput value="" onChange={() => undefined} />);
    expect(search.querySelector('[data-ds-component="search-input"]')).toBeTruthy();
    cleanup();

    const { container: tabs } = render(
      <DTabs defaultValue="preview">
        <DTabsList>
          <DTabsTrigger value="preview">Preview</DTabsTrigger>
          <DTabsTrigger value="api">API</DTabsTrigger>
        </DTabsList>
        <DTabsContent value="preview">Preview content</DTabsContent>
      </DTabs>,
    );
    expect(tabs.querySelector('[data-ds-component="tabs"]')).toBeTruthy();
    cleanup();

    const { container: accordion } = render(
      <DAccordion>
        <DAccordionItem value="one" title="One">Content</DAccordionItem>
      </DAccordion>,
    );
    expect(accordion.querySelector('[data-ds-component="accordion"]')).toBeTruthy();
    cleanup();

    const { container: pagination } = render(<DPagination page={2} totalPages={5} onChange={() => undefined} />);
    expect(pagination.querySelector('[data-ds-component="pagination"]')).toBeTruthy();
    cleanup();

    const { container: table } = render(
      <DDataTable
        columns={[{ key: 'name', label: 'Name' }]}
        data={[{ name: 'Alya' }]}
        rowKey="name"
      />,
    );
    expect(table.querySelector('[data-ds-component="data-table"]')).toBeTruthy();
  });

  it('keeps composite buttons explicitly free from browser-native chrome', () => {
    const { container: search } = render(<DSearchInput value="" onChange={() => undefined} />);
    const searchInputs = Array.from(search.querySelectorAll('input'));
    expect(searchInputs.every((input) => input.className.includes('appearance-none'))).toBe(true);
    cleanup();

    render(
      <DTabs defaultValue="preview">
        <DTabsList><DTabsTrigger value="preview">Preview</DTabsTrigger></DTabsList>
        <DTabsContent value="preview">Content</DTabsContent>
      </DTabs>,
    );
    const tab = screen.getByRole('tab', { name: 'Preview' });
    expect(tab.className).toContain('appearance-none');
    expect(tab.className).toContain('border-0');
    expect(tab.className).toContain('bg-transparent');
    cleanup();

    const { container: accordion } = render(
      <DAccordion>
        <DAccordionItem value="one" title="One">Content</DAccordionItem>
      </DAccordion>,
    );
    const accordionRoot = accordion.querySelector('[data-ds-component="accordion"]') as HTMLElement;
    const accordionTrigger = screen.getByRole('button', { name: 'One' });
    expect(accordionRoot.className).not.toContain('divide-y');
    expect(accordionTrigger.className).toContain('border-0');
    expect(accordionTrigger.className).toContain('bg-transparent');
    cleanup();

    render(<DPagination page={2} totalPages={5} onChange={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Previous page' }).className).toContain('appearance-none');
    expect(screen.getByRole('button', { name: '2' }).className).toContain('appearance-none');
    cleanup();

    render(
      <DDataTable
        columns={[{ key: 'name', label: 'Project', sortable: true }]}
        data={[{ name: 'Alya' }]}
        rowKey="name"
        sortBy="name"
        sortDirection="asc"
        onSort={() => undefined}
        pagination={{ page: 1, pageSize: 10, total: 1 }}
        onPageChange={() => undefined}
      />,
    );
    const sortButton = screen.getByRole('button', { name: 'Project' });
    expect(sortButton.className).toContain('border-0');
    expect(sortButton.className).toContain('bg-transparent');
    expect(screen.getByRole('button', { name: 'Page 1' }).className).toContain('border-0');
  });
});
