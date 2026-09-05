import { cleanup, render } from '@testing-library/react';
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
});
