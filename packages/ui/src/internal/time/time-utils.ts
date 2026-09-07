export type TimePrecision = 'hour' | 'hour-minute';
export type TimeMinuteStep = 1 | 5 | 10 | 15 | 30;

export interface ParsedTimeValue {
  hour: number;
  minute: number;
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function parseTimeValue(value?: string): ParsedTimeValue | null {
  if (!value) return null;
  const match = /^(\d{1,2})(?::(\d{2}))?$/.exec(value.trim());
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2] ?? '0');
  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return { hour, minute };
}

export function formatTimeValue(hour: number, minute = 0) {
  return `${pad(hour)}:${pad(minute)}`;
}

export function normalizeTimeValue(value: string | undefined, precision: TimePrecision) {
  const parsed = parseTimeValue(value);
  if (!parsed) return '';
  return formatTimeValue(parsed.hour, precision === 'hour' ? 0 : parsed.minute);
}

export function getMinuteOptions(step: TimeMinuteStep, selectedMinute?: number) {
  const options = Array.from({ length: Math.ceil(60 / step) }, (_, index) => index * step).filter((minute) => minute < 60);
  if (selectedMinute !== undefined && selectedMinute >= 0 && selectedMinute < 60 && !options.includes(selectedMinute)) {
    options.push(selectedMinute);
    options.sort((a, b) => a - b);
  }
  return options;
}

export function getCurrentTimeValue(precision: TimePrecision, minuteStep: TimeMinuteStep) {
  const now = new Date();
  const minute = precision === 'hour' ? 0 : Math.floor(now.getMinutes() / minuteStep) * minuteStep;
  return formatTimeValue(now.getHours(), minute);
}
