import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDataSync } from "../hooks";
import { COLORS } from "../constants";

interface SyncStatusBarProps {
  onSyncPress?: () => void;
}

export const SyncStatusBar: React.FC<SyncStatusBarProps> = ({
  onSyncPress,
}) => {
  const { isOnline, lastSyncTime, syncStatus } = useDataSync();

  const getStatusColor = () => {
    if (!isOnline) return COLORS.WARNING;
    if (syncStatus === "syncing") return COLORS.INFO;
    if (syncStatus === "error") return COLORS.ERROR;
    return COLORS.SUCCESS;
  };

  const getStatusText = () => {
    if (!isOnline) return "오프라인";
    if (syncStatus === "syncing") return "동기화 중...";
    if (syncStatus === "error") return "동기화 실패";
    return "동기화 완료";
  };

  const getStatusIcon = () => {
    if (!isOnline) return "cloud-offline-outline";
    if (syncStatus === "syncing") return "sync-outline";
    if (syncStatus === "error") return "warning-outline";
    return "checkmark-circle-outline";
  };

  return (
    <View style={[styles.container, { backgroundColor: getStatusColor() }]}>
      <View style={styles.statusContainer}>
        <Ionicons name={getStatusIcon()} size={16} color="white" />
        <Text style={styles.statusText}>{getStatusText()}</Text>
        {lastSyncTime && (
          <Text style={styles.timeText}>
            {new Date(lastSyncTime).toLocaleTimeString()}
          </Text>
        )}
      </View>
      {isOnline && syncStatus !== "syncing" && onSyncPress && (
        <TouchableOpacity onPress={onSyncPress} style={styles.syncButton}>
          <Ionicons name="refresh-outline" size={16} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.SUCCESS,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 6,
  },
  timeText: {
    color: "white",
    fontSize: 10,
    marginLeft: 8,
    opacity: 0.8,
  },
  syncButton: {
    padding: 4,
  },
});
