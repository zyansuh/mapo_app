import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useCompany } from "../hooks";
import { COLORS, SIZES } from "../constants";
import { Button } from "../components";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "CompanyDetail">;

export const CompanyDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { companyId } = route.params;

  const { getCompanyById, deleteCompany } = useCompany();
  const company = getCompanyById(companyId);

  if (!company) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>업체를 찾을 수 없습니다.</Text>
        <Button title="목록으로 돌아가기" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleEdit = () => {
    navigation.navigate("CompanyEdit", { companyId: company.id });
  };

  const handleDelete = () => {
    Alert.alert(
      "업체 삭제",
      `${company.name}을(를) 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCompany(company.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert("오류", "업체 삭제에 실패했습니다.");
            }
          },
        },
      ]
    );
  };

  const handleCall = () => {
    const phoneNumber = company.phoneNumber.replace(/[^0-9]/g, "");
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    if (company.email) {
      Linking.openURL(`mailto:${company.email}`);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "고객사":
        return "#4CAF50";
      case "협력업체":
        return "#2196F3";
      case "공급업체":
        return "#FF9800";
      case "하청업체":
        return "#9C27B0";
      default:
        return "#607D8B";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 헤더 섹션 */}
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleSection}>
            <Text style={styles.companyName}>{company.name}</Text>
            <View
              style={[
                styles.typeTag,
                { backgroundColor: getTypeColor(company.type) },
              ]}
            >
              <Text style={styles.typeText}>{company.type}</Text>
            </View>
          </View>
          {company.contactPerson && (
            <Text style={styles.contactPerson}>
              담당자: {company.contactPerson}
            </Text>
          )}
        </View>
      </LinearGradient>

      {/* 상세 정보 섹션 */}
      <View style={styles.content}>
        {/* 연락처 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>연락처 정보</Text>

          <TouchableOpacity style={styles.infoCard} onPress={handleCall}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📞</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>전화번호</Text>
                <Text style={styles.infoValue}>{company.phoneNumber}</Text>
              </View>
              <Text style={styles.actionIcon}>→</Text>
            </View>
          </TouchableOpacity>

          {company.email && (
            <TouchableOpacity style={styles.infoCard} onPress={handleEmail}>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📧</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>이메일</Text>
                  <Text style={styles.infoValue}>{company.email}</Text>
                </View>
                <Text style={styles.actionIcon}>→</Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>주소</Text>
                <Text style={styles.infoValue}>{company.address}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 업체 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>업체 정보</Text>

          {company.businessNumber && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>🏛️</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>사업자등록번호</Text>
                  <Text style={styles.infoValue}>{company.businessNumber}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>등록일</Text>
                <Text style={styles.infoValue}>
                  {formatDate(company.createdAt)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🔄</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>최종 수정일</Text>
                <Text style={styles.infoValue}>
                  {formatDate(company.updatedAt)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 메모 */}
        {company.memo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>메모</Text>
            <View style={styles.memoCard}>
              <Text style={styles.memoText}>{company.memo}</Text>
            </View>
          </View>
        )}

        {/* 액션 버튼들 */}
        <View style={styles.actionSection}>
          <Button
            title="수정하기"
            onPress={handleEdit}
            style={styles.actionButton}
          />
          <Button
            title="삭제하기"
            onPress={handleDelete}
            variant="secondary"
            style={[styles.actionButton, styles.deleteButton]}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: SIZES.LARGE,
  },
  headerContent: {
    alignItems: "center",
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 12,
  },
  companyName: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.WHITE,
    textAlign: "center",
    marginBottom: 12,
  },
  typeTag: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontWeight: "600",
  },
  contactPerson: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
    padding: SIZES.LARGE,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
    textAlign: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  actionIcon: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    marginLeft: 8,
  },
  memoCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  memoText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  actionSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: COLORS.ERROR,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.LARGE,
  },
  notFoundText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default CompanyDetailScreen;
