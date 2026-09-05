import { describe, expect, it } from 'vitest';
import { getPaginationItems } from './pagination';

describe('DPagination', () => {
  it('keeps first/last pages and collapses distant ranges', () => {
    expect(getPaginationItems(6, 12)).toEqual([1, 'ellipsis', 5, 6, 7, 'ellipsis', 12]);
    expect(getPaginationItems(1, 3)).toEqual([1, 2, 3]);
  });
});
