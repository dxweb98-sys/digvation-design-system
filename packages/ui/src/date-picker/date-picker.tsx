import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "../cn";
import {
  DDropdown,
  useDropdownClose,
  type FloatingScrollBehavior,
} from "../dropdown";
import { TimePickerPanel } from "../internal/time/time-picker-panel";
import {
  getCurrentTimeValue,
  normalizeTimeValue,
  type TimeMinuteStep,
  type TimePrecision,
} from "../internal/time/time-utils";
import {
  getLocalizedMonthNames,
  getLocalizedWeekdayNames,
  useDLocalization,
} from "../localization";
import { INPUT_SIZE_STYLES, type InputSize } from "../shared";

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-4"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-4"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-3.5"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-4"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-3.5"
    >
      <path d="m18 6-12 12M6 6l12 12" />
    </svg>
  );
}

export type DatePickerVariant = "date" | "date-hour" | "date-time";
export type DatePickerMinuteStep = TimeMinuteStep;

function datePart(value?: string) {
  return value?.split("T")[0] ?? "";
}

function timePart(value?: string) {
  const separator = value?.indexOf("T") ?? -1;
  return separator >= 0 ? (value?.slice(separator + 1) ?? "") : "";
}

function parseDate(value?: string): Date | null {
  const raw = datePart(value);
  if (!raw) return null;

  const date = new Date(`${raw}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toValue(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function compareDateValue(value: string, boundary?: string) {
  if (!boundary) return 0;
  return value.localeCompare(datePart(boundary));
}

function timePrecision(variant: DatePickerVariant): TimePrecision {
  return variant === "date-hour" ? "hour" : "hour-minute";
}

function formatDateDisplay(
  value: string | undefined,
  months: readonly string[],
) {
  const date = parseDate(value);

  return date
    ? `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    : "";
}

function formatDisplayValue(
  value: string | undefined,
  variant: DatePickerVariant,
  months: readonly string[],
) {
  const dateDisplay = formatDateDisplay(value, months);
  if (!dateDisplay) return "";

  if (variant === "date") return dateDisplay;

  const timeDisplay = normalizeTimeValue(
    timePart(value),
    timePrecision(variant),
  );

  return timeDisplay ? `${dateDisplay} · ${timeDisplay}` : dateDisplay;
}

export interface DatePickerProps {
  label?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  error?: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
  clearable?: boolean;
  containerClassName?: string;
  minDate?: string;
  maxDate?: string;
  size?: InputSize;
  variant?: DatePickerVariant;
  minuteStep?: DatePickerMinuteStep;
  scrollBehavior?: FloatingScrollBehavior;
}

/**
 * Time picker popover that stays INSIDE the parent DDropdown DOM tree.
 *
 * This is the important part:
 * - no nested DDropdown
 * - no React portal
 * - clicks remain descendants of the parent date-picker floating element
 *
 * Therefore the parent outside-click detector does NOT see interaction with
 * this time popover as an outside click.
 */
function TimePickerPopover({
  value,
  precision,
  minuteStep,
  rootRef,
  triggerRef,
  onCancel,
  onSelect,
}: {
  value: string;
  precision: TimePrecision;
  minuteStep: DatePickerMinuteStep;
  rootRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  onCancel: () => void;
  onSelect: (value: string) => void;
}) {
  const { t } = useDLocalization();

  const popoverRef = useRef<HTMLDivElement>(null);
  const interactedRef = useRef(false);

  const initialTime =
    normalizeTimeValue(value, precision) ||
    getCurrentTimeValue(precision, minuteStep);

  const [draftTime, setDraftTime] = useState(initialTime);
  const [hasPickedTime, setHasPickedTime] = useState(Boolean(value));
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    const nextTime =
      normalizeTimeValue(value, precision) ||
      getCurrentTimeValue(precision, minuteStep);

    setDraftTime(nextTime);
    setHasPickedTime(Boolean(value));
    interactedRef.current = false;
  }, [value, precision, minuteStep]);

  const updatePosition = () => {
    const root = rootRef.current;
    const trigger = triggerRef.current;
    const popover = popoverRef.current;

    if (!root || !trigger || !popover) return;

    const rootRect = root.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();

    const gap = 8;
    const viewportPadding = 8;

    let left: number;
    let top: number;

    const roomLeft = rootRect.left - viewportPadding;
    const roomRight = window.innerWidth - rootRect.right - viewportPadding;

    /**
     * Prefer a true side popover so it does not cover the calendar.
     * Left first, then right, then fall back inside the parent card.
     */
    if (roomLeft >= popoverRect.width + gap) {
      left = -popoverRect.width - gap;
    } else if (roomRight >= popoverRect.width + gap) {
      left = rootRect.width + gap;
    } else {
      left = Math.max(
        0,
        Math.min(
          rootRect.width - popoverRect.width,
          triggerRect.right - rootRect.left - popoverRect.width,
        ),
      );
    }

    /**
     * Vertically center the popup around the time trigger where possible.
     */
    top =
      triggerRect.top -
      rootRect.top +
      triggerRect.height / 2 -
      popoverRect.height / 2;

    const viewportTop = rootRect.top + top;
    const viewportBottom = viewportTop + popoverRect.height;

    if (viewportTop < viewportPadding) {
      top += viewportPadding - viewportTop;
    }

    if (viewportBottom > window.innerHeight - viewportPadding) {
      top -= viewportBottom - (window.innerHeight - viewportPadding);
    }

    setPosition({ left, top });
  };

  useLayoutEffect(() => {
    updatePosition();

    const handleViewportChange = () => updatePosition();

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, []);

  const markInteraction = () => {
    interactedRef.current = true;
  };

  const handleTimeChange = (nextValue: string) => {
    const normalized = normalizeTimeValue(nextValue, precision);
    if (!normalized) return;

    setDraftTime(normalized);

    /**
     * Some wheel implementations emit onChange during initialization.
     * Only unlock Apply after real pointer/keyboard/wheel interaction.
     */
    if (interactedRef.current) {
      setHasPickedTime(true);
    }
  };

  const confirm = () => {
    if (!hasPickedTime) return;

    const normalized = normalizeTimeValue(draftTime, precision);
    if (!normalized) return;

    onSelect(normalized);
  };

  return (
    <div
      ref={popoverRef}
      role="dialog"
      aria-modal="false"
      className="absolute z-50 w-[min(300px,calc(100vw-24px))] overflow-hidden rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) shadow-xl"
      style={{
        left: position.left,
        top: position.top,
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        markInteraction();
      }}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      onKeyDownCapture={markInteraction}
      onWheelCapture={markInteraction}
    >
      <div className="flex items-start justify-between gap-3 border-b border-(--color-border) px-3 py-3">
        <div>
          <p className="text-xs font-semibold text-(--color-text)">
            {t("datePicker.time")}
          </p>

          <p className="mt-0.5 text-[11px] text-(--color-text-muted)">
            {precision === "hour"
              ? t("datePicker.selectHour")
              : t("datePicker.selectHourMinute")}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-(--radius-menu-item) bg-(--color-surface-muted) px-2 py-1 text-xs font-semibold tabular-nums text-(--color-text)">
          <ClockIcon />
          {draftTime}
        </span>
      </div>

      <div className="px-3 py-3">
        <TimePickerPanel
          value={draftTime}
          variant={precision}
          minuteStep={minuteStep}
          onChange={handleTimeChange}
        />
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-(--color-border) bg-(--color-surface) px-3 py-2.5">
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onCancel();
          }}
          className="h-8 appearance-none rounded-(--radius-menu-item) border-0 bg-transparent px-3 text-xs font-medium text-(--color-text-muted) shadow-none hover:bg-(--color-surface-muted)"
        >
          {t("common.cancel")}
        </button>

        <button
          type="button"
          disabled={!hasPickedTime}
          onPointerDown={(event) => {
            event.stopPropagation();
            markInteraction();
          }}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            confirm();
          }}
          className="h-8 appearance-none rounded-(--radius-menu-item) border-0 bg-(--color-brand) px-3 text-xs font-semibold text-(--color-brand-foreground) shadow-none hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("common.apply")}
        </button>
      </div>
    </div>
  );
}

