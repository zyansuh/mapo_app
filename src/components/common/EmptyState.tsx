// 빈 상태 컴포넌트

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  actionStyle?: ViewStyle;
  actionTextStyle?: TextStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  style,
  titleStyle,
  descriptionStyle,
  actionStyle,
  actionTextStyle,
}) => {
  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[8],
    ...style,
  };

  const iconContainerStyle: ViewStyle = {
    marginBottom: spacing[4],
  };

  const titleContainerStyle: ViewStyle = {
    marginBottom: description ? spacing[2] : spacing[4],
  };

  const descriptionContainerStyle: ViewStyle = {
    marginBottom: actionText ? spacing[6] : 0,
  };

  const actionButtonStyle: ViewStyle = {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: 8,
    ...actionStyle,
  };

  return (
    <View style={containerStyle}>
      {icon && <View style={iconContainerStyle}>{icon}</View>}

      <View style={titleContainerStyle}>
        <Text
          style={[
            typography.h5,
            { color: colors.gray[700], textAlign: "center" },
            titleStyle,
          ]}
        >
          {title}
        </Text>
      </View>

      {description && (
        <View style={descriptionContainerStyle}>
          <Text
            style={[
              typography.body2,
              { color: colors.gray[500], textAlign: "center" },
              descriptionStyle,
            ]}
          >
            {description}
          </Text>
        </View>
      )}

      {actionText && onAction && (
        <TouchableOpacity style={actionButtonStyle} onPress={onAction}>
          <Text
            style={[
              typography.button,
              { color: colors.white },
              actionTextStyle,
            ]}
          >
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// 기본 빈 상태들
export const EmptyCompanies: React.FC<{ onAddCompany?: () => void }> = ({
  onAddCompany,
}) => (
  <EmptyState
    title="등록된 회사가 없습니다"
    description="새로운 회사를 등록하여 거래를 시작해보세요."
    actionText="회사 등록"
    onAction={onAddCompany}
  />
);

export const EmptyDeliveries: React.FC<{ onAddDelivery?: () => void }> = ({
  onAddDelivery,
}) => (
  <EmptyState
    title="등록된 배송이 없습니다"
    description="새로운 배송을 등록하여 배송 관리를 시작해보세요."
    actionText="배송 등록"
    onAction={onAddDelivery}
  />
);

export const EmptyInvoices: React.FC<{ onAddInvoice?: () => void }> = ({
  onAddInvoice,
}) => (
  <EmptyState
    title="등록된 계산서가 없습니다"
    description="새로운 계산서를 등록하여 정산 관리를 시작해보세요."
    actionText="계산서 등록"
    onAction={onAddInvoice}
  />
);

export const EmptyProducts: React.FC<{ onAddProduct?: () => void }> = ({
  onAddProduct,
}) => (
  <EmptyState
    title="등록된 상품이 없습니다"
    description="새로운 상품을 등록하여 상품 관리를 시작해보세요."
    actionText="상품 등록"
    onAction={onAddProduct}
  />
);

export const EmptySearchResults: React.FC<{ searchTerm?: string }> = ({
  searchTerm,
}) => (
  <EmptyState
    title="검색 결과가 없습니다"
    description={
      searchTerm
        ? `"${searchTerm}"에 대한 검색 결과가 없습니다.`
        : "검색 조건을 변경해보세요."
    }
  />
);

export const EmptyFavorites: React.FC = () => (
  <EmptyState
    title="즐겨찾기가 없습니다"
    description="자주 사용하는 항목을 즐겨찾기에 추가해보세요."
  />
);

export const EmptyRecent: React.FC = () => (
  <EmptyState
    title="최근 항목이 없습니다"
    description="최근에 사용한 항목들이 여기에 표시됩니다."
  />
);

export const EmptyNotifications: React.FC = () => (
  <EmptyState
    title="알림이 없습니다"
    description="새로운 알림이 있으면 여기에 표시됩니다."
  />
);

export const EmptyOfflineData: React.FC<{ onSync?: () => void }> = ({
  onSync,
}) => (
  <EmptyState
    title="오프라인 데이터가 없습니다"
    description="인터넷에 연결되어 있지 않아 데이터를 불러올 수 없습니다."
    actionText="동기화 시도"
    onAction={onSync}
  />
);
