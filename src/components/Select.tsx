import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ViewStyle,
} from "react-native";
import { COLORS, SIZES } from "../constants";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  style?: ViewStyle;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = "선택하세요",
  style,
  error,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption?.label || placeholder;

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsModalVisible(false);
  };

  const renderOption = ({ item }: { item: SelectOption }) => (
    <TouchableOpacity
      style={[styles.option, item.value === value && styles.selectedOption]}
      onPress={() => handleSelect(item.value)}
    >
      <Text
        style={[
          styles.optionText,
          item.value === value && styles.selectedOptionText,
        ]}
      >
        {item.label}
      </Text>
      {item.value === value && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.selectButton, error && styles.selectButtonError]}
        onPress={() => setIsModalVisible(true)}
      >
        <Text
          style={[styles.selectText, !selectedOption && styles.placeholderText]}
        >
          {displayValue}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || "선택"}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  selectButton: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectButtonError: {
    borderColor: COLORS.ERROR,
    borderWidth: 2,
  },
  selectText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  placeholderText: {
    color: "#999",
  },
  arrow: {
    fontSize: 12,
    color: "#666",
  },
  errorText: {
    fontSize: 14,
    color: COLORS.ERROR,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    width: "80%",
    maxHeight: "60%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#666",
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  selectedOption: {
    backgroundColor: "#f0f8ff",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  selectedOptionText: {
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: "bold",
  },
});

export default Select;
