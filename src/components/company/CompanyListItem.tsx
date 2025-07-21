import React, { memo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Company } from "../../types";
import { COLORS } from "../../styles/colors";
import Card from "../common/Card";

interface CompanyListItemProps {
  company: Company;
  onPress: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
  onToggleFavorite: (company: Company) => void;
  onCall?: (phoneNumber: string) => void;
  showActions?: boolean;
}

const CompanyListItem = memo<CompanyListItemProps>(
  ({
    company,
    onPress,
    onEdit,
    onDelete,
    onToggleFavorite,
    onCall,
    showActions = true,
  }) => {
    const handlePress = useCallback(() => {
      onPress(company);
    }, [onPress, company]);

    const handleEdit = useCallback(() => {
      onEdit(company);
    }, [onEdit, company]);

    const handleDelete = useCallback(() => {
      Alert.alert("회사 삭제", `${company.name}을(를) 삭제하시겠습니까?`, [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => onDelete(company),
        },
      ]);
    }, [onDelete, company]);

    const handleToggleFavorite = useCallback(() => {
      onToggleFavorite(company);
    }, [onToggleFavorite, company]);

    const handleCall = useCallback(() => {
      if (company.phoneNumber && onCall) {
        onCall(company.phoneNumber);
      } else if (company.phoneNumber) {
        Linking.openURL(`tel:${company.phoneNumber}`);
      }
    }, [company.phoneNumber, onCall]);

    const getTypeColor = useCallback((type: string) => {
      switch (type) {
        case "고객사":
          return COLORS.primary;
        case "공급업체":
          return COLORS.success;
        case "협력업체":
          return COLORS.warning;
        case "하청업체":
          return COLORS.primaryLight;
        default:
          return COLORS.text;
      }
    }, []);

    return (
      <Card style={styles.card}>
        <TouchableOpacity onPress={handlePress} style={styles.container}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={[styles.name, { color: COLORS.text }]}>
                {company.name}
              </Text>
              <View style={styles.typeRow}>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: getTypeColor(company.type) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      {
                        color: getTypeColor(company.type),
                      },
                    ]}
                  >
                    {company.type}
                  </Text>
                </View>
                {company.isFavorite && (
                  <Ionicons
                    name="star"
                    size={16}
                    color={
                      company.isFavorite ? COLORS.warning : COLORS.textSecondary
                    }
                  />
                )}
              </View>
            </View>
            <Text style={[styles.region, { color: COLORS.textSecondary }]}>
              {company.region}
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={[styles.infoText, { color: COLORS.textSecondary }]}>
                {company.address}
              </Text>
            </View>

            {company.phoneNumber && (
              <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
                <Ionicons name="call" size={16} color={COLORS.primary} />
                <Text style={[styles.infoText, { color: COLORS.primary }]}>
                  {company.phoneNumber}
                </Text>
              </TouchableOpacity>
            )}

            {company.businessNumber && (
              <View style={styles.infoRow}>
                <Ionicons
                  name="business-outline"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text
                  style={[styles.infoText, { color: COLORS.textSecondary }]}
                >
                  {company.businessNumber}
                </Text>
              </View>
            )}

            {company.memo && (
              <View style={styles.infoRow}>
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text
                  style={[styles.infoText, { color: COLORS.textSecondary }]}
                  numberOfLines={2}
                >
                  {company.memo}
                </Text>
              </View>
            )}
          </View>

          {showActions && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleEdit}
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={COLORS.primary}
                />
                <Text style={[styles.actionText, { color: COLORS.primary }]}>
                  수정
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDelete}
              >
                <Ionicons name="trash" size={18} color={COLORS.error} />
                <Text style={[styles.actionText, { color: COLORS.error }]}>
                  삭제
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleToggleFavorite}
              >
                <Ionicons
                  name={company.isFavorite ? "star" : "star-outline"}
                  size={18}
                  color={company.isFavorite ? "#ffc107" : "#6c757d"}
                />
                <Text
                  style={[
                    styles.actionText,
                    {
                      color: company.isFavorite ? "#ffc107" : "#6c757d",
                    },
                  ]}
                >
                  {company.isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Card>
    );
  }
);

CompanyListItem.displayName = "CompanyListItem";

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  region: {
    fontSize: 14,
  },
  content: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default CompanyListItem;
