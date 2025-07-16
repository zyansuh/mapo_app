import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import { formStyles } from "../styles/formStyles";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "disabled";
  size?: "small" | "normal" | "large";
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "normal",
  style,
  disabled,
  ...props
}) => {
  const getButtonStyle = () => {
    if (disabled || variant === "disabled") {
      return [formStyles.button, formStyles.buttonDisabled];
    }

    switch (variant) {
      case "secondary":
        return [formStyles.button, formStyles.buttonSecondary];
      case "primary":
      default:
        return [formStyles.button, formStyles.buttonPrimary];
    }
  };

  const getTextStyle = () => {
    if (disabled || variant === "disabled") {
      return formStyles.buttonTextDisabled;
    }

    switch (variant) {
      case "secondary":
        return formStyles.buttonTextSecondary;
      case "primary":
      default:
        return formStyles.buttonText;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={disabled || variant === "disabled"}
      {...props}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
