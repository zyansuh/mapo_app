// 로딩 스피너 컴포넌트

import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  text?: string;
  overlay?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color = colors.primary[500],
  text,
  overlay = false,
  style,
  textStyle,
}) => {
  const containerStyle: ViewStyle = {
    justifyContent: "center",
    alignItems: "center",
    ...(overlay && {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      zIndex: 1000,
    }),
    ...style,
  };

  const textContainerStyle: ViewStyle = {
    marginTop: text ? spacing[3] : 0,
  };

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <View style={textContainerStyle}>
          <Text
            style={[typography.body2, { color: colors.gray[600] }, textStyle]}
          >
            {text}
          </Text>
        </View>
      )}
    </View>
  );
};

// 전체 화면 로딩 스피너
interface FullScreenLoadingProps {
  text?: string;
  backgroundColor?: string;
}

export const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
  text = "로딩 중...",
  backgroundColor = colors.white,
}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor,
      }}
    >
      <LoadingSpinner size="large" text={text} />
    </View>
  );
};

// 인라인 로딩 스피너
interface InlineLoadingProps {
  text?: string;
  size?: "small" | "large";
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text,
  size = "small",
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: spacing[2],
      }}
    >
      <ActivityIndicator size={size} color={colors.primary[500]} />
      {text && (
        <Text
          style={[
            typography.body2,
            { marginLeft: spacing[2], color: colors.gray[600] },
          ]}
        >
          {text}
        </Text>
      )}
    </View>
  );
};

// 버튼 내부 로딩 스피너
interface ButtonLoadingProps {
  size?: "small" | "large";
  color?: string;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  size = "small",
  color = colors.white,
}) => {
  return <ActivityIndicator size={size} color={color} />;
};
