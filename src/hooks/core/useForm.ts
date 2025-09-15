// 폼 관리를 위한 핵심 훅

import { useState, useCallback, useRef, useEffect } from "react";
import { FormState, ValidationError, FieldValidation } from "../../types/form";

interface UseFormOptions<T = any> {
  initialValues?: Partial<T>;
  validation?: {
    mode: "onChange" | "onBlur" | "onSubmit";
    revalidateMode: "onChange" | "onBlur" | "onSubmit";
  };
  onSubmit?: (data: T) => void | Promise<void>;
}

interface UseFormReturn<T = any> {
  formState: FormState<T>;
  register: (
    name: string,
    validation?: FieldValidation
  ) => {
    name: string;
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    error: string | null;
  };
  setValue: (name: string, value: any) => void;
  getValue: (name: string) => any;
  getValues: () => T;
  setError: (name: string, error: string) => void;
  clearError: (name: string) => void;
  clearErrors: () => void;
  validate: (name?: string) => Promise<boolean>;
  handleSubmit: (
    onSubmit?: (data: T) => void | Promise<void>
  ) => (e?: any) => void;
  reset: (values?: Partial<T>) => void;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
}

export const useForm = <T = any>(
  options: UseFormOptions<T> = {}
): UseFormReturn<T> => {
  const {
    initialValues = {},
    validation = { mode: "onSubmit", revalidateMode: "onChange" },
    onSubmit,
  } = options;

  const [formState, setFormState] = useState<FormState<T>>({
    data: initialValues as T,
    errors: {},
    touched: {},
    isValid: true,
    isSubmitting: false,
  });

  const fieldValidations = useRef<Record<string, FieldValidation>>({});
  const isDirtyRef = useRef(false);

  // 필드 등록
  const register = useCallback(
    (name: string, validation?: FieldValidation) => {
      if (validation) {
        fieldValidations.current[name] = validation;
      }

      return {
        name,
        value: formState.data[name as keyof T] || "",
        onChange: (value: any) => {
          setFormState((prev) => ({
            ...prev,
            data: { ...prev.data, [name]: value },
            touched: { ...prev.touched, [name]: true },
          }));
          isDirtyRef.current = true;

          // onChange 모드에서 실시간 검증
          if (validation?.mode === "onChange") {
            validateField(name, value);
          }
        },
        onBlur: () => {
          setFormState((prev) => ({
            ...prev,
            touched: { ...prev.touched, [name]: true },
          }));

          // onBlur 모드에서 검증
          if (
            validation?.mode === "onBlur" ||
            validation?.revalidateMode === "onBlur"
          ) {
            validateField(name, formState.data[name as keyof T]);
          }
        },
        error: formState.errors[name] || null,
      };
    },
    [formState.data, formState.errors, formState.touched]
  );

  // 필드 검증
  const validateField = useCallback(
    async (name: string, value: any): Promise<boolean> => {
      const fieldValidation = fieldValidations.current[name];
      if (!fieldValidation) return true;

      let error: string | null = null;

      // 필수 필드 검증
      if (fieldValidation.required && (!value || value === "")) {
        error = "필수 입력 항목입니다.";
      }
      // 최소 길이 검증
      else if (
        fieldValidation.minLength &&
        value &&
        value.length < fieldValidation.minLength
      ) {
        error = `최소 ${fieldValidation.minLength}자 이상 입력해주세요.`;
      }
      // 최대 길이 검증
      else if (
        fieldValidation.maxLength &&
        value &&
        value.length > fieldValidation.maxLength
      ) {
        error = `최대 ${fieldValidation.maxLength}자까지 입력 가능합니다.`;
      }
      // 최소값 검증
      else if (
        fieldValidation.min !== undefined &&
        value < fieldValidation.min
      ) {
        error = `최소값은 ${fieldValidation.min}입니다.`;
      }
      // 최대값 검증
      else if (
        fieldValidation.max !== undefined &&
        value > fieldValidation.max
      ) {
        error = `최대값은 ${fieldValidation.max}입니다.`;
      }
      // 패턴 검증
      else if (
        fieldValidation.pattern &&
        value &&
        !fieldValidation.pattern.test(value)
      ) {
        error = "올바른 형식이 아닙니다.";
      }
      // 커스텀 검증
      else if (fieldValidation.custom) {
        error = fieldValidation.custom(value);
      }

      setFormState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: error || undefined,
        },
      }));

      return !error;
    },
    []
  );

  // 전체 폼 검증
  const validate = useCallback(
    async (name?: string): Promise<boolean> => {
      if (name) {
        return validateField(name, formState.data[name as keyof T]);
      }

      const fieldNames = Object.keys(fieldValidations.current);
      const validationResults = await Promise.all(
        fieldNames.map((fieldName) =>
          validateField(fieldName, formState.data[fieldName as keyof T])
        )
      );

      const isValid = validationResults.every((result) => result);
      setFormState((prev) => ({ ...prev, isValid }));

      return isValid;
    },
    [formState.data, validateField]
  );

  // 값 설정
  const setValue = useCallback((name: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
      touched: { ...prev.touched, [name]: true },
    }));
    isDirtyRef.current = true;
  }, []);

  // 값 가져오기
  const getValue = useCallback(
    (name: string) => {
      return formState.data[name as keyof T];
    },
    [formState.data]
  );

  // 모든 값 가져오기
  const getValues = useCallback(() => {
    return formState.data;
  }, [formState.data]);

  // 에러 설정
  const setError = useCallback((name: string, error: string) => {
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
    }));
  }, []);

  // 에러 제거
  const clearError = useCallback((name: string) => {
    setFormState((prev) => {
      const newErrors = { ...prev.errors };
      delete newErrors[name];
      return { ...prev, errors: newErrors };
    });
  }, []);

  // 모든 에러 제거
  const clearErrors = useCallback(() => {
    setFormState((prev) => ({ ...prev, errors: {} }));
  }, []);

  // 폼 제출 처리
  const handleSubmit = useCallback(
    (onSubmitHandler?: (data: T) => void | Promise<void>) => {
      return async (e?: any) => {
        e?.preventDefault();

        setFormState((prev) => ({ ...prev, isSubmitting: true }));

        try {
          const isValid = await validate();
          if (!isValid) {
            setFormState((prev) => ({ ...prev, isSubmitting: false }));
            return;
          }

          const handler = onSubmitHandler || onSubmit;
          if (handler) {
            await handler(formState.data);
          }
        } catch (error) {
          console.error("Form submission error:", error);
        } finally {
          setFormState((prev) => ({ ...prev, isSubmitting: false }));
        }
      };
    },
    [formState.data, validate, onSubmit]
  );

  // 폼 리셋
  const reset = useCallback(
    (values?: Partial<T>) => {
      const resetValues = values || initialValues;
      setFormState({
        data: resetValues as T,
        errors: {},
        touched: {},
        isValid: true,
        isSubmitting: false,
      });
      isDirtyRef.current = false;
    },
    [initialValues]
  );

  // isDirty 계산
  const isDirty = isDirtyRef.current;

  return {
    formState,
    register,
    setValue,
    getValue,
    getValues,
    setError,
    clearError,
    clearErrors,
    validate,
    handleSubmit,
    reset,
    isDirty,
    isValid: formState.isValid,
    isSubmitting: formState.isSubmitting,
  };
};
