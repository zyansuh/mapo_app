import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Share,
  Dimensions,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useTheme } from "../hooks/useTheme";
import { Company, QRCodeData } from "../types";
import { qrCodeService } from "../services/qrCodeService";

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  company?: Company;
  qrData?: QRCodeData;
  title?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  visible,
  onClose,
  company,
  qrData,
  title = "QR 코드",
}) => {
  const { theme } = useTheme();
  const [qrRef, setQrRef] = useState<any>(null);

  // QR 데이터 준비
  const getQRData = (): QRCodeData | null => {
    if (qrData) return qrData;
    if (company) return qrCodeService.generateCompanyQRData(company);
    return null;
  };

  const currentQRData = getQRData();
  if (!currentQRData) return null;

  const qrString = qrCodeService.qrDataToString(currentQRData);
  const qrOptions = company
    ? qrCodeService.getCompanyQROptions(company)
    : qrCodeService.getDefaultOptions();

  // QR 코드 공유
  const handleShare = async () => {
    try {
      if (company) {
        const shareText = qrCodeService.generateShareText(company);
        await Share.share({
          message: shareText,
          title: `${company.name} 업체 정보`,
        });
      } else {
        await Share.share({
          message: qrString,
          title: title,
        });
      }
    } catch (error) {
      console.error("공유 실패:", error);
      Alert.alert("오류", "공유 중 오류가 발생했습니다.");
    }
  };

  // QR 코드 이미지 저장
  const handleSaveImage = () => {
    if (qrRef) {
      qrRef.toDataURL((dataURL: string) => {
        // TODO: 이미지 저장 기능 구현
        Alert.alert("알림", "QR 코드 이미지 저장 기능이 곧 구현됩니다.");
      });
    }
  };

  const styles = createStyles(theme.colors);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 업체 정보 (업체 QR인 경우) */}
          {company && (
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{company.name}</Text>
              <Text style={styles.companyDetails}>
                {company.type} • {company.region}
              </Text>
              <Text style={styles.companyPhone}>{company.phoneNumber}</Text>
            </View>
          )}

          {/* QR 코드 */}
          <View style={styles.qrContainer}>
            <QRCode
              value={qrString}
              size={qrOptions.size}
              color={qrOptions.foregroundColor}
              backgroundColor={qrOptions.backgroundColor}
              logoSize={30}
              logoMargin={2}
              logoBorderRadius={15}
              quietZone={qrOptions.includeMargin ? 10 : 0}
              getRef={(ref) => setQrRef(ref)}
            />
          </View>

          {/* 설명 텍스트 */}
          <View style={styles.description}>
            <Text style={styles.descriptionText}>
              {company
                ? "이 QR 코드를 스캔하여 업체 정보를 확인할 수 있습니다."
                : "QR 코드를 스캔하여 정보를 확인할 수 있습니다."}
            </Text>
          </View>

          {/* 액션 버튼들 */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionText}>공유</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSaveImage}
            >
              <Text style={styles.actionIcon}>💾</Text>
              <Text style={styles.actionText}>저장</Text>
            </TouchableOpacity>
          </View>

          {/* QR 데이터 미리보기 (개발용) */}
          {__DEV__ && (
            <View style={styles.debugInfo}>
              <Text style={styles.debugTitle}>QR 데이터:</Text>
              <Text style={styles.debugText} numberOfLines={5}>
                {qrString}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: any) => {
  const { width } = Dimensions.get("window");
  const modalWidth = Math.min(width * 0.9, 400);

  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      width: modalWidth,
      maxHeight: "80%",
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    closeText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "bold",
    },
    companyInfo: {
      alignItems: "center",
      marginBottom: 20,
      paddingHorizontal: 16,
    },
    companyName: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
      textAlign: "center",
    },
    companyDetails: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    companyPhone: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: "500",
    },
    qrContainer: {
      padding: 20,
      backgroundColor: colors.white,
      borderRadius: 16,
      marginBottom: 20,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    description: {
      paddingHorizontal: 16,
      marginBottom: 20,
    },
    descriptionText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    actions: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    actionButton: {
      alignItems: "center",
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.background,
      minWidth: 80,
    },
    actionIcon: {
      fontSize: 24,
      marginBottom: 4,
    },
    actionText: {
      fontSize: 12,
      color: colors.text,
      fontWeight: "500",
    },
    debugInfo: {
      width: "100%",
      padding: 12,
      backgroundColor: colors.background,
      borderRadius: 8,
      marginTop: 16,
    },
    debugTitle: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 4,
    },
    debugText: {
      fontSize: 10,
      color: colors.textSecondary,
      fontFamily: "monospace",
    },
  });
};
