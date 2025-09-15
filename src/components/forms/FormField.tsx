// 폼 필드 컴포넌트

import React from "react";
import { View, Text, ViewStyle, TextStyle } from "react-native";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import { FormFieldProps } from "../../types/form";

interface FormFieldComponentProps extends FormFieldProps {
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  helpText?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helpTextStyle?: TextStyle;
}

export const FormField: React.FC<FormFieldComponentProps> = ({
  name,
  label,
  children,
  required = false,
  error,
  helpText,
  style,
  labelStyle,
  errorStyle,
  helpTextStyle,
}) => {
  const containerStyle: ViewStyle = {
    marginBottom: spacing[4],
    ...style,
  };

  const labelContainerStyle: ViewStyle = {
    marginBottom: spacing[2],
  };

  const labelTextStyle: TextStyle = {
    ...typography.inputLabel,
    color: colors.gray[700],
    ...labelStyle,
  };

  const requiredStyle: TextStyle = {
    color: colors.red[500],
  };

  const errorContainerStyle: ViewStyle = {
    marginTop: spacing[1],
  };

  const errorTextStyle: TextStyle = {
    ...typography.inputError,
    color: colors.red[500],
    ...errorStyle,
  };

  const helpTextContainerStyle: ViewStyle = {
    marginTop: spacing[1],
  };

  const helpTextTextStyle: TextStyle = {
    ...typography.inputHelper,
    color: colors.gray[500],
    ...helpTextStyle,
  };

  return (
    <View style={containerStyle}>
      {label && (
        <View style={labelContainerStyle}>
          <Text style={labelTextStyle}>
            {label}
            {required && <Text style={requiredStyle}> *</Text>}
          </Text>
        </View>
      )}

      {children}

      {error && (
        <View style={errorContainerStyle}>
          <Text style={errorTextStyle}>{error}</Text>
        </View>
      )}

      {helpText && !error && (
        <View style={helpTextContainerStyle}>
          <Text style={helpTextTextStyle}>{helpText}</Text>
        </View>
      )}
    </View>
  );
};

// 폼 필드 그룹 컴포넌트
interface FormFieldGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}

export const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  title,
  description,
  children,
  style,
  titleStyle,
  descriptionStyle,
}) => {
  const containerStyle: ViewStyle = {
    marginBottom: spacing[6],
    ...style,
  };

  const headerStyle: ViewStyle = {
    marginBottom: spacing[4],
  };

  const titleTextStyle: TextStyle = {
    ...typography.h6,
    color: colors.gray[800],
    marginBottom: description ? spacing[1] : 0,
    ...titleStyle,
  };

  const descriptionTextStyle: TextStyle = {
    ...typography.body2,
    color: colors.gray[600],
    ...descriptionStyle,
  };

  return (
    <View style={containerStyle}>
      {(title || description) && (
        <View style={headerStyle}>
          {title && <Text style={titleTextStyle}>{title}</Text>}
          {description && (
            <Text style={descriptionTextStyle}>{description}</Text>
          )}
        </View>
      )}
      {children}
    </View>
  );
};

// 폼 필드 배열 컴포넌트
interface FormFieldArrayProps {
  name: string;
  title?: string;
  children: (index: number, remove: () => void) => React.ReactNode;
  addButtonText?: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  items: any[];
  maxItems?: number;
  minItems?: number;
  style?: ViewStyle;
}

export const FormFieldArray: React.FC<FormFieldArrayProps> = ({
  name,
  title,
  children,
  addButtonText = "항목 추가",
  onAdd,
  onRemove,
  items,
  maxItems,
  minItems = 0,
  style,
}) => {
  const containerStyle: ViewStyle = {
    marginBottom: spacing[4],
    ...style,
  };

  const headerStyle: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[3],
  };

  const titleTextStyle: TextStyle = {
    ...typography.h6,
    color: colors.gray[800],
  };

  const addButtonStyle: ViewStyle = {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 6,
  };

  const addButtonTextStyle: TextStyle = {
    ...typography.caption,
    color: colors.white,
    fontWeight: "500",
  };

  const itemContainerStyle: ViewStyle = {
    marginBottom: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.gray[50],
    borderRadius: 8,
  };

  const removeButtonStyle: ViewStyle = {
    backgroundColor: colors.red[500],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 4,
    alignSelf: "flex-end",
    marginTop: spacing[2],
  };

  const removeButtonTextStyle: TextStyle = {
    ...typography.caption,
    color: colors.white,
    fontSize: 12,
  };

  const canAdd = !maxItems || items.length < maxItems;
  const canRemove = items.length > minItems;

  return (
    <View style={containerStyle}>
      <View style={headerStyle}>
        {title && <Text style={titleTextStyle}>{title}</Text>}
        {canAdd && (
          <TouchableOpacity style={addButtonStyle} onPress={onAdd}>
            <Text style={addButtonTextStyle}>{addButtonText}</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.map((item, index) => (
        <View key={index} style={itemContainerStyle}>
          {children(index, () => onRemove(index))}
          {canRemove && (
            <TouchableOpacity
              style={removeButtonStyle}
              onPress={() => onRemove(index)}
            >
              <Text style={removeButtonTextStyle}>제거</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};
