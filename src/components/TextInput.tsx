import React from "react";
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { COLORS, SIZES } from "../constants";

interface CustomTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  required = false,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <RNTextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={COLORS.GRAY}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.MEDIUM,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.BLACK,
    marginBottom: SIZES.SMALL / 2,
  },
  required: {
    color: COLORS.ERROR,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: 8,
    paddingHorizontal: SIZES.MEDIUM,
    paddingVertical: SIZES.SMALL,
    fontSize: 16,
    backgroundColor: COLORS.WHITE,
    color: COLORS.BLACK,
  },
  inputError: {
    borderColor: COLORS.ERROR,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.ERROR,
    marginTop: SIZES.SMALL / 2,
  },
});

export default TextInput;
