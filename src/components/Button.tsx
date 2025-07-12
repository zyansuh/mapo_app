import React from "react";
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from "react-native";
import { buttonStyles } from "../styles";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  loading = false,
  disabled,
  style,
  ...props
}) => {
  const buttonStyle =
    variant === "primary" ? buttonStyles.primary : buttonStyles.secondary;
  const textStyle =
    variant === "primary"
      ? buttonStyles.buttonText
      : buttonStyles.secondaryButtonText;

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[buttonStyle, style, isDisabled && { opacity: 0.6 }]}
      disabled={isDisabled}
      {...props}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === "primary" ? "#fff" : "#007AFF"}
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={textStyle}>{loading ? "로딩 중..." : title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
