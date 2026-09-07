export function getLocalizedMonthNames(locale: string, format: 'long' | 'short' = 'long') {
  const formatter = new Intl.DateTimeFormat(locale, { month: format });
  return Array.from({ length: 12 }, (_, month) => formatter.format(new Date(2026, month, 1)));
}

export function getLocalizedWeekdayNames(locale: string, format: 'long' | 'short' | 'narrow' = 'short') {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
  const sunday = new Date(2026, 0, 4);
  return Array.from({ length: 7 }, (_, day) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + day);
    return formatter.format(date);
  });
}
