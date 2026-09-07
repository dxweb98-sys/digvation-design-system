import { describe, expect, it } from 'vitest';

import { createDTranslator } from './localization';

describe('localization', () => {
  it('defaults to Indonesian and switches to English', () => {
    expect(createDTranslator()('common.apply')).toBe('Terapkan');
    expect(createDTranslator({ locale: 'en-US' })('common.apply')).toBe('Apply');
  });

  it('supports project message override and external translator adapters', () => {
    const custom = createDTranslator({ locale: 'id-ID', messages: { 'common.apply': 'Simpan' } });
    expect(custom('common.apply')).toBe('Simpan');
    const external = createDTranslator({ translate: (key) => key === 'common.cancel' ? 'Batalkan dari i18n project' : undefined });
    expect(external('common.cancel')).toBe('Batalkan dari i18n project');
  });
});
