import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { enMessages, idMessages, type BuiltInLocalizationKey } from './messages';

export type LocalizationParams = Record<string, string | number | boolean | null | undefined>;
export type LocalizationMessages = Partial<Record<BuiltInLocalizationKey | (string & {}), string>>;
export type LocalizationTranslator = (
  key: string,
  params: LocalizationParams,
  fallback: string,
) => string | null | undefined;

export interface LocalizationProviderProps {
  children: ReactNode;
  /** Default is Indonesian. BCP-47 values such as id-ID, en-US, or project locales are accepted. */
  locale?: string;
  /** Override only the design-system messages the project wants to own. */
  messages?: LocalizationMessages;
  /** Adapter for project i18n (i18next, next-intl, react-intl, etc.). */
  translate?: LocalizationTranslator;
}

export interface LocalizationContextValue {
  locale: string;
  t: (key: string, params?: LocalizationParams, fallback?: string) => string;
}

function interpolate(template: string, params: LocalizationParams) {
  return template.replace(/\{([^}]+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

function builtInMessages(locale: string) {
  return locale.toLowerCase().startsWith('en') ? enMessages : idMessages;
}

export function createDTranslator({
  locale = 'id-ID',
  messages,
  translate,
}: Omit<LocalizationProviderProps, 'children'> = {}): LocalizationContextValue['t'] {
  const builtIn = builtInMessages(locale);
  return (key, params = {}, explicitFallback) => {
    const fallback = explicitFallback ?? builtIn[key as BuiltInLocalizationKey] ?? idMessages[key as BuiltInLocalizationKey] ?? key;
    const projectValue = translate?.(key, params, fallback);
    const template = projectValue ?? messages?.[key] ?? builtIn[key as BuiltInLocalizationKey] ?? idMessages[key as BuiltInLocalizationKey] ?? fallback;
    return interpolate(template, params);
  };
}

const defaultContext: LocalizationContextValue = {
  locale: 'id-ID',
  t: createDTranslator(),
};

const LocalizationContext = createContext<LocalizationContextValue>(defaultContext);

export function DLocalizationProvider({
  children,
  locale = 'id-ID',
  messages,
  translate,
}: LocalizationProviderProps) {
  const value = useMemo<LocalizationContextValue>(() => ({
    locale,
    t: createDTranslator({ locale, messages, translate }),
  }), [locale, messages, translate]);

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useDLocalization() {
  return useContext(LocalizationContext);
}