function DatePickerContent({
  value,
  onChange,
  minDate,
  maxDate,
  variant,
  minuteStep,
}: Pick<DatePickerProps, "value" | "onChange" | "minDate" | "maxDate"> & {
  variant: DatePickerVariant;
  minuteStep: DatePickerMinuteStep;
}) {
  const close = useDropdownClose();
  const { locale, t } = useDLocalization();

  const days = useMemo(
    () => getLocalizedWeekdayNames(locale, "short"),
    [locale],
  );

  const months = useMemo(() => getLocalizedMonthNames(locale), [locale]);
  const today = useMemo(() => new Date(), []);

  const selectedDate = parseDate(value);
  const selectedDateValue = datePart(value);
  const precision = timePrecision(variant);

  /**
   * This is intentionally empty when the incoming value has no time.
   *
   * Do NOT fallback this state to the current time.
   * It is the source of truth for whether the user has actually selected time.
   */
  const selectedTimeValue = normalizeTimeValue(timePart(value), precision);

  const [viewMonth, setViewMonth] = useState(
    selectedDate?.getMonth() ?? today.getMonth(),
  );

  const [viewYear, setViewYear] = useState(
    selectedDate?.getFullYear() ?? today.getFullYear(),
  );

  const [draftDate, setDraftDate] = useState(selectedDateValue);
  const [draftTime, setDraftTime] = useState(selectedTimeValue);
  const [timePopoverOpen, setTimePopoverOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timeTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const nextDate = parseDate(value);

    setDraftDate(datePart(value));
    setDraftTime(normalizeTimeValue(timePart(value), precision));
    setTimePopoverOpen(false);

    if (!nextDate) return;

    setViewMonth(nextDate.getMonth());
    setViewYear(nextDate.getFullYear());
  }, [value, precision]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const move = (amount: number) => {
    const next = new Date(viewYear, viewMonth + amount, 1);

    setViewMonth(next.getMonth());
    setViewYear(next.getFullYear());
  };

  const selectDate = (day: number) => {
    const next = toValue(viewYear, viewMonth, day);

    if (
      (minDate && compareDateValue(next, minDate) < 0) ||
      (maxDate && compareDateValue(next, maxDate) > 0)
    ) {
      return;
    }

    if (variant === "date") {
      onChange?.(next);
      close?.();
      return;
    }

    setDraftDate(next);
  };

  const todayValue = toValue(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const todayDisabled =
    Boolean(minDate && compareDateValue(todayValue, minDate) < 0) ||
    Boolean(maxDate && compareDateValue(todayValue, maxDate) > 0);

  const selectToday = () => {
    if (todayDisabled) return;

    if (variant === "date") {
      onChange?.(todayValue);
      close?.();
      return;
    }

    /**
     * Selecting "Today" only selects the date.
     * Time stays empty until it is explicitly confirmed in the time popup.
     */
    setDraftDate(todayValue);
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
  };

  const applyDateTime = () => {
    if (!draftDate || !draftTime) return;

    onChange?.(`${draftDate}T${draftTime}`);
    close?.();
  };

  /**
   * Apply must stay disabled until BOTH are explicitly available.
   */
  const canApply = Boolean(draftDate) && Boolean(draftTime);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative",
        variant === "date" ? "w-70" : "w-[min(340px,calc(100vw-16px))]",
      )}
    >
      <div className="flex max-h-[min(560px,calc(100dvh-24px))] flex-col overflow-hidden rounded-(--radius-card) bg-(--color-surface)">
        {/* Only this body is allowed to scroll on a short viewport. */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label={t("common.previousMonth")}
              onClick={() => move(-1)}
              className="flex size-8 appearance-none items-center justify-center rounded-(--radius-menu-item) border-0 bg-transparent text-(--color-text-muted) shadow-none hover:bg-(--color-surface-muted)"
            >
              <ChevronLeftIcon />
            </button>

            <span className="text-sm font-medium text-(--color-text)">
              {months[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              aria-label={t("common.nextMonth")}
              onClick={() => move(1)}
              className="flex size-8 appearance-none items-center justify-center rounded-(--radius-menu-item) border-0 bg-transparent text-(--color-text-muted) shadow-none hover:bg-(--color-surface-muted)"
            >
              <ChevronRightIcon />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 text-xs">
            {days.map((day) => (
              <div key={day} className="text-center text-(--color-text-muted)">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}

            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
              (day) => {
                const dateValue = toValue(viewYear, viewMonth, day);

                const selected =
                  (variant === "date" ? selectedDateValue : draftDate) ===
                  dateValue;

                const outside =
                  Boolean(
                    minDate && compareDateValue(dateValue, minDate) < 0,
                  ) ||
                  Boolean(maxDate && compareDateValue(dateValue, maxDate) > 0);

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={outside}
                    onClick={() => selectDate(day)}
                    className={cn(
                      "aspect-square w-full appearance-none rounded-(--radius-control) border-0 bg-transparent text-sm shadow-none transition-colors hover:bg-(--color-surface-muted) disabled:cursor-not-allowed disabled:opacity-30",
                      selected &&
                        "bg-(--color-brand) font-medium text-(--color-brand-foreground) hover:bg-(--color-brand)",
                    )}
                  >
                    {day}
                  </button>
                );
              },
            )}
          </div>

          {variant !== "date" ? (
            <div className="mt-3 border-t border-(--color-border) pt-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-(--color-text)">
                    {t("datePicker.time")}
                  </p>
                  <p className="mt-0.5 text-[11px] text-(--color-text-muted)">
                    {variant === "date-hour"
                      ? t("datePicker.selectHour")
                      : t("datePicker.selectHourMinute")}
                  </p>
                </div>

                <span
                  className={cn(
                    "shrink-0 rounded-(--radius-menu-item) bg-(--color-surface-muted) px-2 py-1 text-xs font-semibold tabular-nums",
                    draftTime
                      ? "text-(--color-text)"
                      : "text-(--color-text-muted)",
                  )}
                >
                  {draftTime || "--:--"}
                </span>
              </div>

              <button
                ref={timeTriggerRef}
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setTimePopoverOpen((open) => !open);
                }}
                className="mt-3 flex h-10 w-full appearance-none items-center justify-center gap-2 rounded-(--radius-control) border border-(--color-border) bg-(--color-surface) px-3 text-sm font-medium text-(--color-text) shadow-none transition-colors hover:bg-(--color-surface-muted) focus:outline-none focus:ring-2 focus:ring-(--color-brand)/20"
              >
                <ClockIcon />
                {draftTime ? "Ubah waktu" : "Pilih waktu"}
              </button>
            </div>
          ) : null}
        </div>

        {/*
         * FIXED FOOTER
         *
         * This is outside the scrollable body, so Hari ini / Batal / Terapkan
         * stay visible even when the viewport is short.
         */}
        <div className="shrink-0 border-t border-(--color-border) bg-(--color-surface) px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={todayDisabled}
              onClick={selectToday}
              className="h-8 appearance-none rounded-(--radius-menu-item) border-0 bg-transparent px-2 text-xs font-medium text-(--color-brand) shadow-none hover:bg-(--color-surface-muted) disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("datePicker.today")}
            </button>

            {variant !== "date" ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => close?.()}
                  className="h-8 appearance-none rounded-(--radius-menu-item) border-0 bg-transparent px-3 text-xs font-medium text-(--color-text-muted) shadow-none hover:bg-(--color-surface-muted)"
                >
                  {t("common.cancel")}
                </button>

                <button
                  type="button"
                  disabled={!canApply}
                  onClick={applyDateTime}
                  className="h-8 appearance-none rounded-(--radius-menu-item) border-0 bg-(--color-brand) px-3 text-xs font-semibold text-(--color-brand-foreground) shadow-none hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("common.apply")}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {timePopoverOpen ? (
        <TimePickerPopover
          value={draftTime}
          precision={precision}
          minuteStep={minuteStep}
          rootRef={rootRef}
          triggerRef={timeTriggerRef}
          onCancel={() => setTimePopoverOpen(false)}
          onSelect={(nextTime) => {
            setDraftTime(nextTime);
            setTimePopoverOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

export function DDatePicker({
  label,
  value,
  onChange,
  onClear,
  placeholder,
  error,
  hint,
  disabled = false,
  clearable = true,
  containerClassName,
  minDate,
  maxDate,
  size = "md",
  variant = "date",
  minuteStep = 1,
  scrollBehavior = "reposition",
}: DatePickerProps) {
  const id = useId();
  const { locale, t } = useDLocalization();
  const months = useMemo(() => getLocalizedMonthNames(locale), [locale]);
  const s = INPUT_SIZE_STYLES[size];

  const display = formatDisplayValue(value, variant, months);
  const resolvedPlaceholder = placeholder ?? t("datePicker.placeholder");

  return (
    <div
      data-ds-component="date-picker"
      data-date-picker-variant={variant}
      className={cn("flex min-w-0 flex-col gap-1.5", containerClassName)}
    >
      {label ? (
        <label
          htmlFor={id}
          className={cn(s.label, "w-fit font-medium text-(--color-text)")}
        >
          {label}
        </label>
      ) : null}

      <DDropdown
        contentRole="dialog"
        contentPadding={false}
        contentClassName="!overflow-visible"
        scrollBehavior={scrollBehavior}
        trigger={() => (
          <div className="relative">
            <button
              id={id}
              type="button"
              disabled={disabled}
              aria-invalid={Boolean(error) || undefined}
              className={cn(
                "flex w-full items-center gap-2 rounded-(--radius-control) border bg-(--color-surface) text-left text-(--color-text) transition-colors focus:border-(--color-brand) focus:outline-none focus:ring-2 focus:ring-(--color-brand)/20 disabled:cursor-not-allowed disabled:bg-(--color-surface-muted) disabled:opacity-50",
                s.input,
                error ? "border-(--color-danger)" : "border-(--color-border)",
                !display && "text-(--color-text-muted)/60",
                clearable && display && "pr-10",
              )}
            >
              <span className="text-(--color-text-muted)">
                <CalendarIcon />
              </span>

              <span className="min-w-0 flex-1 truncate">
                {display || resolvedPlaceholder}
              </span>
            </button>

            {clearable && display && !disabled ? (
              <button
                type="button"
                aria-label={t("datePicker.clear")}
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  onChange?.("");
                  onClear?.();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 appearance-none rounded-md border-0 bg-transparent p-1 text-(--color-text-muted) shadow-none hover:bg-(--color-surface-muted)"
              >
                <ClearIcon />
              </button>
            ) : null}
          </div>
        )}
      >
        <DatePickerContent
          value={value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          variant={variant}
          minuteStep={minuteStep}
        />
      </DDropdown>

      {error ? <p className="text-xs text-(--color-danger)">{error}</p> : null}

      {!error && hint ? (
        <p className="text-xs text-(--color-text-muted)">{hint}</p>
      ) : null}
    </div>
  );
}
