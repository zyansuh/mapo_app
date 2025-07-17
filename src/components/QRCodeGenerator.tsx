import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Company } from "../types";
import { useTheme } from "../hooks/useTheme";

interface QRCodeGeneratorProps {
  visible: boolean;
  onClose: () => void;
  data: Company | null;
  type: "company";
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  visible,
  onClose,
  data,
  type,
}) => {
  const { theme } = useTheme();
  const [qrRef, setQrRef] = useState<any>(null);

  const generateQRData = () => {
    if (!data) return "";

    const company = data as Company;
    return JSON.stringify({
      type: "company",
      id: company.id,
      name: company.name,
      phoneNumber: company.phoneNumber,
      address: company.address,
      businessNumber: company.businessNumber,
      contactPerson: company.contactPerson,
      email: company.email,
    });
  };

  const getTitle = () => {
    if (!data) return "QR 코드";

    const company = data as Company;
    return `${company.name} 거래처 정보`;
  };

  const getDescription = () => {
    if (!data) return "";

    const company = data as Company;
    return `전화: ${company.phoneNumber}\n주소: ${company.address}`;
  };

  const handleShare = async () => {
    try {
      if (!qrRef) {
        Alert.alert(
          "오류",
          "QR 코드를 생성하는 중입니다. 잠시 후 다시 시도해주세요."
        );
        return;
      }

      // QR 코드를 SVG에서 데이터 URL로 변환
      qrRef.toDataURL((dataURL: string) => {
        const qrData = generateQRData();
        const title = getTitle();

        Share.share({
          message: `${title}\n\nQR 코드로 정보를 공유합니다:\n${qrData}`,
          title: title,
        });
      });
    } catch (error) {
      console.error("QR 코드 공유 오류:", error);
      Alert.alert("오류", "QR 코드 공유 중 오류가 발생했습니다.");
    }
  };

  const handleSave = async () => {
    try {
      if (!qrRef) {
        Alert.alert(
          "오류",
          "QR 코드를 생성하는 중입니다. 잠시 후 다시 시도해주세요."
        );
        return;
      }

      qrRef.toDataURL(async (dataURL: string) => {
        try {
          const filename = `qr_${type}_${Date.now()}.svg`;
          const fileUri = FileSystem.documentDirectory + filename;

          // SVG 데이터를 파일로 저장
          await FileSystem.writeAsStringAsync(fileUri, dataURL, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // 파일 공유 (저장)
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
          } else {
            Alert.alert("저장 완료", `QR 코드가 저장되었습니다: ${filename}`);
          }
        } catch (error) {
          console.error("QR 코드 저장 오류:", error);
          Alert.alert("오류", "QR 코드 저장 중 오류가 발생했습니다.");
        }
      });
    } catch (error) {
      console.error("QR 코드 저장 오류:", error);
      Alert.alert("오류", "QR 코드 저장 중 오류가 발생했습니다.");
    }
  };

  const handleCopyData = () => {
    const qrData = generateQRData();
    Alert.alert("QR 코드 데이터", qrData, [
      { text: "확인" },
      {
        text: "데이터 공유",
        onPress: () => {
          Share.share({
            message: qrData,
            title: getTitle(),
          });
        },
      },
    ]);
  };

  if (!data) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View
          style={[styles.container, { backgroundColor: theme.colors.card }]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {getTitle()}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* QR 코드 */}
            <View style={styles.qrContainer}>
              <QRCode
                value={generateQRData()}
                size={200}
                color={theme.colors.text}
                backgroundColor={theme.colors.card}
                getRef={(ref) => setQrRef(ref)}
              />
            </View>

            {/* 설명 */}
            <View style={styles.descriptionContainer}>
              <Text
                style={[
                  styles.description,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {getDescription()}
              </Text>
            </View>

            {/* 안내 텍스트 */}
            <View style={styles.infoContainer}>
              <Text
                style={[styles.infoText, { color: theme.colors.textSecondary }]}
              >
                📱 QR 코드를 스캔하여 정보를 확인하세요
              </Text>
              <Text
                style={[
                  styles.infoSubtext,
                  { color: theme.colors.textSecondary },
                ]}
              >
                다른 마포 앱 사용자나 호환 앱에서 스캔 가능합니다
              </Text>
            </View>

            {/* 액션 버튼들 */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={handleShare}
              >
                <Ionicons name="share" size={20} color="white" />
                <Text style={styles.actionButtonText}>공유</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.colors.success },
                ]}
                onPress={handleSave}
              >
                <Ionicons name="download" size={20} color="white" />
                <Text style={styles.actionButtonText}>저장</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.colors.secondary },
                ]}
                onPress={handleCopyData}
              >
                <Ionicons name="copy" size={20} color="white" />
                <Text style={styles.actionButtonText}>데이터</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  qrContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  infoContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    textAlign: "center",
  },
  infoSubtext: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
