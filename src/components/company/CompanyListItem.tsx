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
import { useTheme } from "../../hooks/useTheme";
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
    const { theme } = useTheme();

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

    const getTypeColor = useCallback(
      (type: string) => {
        switch (type) {
          case "고객사":
            return theme.colors.primary;
          case "공급업체":
            return theme.colors.success;
          case "협력업체":
            return theme.colors.warning;
          case "하청업체":
            return theme.colors.secondary;
          default:
            return theme.colors.text;
        }
      },
      [theme.colors]
    );

    return (
      <Card style={styles.card}>
        <TouchableOpacity onPress={handlePress} style={styles.container}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={[styles.name, { color: theme.colors.text }]}>
                {company.name}
              </Text>
              {showActions && (
                <TouchableOpacity
                  onPress={handleToggleFavorite}
                  style={styles.favoriteButton}
                >
                  <Ionicons
                    name={company.isFavorite ? "heart" : "heart-outline"}
                    size={20}
                    color={
                      company.isFavorite
                        ? "#ff6b6b"
                        : theme.colors.textSecondary
                    }
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.typeRow}>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: getTypeColor(company.type) },
                ]}
              >
                <Text style={styles.typeText}>{company.type}</Text>
              </View>
              <Text
                style={[styles.region, { color: theme.colors.textSecondary }]}
              >
                {company.region}
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            {company.contactPerson && (
              <View style={styles.infoRow}>
                <Ionicons
                  name="person"
                  size={16}
                  color={theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.infoText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {company.contactPerson}
                </Text>
              </View>
            )}

            {company.phoneNumber && (
              <TouchableOpacity onPress={handleCall} style={styles.infoRow}>
                <Ionicons name="call" size={16} color={theme.colors.primary} />
                <Text
                  style={[styles.infoText, { color: theme.colors.primary }]}
                >
                  {company.phoneNumber}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.infoRow}>
              <Ionicons
                name="location"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[styles.infoText, { color: theme.colors.textSecondary }]}
                numberOfLines={2}
              >
                {company.address}
              </Text>
            </View>

            {company.businessNumber && (
              <View style={styles.infoRow}>
                <Ionicons
                  name="business"
                  size={16}
                  color={theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.infoText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {company.businessNumber}
                </Text>
              </View>
            )}
          </View>

          {showActions && (
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={handleEdit}
                style={styles.actionButton}
              >
                <Ionicons
                  name="pencil"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.actionText, { color: theme.colors.primary }]}
                >
                  수정
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                style={styles.actionButton}
              >
                <Ionicons name="trash" size={18} color={theme.colors.error} />
                <Text
                  style={[styles.actionText, { color: theme.colors.error }]}
                >
                  삭제
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
