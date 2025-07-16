import React from "react";
import { TextInput as RNTextInput, TextInputProps } from "react-native";
import { formStyles } from "../styles/formStyles";

interface CustomTextInputProps extends TextInputProps {
  error?: boolean;
}

const TextInput: React.FC<CustomTextInputProps> = ({
  style,
  error,
  multiline,
  ...props
}) => {
  return (
    <RNTextInput
      style={[
        formStyles.input,
        multiline && formStyles.inputMultiline,
        error && formStyles.inputError,
        style,
      ]}
      {...props}
    />
  );
};

export default TextInput;
