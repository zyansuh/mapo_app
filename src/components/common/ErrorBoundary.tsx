// 에러 바운더리 컴포넌트

import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // 에러 로깅
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // 외부 에러 핸들러 호출
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetOnPropsChange && resetKeys) {
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

// 에러 폴백 컴포넌트
interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset }) => {
  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
  };

  const headerStyle: ViewStyle = {
    alignItems: "center",
    marginBottom: spacing[6],
  };

  const titleStyle: TextStyle = {
    ...typography.h4,
    color: colors.red[600],
    textAlign: "center",
    marginBottom: spacing[2],
  };

  const descriptionStyle: TextStyle = {
    ...typography.body2,
    color: colors.gray[600],
    textAlign: "center",
    lineHeight: 24,
  };

  const errorContainerStyle: ViewStyle = {
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    padding: spacing[4],
    marginBottom: spacing[6],
  };

  const errorTitleStyle: TextStyle = {
    ...typography.caption,
    color: colors.gray[700],
    fontWeight: "600",
    marginBottom: spacing[2],
  };

  const errorTextStyle: TextStyle = {
    ...typography.caption,
    color: colors.gray[600],
    fontFamily: "monospace",
    lineHeight: 18,
  };

  const buttonContainerStyle: ViewStyle = {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[3],
  };

  const retryButtonStyle: ViewStyle = {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: 8,
  };

  const retryButtonTextStyle: TextStyle = {
    ...typography.button,
    color: colors.white,
  };

  const reportButtonStyle: ViewStyle = {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: 8,
  };

  const reportButtonTextStyle: TextStyle = {
    ...typography.button,
    color: colors.gray[700],
  };

  const handleReportError = () => {
    // 에러 리포트 기능 구현
    console.log("Report error:", error);
  };

  return (
    <ScrollView style={containerStyle} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={headerStyle}>
        <Text style={titleStyle}>문제가 발생했습니다</Text>
        <Text style={descriptionStyle}>
          예상치 못한 오류가 발생했습니다.{"\n"}
          잠시 후 다시 시도해주세요.
        </Text>
      </View>

      {__DEV__ && error && (
        <View style={errorContainerStyle}>
          <Text style={errorTitleStyle}>에러 정보:</Text>
          <Text style={errorTextStyle}>
            {error.name}: {error.message}
          </Text>
          {error.stack && (
            <Text style={[errorTextStyle, { marginTop: spacing[2] }]}>
              {error.stack}
            </Text>
          )}
        </View>
      )}

      <View style={buttonContainerStyle}>
        <TouchableOpacity style={retryButtonStyle} onPress={onReset}>
          <Text style={retryButtonTextStyle}>다시 시도</Text>
        </TouchableOpacity>

        <TouchableOpacity style={reportButtonStyle} onPress={handleReportError}>
          <Text style={reportButtonTextStyle}>오류 신고</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// 특정 에러 타입별 폴백 컴포넌트들
export const NetworkErrorFallback: React.FC<{ onRetry: () => void }> = ({
  onRetry,
}) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: spacing[6],
    }}
  >
    <Text
      style={[
        typography.h5,
        {
          color: colors.red[600],
          textAlign: "center",
          marginBottom: spacing[2],
        },
      ]}
    >
      네트워크 연결 오류
    </Text>
    <Text
      style={[
        typography.body2,
        {
          color: colors.gray[600],
          textAlign: "center",
          marginBottom: spacing[6],
        },
      ]}
    >
      인터넷 연결을 확인하고 다시 시도해주세요.
    </Text>
    <TouchableOpacity
      style={{
        backgroundColor: colors.primary[500],
        paddingHorizontal: spacing[6],
        paddingVertical: spacing[3],
        borderRadius: 8,
      }}
      onPress={onRetry}
    >
      <Text style={[typography.button, { color: colors.white }]}>
        다시 시도
      </Text>
    </TouchableOpacity>
  </View>
);

export const DataErrorFallback: React.FC<{ onRetry: () => void }> = ({
  onRetry,
}) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: spacing[6],
    }}
  >
    <Text
      style={[
        typography.h5,
        {
          color: colors.orange[600],
          textAlign: "center",
          marginBottom: spacing[2],
        },
      ]}
    >
      데이터 로드 오류
    </Text>
    <Text
      style={[
        typography.body2,
        {
          color: colors.gray[600],
          textAlign: "center",
          marginBottom: spacing[6],
        },
      ]}
    >
      데이터를 불러오는 중 오류가 발생했습니다.
    </Text>
    <TouchableOpacity
      style={{
        backgroundColor: colors.primary[500],
        paddingHorizontal: spacing[6],
        paddingVertical: spacing[3],
        borderRadius: 8,
      }}
      onPress={onRetry}
    >
      <Text style={[typography.button, { color: colors.white }]}>
        다시 시도
      </Text>
    </TouchableOpacity>
  </View>
);

// HOC로 에러 바운더리 적용
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, "children">
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};
