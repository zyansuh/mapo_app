import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { formStyles } from "../styles/formStyles";

interface InputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  containerStyle?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  required = false,
  error,
  style,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[formStyles.fieldContainer, containerStyle]}>
      {label && (
        <Text style={formStyles.label}>
          {label}
          {required && <Text style={formStyles.requiredMark}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[formStyles.input, error && formStyles.inputError, style]}
        {...props}
      />
      {error && <Text style={formStyles.errorText}>{error}</Text>}
    </View>
  );
};

export default Input;
