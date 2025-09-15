// 폼 관련 타입 정의

import { ValidationError, FormState } from "./common";

export interface FormFieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "date"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  validation?: FieldValidation;
  options?: SelectOption[];
  defaultValue?: any;
  helpText?: string;
  errorMessage?: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
}

export interface FormConfig<T = any> {
  fields: FormFieldConfig[];
  validation?: FormValidation;
  submitButton?: SubmitButtonConfig;
  resetButton?: ResetButtonConfig;
  layout?: FormLayout;
  initialValues?: Partial<T>;
}

export interface FormValidation {
  mode: "onChange" | "onBlur" | "onSubmit";
  revalidateMode: "onChange" | "onBlur" | "onSubmit";
  validateOnMount?: boolean;
}

export interface SubmitButtonConfig {
  text: string;
  loadingText?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
}

export interface ResetButtonConfig {
  text: string;
  show?: boolean;
  variant?: "outline" | "ghost";
  size?: "small" | "medium" | "large";
}

export interface FormLayout {
  columns?: number;
  spacing?: number;
  direction?: "row" | "column";
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around";
}

export interface FormHookReturn<T = any> {
  formState: FormState<T>;
  register: (name: string, config?: FieldValidation) => void;
  unregister: (name: string) => void;
  setValue: (name: string, value: any) => void;
  getValue: (name: string) => any;
  getValues: () => T;
  setError: (name: string, error: string) => void;
  clearError: (name: string) => void;
  clearErrors: () => void;
  validate: (name?: string) => Promise<boolean>;
  handleSubmit: (
    onSubmit: (data: T) => void | Promise<void>
  ) => (e?: any) => void;
  reset: (values?: Partial<T>) => void;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
}

export interface FormContextValue<T = any> {
  formState: FormState<T>;
  register: (name: string, config?: FieldValidation) => void;
  unregister: (name: string) => void;
  setValue: (name: string, value: any) => void;
  getValue: (name: string) => any;
  setError: (name: string, error: string) => void;
  clearError: (name: string) => void;
  validate: (name?: string) => Promise<boolean>;
  handleSubmit: (
    onSubmit: (data: T) => void | Promise<void>
  ) => (e?: any) => void;
  reset: (values?: Partial<T>) => void;
}

export interface FormProviderProps<T = any> {
  children: React.ReactNode;
  initialValues?: Partial<T>;
  validation?: FormValidation;
  onSubmit?: (data: T) => void | Promise<void>;
}

export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  validation?: FieldValidation;
  options?: SelectOption[];
  defaultValue?: any;
  helpText?: string;
  errorMessage?: string;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface FormActionsProps {
  onSubmit?: () => void;
  onReset?: () => void;
  onCancel?: () => void;
  submitText?: string;
  resetText?: string;
  cancelText?: string;
  loading?: boolean;
  disabled?: boolean;
  showReset?: boolean;
  showCancel?: boolean;
}
