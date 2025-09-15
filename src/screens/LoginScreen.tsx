import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login, register, isLoading, error, clearError } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNumber: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "이메일을 입력해주세요.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "유효한 이메일을 입력해주세요.";
    }

    if (!formData.password) {
      errors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 6) {
      errors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
    }

    if (!isLoginMode) {
      if (!formData.name) {
        errors.name = "이름을 입력해주세요.";
      }

      if (formData.confirmPassword !== formData.password) {
        errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    clearError();

    if (isLoginMode) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // 로그인 성공 시 홈 화면으로 이동
        navigation.navigate("Home" as never);
      } else {
        Alert.alert("로그인 실패", result.error || "로그인에 실패했습니다.");
      }
    } else {
      const result = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phoneNumber: formData.phoneNumber || undefined,
      });

      if (result.success) {
        Alert.alert("회원가입 성공", "회원가입이 완료되었습니다.", [
          { text: "확인", onPress: () => setIsLoginMode(true) },
        ]);
      } else {
        Alert.alert(
          "회원가입 실패",
          result.error || "회원가입에 실패했습니다."
        );
      }
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phoneNumber: "",
    });
    setFormErrors({});
    clearError();
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>마포종합식품</Text>
          <Text style={styles.subtitle}>관리프로그램</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isLoginMode ? "로그인" : "회원가입"}
          </Text>

          {!isLoginMode && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={[styles.input, formErrors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, name: text }))
                }
                placeholder="이름을 입력하세요"
                autoCapitalize="words"
              />
              {formErrors.name && (
                <Text style={styles.errorText}>{formErrors.name}</Text>
              )}
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={[styles.input, formErrors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              placeholder="이메일을 입력하세요"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {formErrors.email && (
              <Text style={styles.errorText}>{formErrors.email}</Text>
            )}
          </View>

          {!isLoginMode && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>전화번호 (선택사항)</Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, phoneNumber: text }))
                }
                placeholder="전화번호를 입력하세요"
                keyboardType="phone-pad"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={[styles.input, formErrors.password && styles.inputError]}
              value={formData.password}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, password: text }))
              }
              placeholder="비밀번호를 입력하세요"
              secureTextEntry
            />
            {formErrors.password && (
              <Text style={styles.errorText}>{formErrors.password}</Text>
            )}
          </View>

          {!isLoginMode && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>비밀번호 확인</Text>
              <TextInput
                style={[
                  styles.input,
                  formErrors.confirmPassword && styles.inputError,
                ]}
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, confirmPassword: text }))
                }
                placeholder="비밀번호를 다시 입력하세요"
                secureTextEntry
              />
              {formErrors.confirmPassword && (
                <Text style={styles.errorText}>
                  {formErrors.confirmPassword}
                </Text>
              )}
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isLoginMode ? "로그인" : "회원가입"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
            <Text style={styles.toggleButtonText}>
              {isLoginMode
                ? "계정이 없으신가요? 회원가입"
                : "이미 계정이 있으신가요? 로그인"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  errorContainer: {
    marginBottom: 16,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButton: {
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#3498db",
    fontSize: 14,
  },
});

export default LoginScreen;
