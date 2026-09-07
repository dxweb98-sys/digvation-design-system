import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type FormHTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '../cn';
import { useDLocalization } from '../localization';
import {
  validateValue,
  type ValidationIssue,
  type ValidationRule,
  type ValidationSchema,
} from './validation';

export type FormValidateOn = 'submit' | 'blur' | 'change';
export type FormErrors = Record<string, string | undefined>;
export type FormValues = Record<string, unknown>;

type FieldRegistration = {
  value: unknown;
  rules?: readonly ValidationRule[];
  label?: string;
};

interface FormContextValue {
  values: FormValues;
  errors: FormErrors;
  schema?: ValidationSchema;
  validateOn: readonly FormValidateOn[];
  submitted: boolean;
  register: (name: string, field: FieldRegistration) => void;
  unregister: (name: string) => void;
  validateField: (name: string, override?: FieldRegistration) => Promise<string | undefined>;
  setFieldError: (name: string, error?: string) => void;
  clearErrors: () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

function normalizeValidateOn(value: FormValidateOn | readonly FormValidateOn[] | undefined): readonly FormValidateOn[] {
  return typeof value === 'string' ? [value] : (value ?? ['submit']);
}

function formatIssue(issue: ValidationIssue | null, label: string, t: ReturnType<typeof useDLocalization>['t']) {
  if (!issue) return undefined;
  if (issue.message) return issue.message;
  return t(issue.key ?? 'validation.invalid', { label, ...issue.params });
}

export interface FormRenderProps {
  errors: FormErrors;
  isValid: boolean;
  clearErrors: () => void;
}

export interface DFormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children' | 'onInvalid'> {
  children: ReactNode | ((props: FormRenderProps) => ReactNode);
  values?: FormValues;
  schema?: ValidationSchema;
  validateOn?: FormValidateOn | readonly FormValidateOn[];
  onSubmit?: (values: FormValues) => void | Promise<void>;
  onInvalid?: (errors: FormErrors, values: FormValues) => void;
}

export function DForm({
  children,
  values = {},
  schema,
  validateOn,
  onSubmit,
  onInvalid,
  className,
  ...props
}: DFormProps) {
  const { t } = useDLocalization();
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const fieldsRef = useRef(new Map<string, FieldRegistration>());
  const modes = useMemo(() => normalizeValidateOn(validateOn), [validateOn]);

  const mergedValues = useCallback(() => {
    const next: FormValues = { ...values };
    fieldsRef.current.forEach((field, name) => { next[name] = field.value; });
    return next;
  }, [values]);

  const register = useCallback((name: string, field: FieldRegistration) => {
    fieldsRef.current.set(name, field);
  }, []);

  const unregister = useCallback((name: string) => {
    fieldsRef.current.delete(name);
  }, []);

  const setFieldError = useCallback((name: string, error?: string) => {
    setErrors((current) => {
      if (current[name] === error) return current;
      const next = { ...current };
      if (error) next[name] = error;
      else delete next[name];
      return next;
    });
  }, []);

  const validateField = useCallback(async (name: string, override?: FieldRegistration) => {
    const registered = override ?? fieldsRef.current.get(name);
    const allValues = mergedValues();
    const label = registered?.label ?? name ?? t('validation.defaultLabel');
    const rules = [
      ...(schema?.[name] ?? []),
      ...(registered?.rules ?? []),
    ];
    const issue = await validateValue(registered?.value ?? allValues[name], rules, { name, label, values: allValues });
    const error = formatIssue(issue, label, t);
    setFieldError(name, error);
    return error;
  }, [mergedValues, schema, setFieldError, t]);

  const clearErrors = useCallback(() => setErrors({}), []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const allValues = mergedValues();
    const names = new Set([...Object.keys(schema ?? {}), ...fieldsRef.current.keys()]);
    const nextErrors: FormErrors = {};
    for (const name of names) {
      const registered = fieldsRef.current.get(name);
      const label = registered?.label ?? name ?? t('validation.defaultLabel');
      const rules = [...(schema?.[name] ?? []), ...(registered?.rules ?? [])];
      const issue = await validateValue(registered?.value ?? allValues[name], rules, { name, label, values: allValues });
      const error = formatIssue(issue, label, t);
      if (error) nextErrors[name] = error;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      onInvalid?.(nextErrors, allValues);
      return;
    }
    await onSubmit?.(allValues);
  };

  const context = useMemo<FormContextValue>(() => ({
    values: mergedValues(),
    errors,
    schema,
    validateOn: modes,
    submitted,
    register,
    unregister,
    validateField,
    setFieldError,
    clearErrors,
  }), [clearErrors, errors, mergedValues, modes, register, schema, setFieldError, submitted, unregister, validateField]);

  const renderProps: FormRenderProps = {
    errors,
    isValid: Object.keys(errors).length === 0,
    clearErrors,
  };

  return (
    <FormContext.Provider value={context}>
      <form {...props} noValidate onSubmit={handleSubmit} className={className} data-ds-component="form">
        {typeof children === 'function' ? children(renderProps) : children}
      </form>
    </FormContext.Provider>
  );
}

export interface UseDFormFieldOptions {
  name: string;
  value: unknown;
  label?: string;
  rules?: readonly ValidationRule[];
  validateOn?: FormValidateOn | readonly FormValidateOn[];
}

export interface DFormFieldState {
  error?: string;
  invalid: boolean;
  onBlur: () => void;
  validate: () => Promise<string | undefined>;
  clearError: () => void;
}

export function useDFormField({ name, value, label, rules = [], validateOn }: UseDFormFieldOptions): DFormFieldState {
  const form = useContext(FormContext);
  const { t } = useDLocalization();
  const [localError, setLocalError] = useState<string | undefined>(undefined);
  const mountedRef = useRef(false);
  const localModes = useMemo(() => normalizeValidateOn(validateOn), [validateOn]);
  const modes = validateOn ? localModes : (form?.validateOn ?? localModes);
  const resolvedLabel = label ?? name ?? t('validation.defaultLabel');

  useEffect(() => {
    form?.register(name, { value, rules, label: resolvedLabel });
    return () => form?.unregister(name);
  }, [form, name, resolvedLabel, rules, value]);

  const validate = useCallback(async () => {
    if (form) return form.validateField(name, { value, rules, label: resolvedLabel });
    const issue = await validateValue(value, rules, { name, label: resolvedLabel, values: { [name]: value } });
    const error = formatIssue(issue, resolvedLabel, t);
    setLocalError(error);
    return error;
  }, [form, name, resolvedLabel, rules, t, value]);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (modes.includes('change')) void validate();
  }, [form, modes, validate, value]);

  const clearError = useCallback(() => {
    if (form) form.setFieldError(name, undefined);
    else setLocalError(undefined);
  }, [form, name]);

  const error = form?.errors[name] ?? localError;
  return {
    error,
    invalid: Boolean(error),
    onBlur: () => { if (modes.includes('blur')) void validate(); },
    validate,
    clearError,
  };
}

export interface DFormFieldProps extends UseDFormFieldOptions {
  children: (state: DFormFieldState) => ReactNode;
}

export function DFormField({ children, ...options }: DFormFieldProps) {
  return <>{children(useDFormField(options))}</>;
}

export interface DValidationMessageProps {
  error?: ReactNode;
  className?: string;
}

export function DValidationMessage({ error, className }: DValidationMessageProps) {
  return error ? <p role="alert" className={cn('mt-1.5 text-xs text-[var(--color-danger)]', className)}>{error}</p> : null;
}
