import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { COLORS, SIZES } from "../constants";

interface PickerOption {
  label: string;
  value: string;
}

interface PickerProps {
  label: string;
  options: PickerOption[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export const Picker: React.FC<PickerProps> = ({
  label,
  options,
  selectedValue,
  onValueChange,
  placeholder = "선택하세요",
  error,
  required = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <TouchableOpacity
        style={[styles.selector, error && styles.selectorError]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[
            styles.selectorText,
            !selectedOption && styles.placeholderText,
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label} 선택</Text>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedValue === item.value && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedValue === item.value && styles.selectedOptionText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.MEDIUM,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.BLACK,
    marginBottom: SIZES.SMALL / 2,
  },
  required: {
    color: COLORS.ERROR,
  },
  selector: {
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: 8,
    paddingHorizontal: SIZES.MEDIUM,
    paddingVertical: SIZES.SMALL,
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorError: {
    borderColor: COLORS.ERROR,
  },
  selectorText: {
    fontSize: 16,
    color: COLORS.BLACK,
    flex: 1,
  },
  placeholderText: {
    color: COLORS.GRAY,
  },
  arrow: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.ERROR,
    marginTop: SIZES.SMALL / 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.LARGE,
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SIZES.LARGE,
    width: "100%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.BLACK,
    textAlign: "center",
    marginBottom: SIZES.LARGE,
  },
  option: {
    paddingVertical: SIZES.MEDIUM,
    paddingHorizontal: SIZES.SMALL,
    borderRadius: 8,
    marginBottom: SIZES.SMALL / 2,
  },
  selectedOption: {
    backgroundColor: COLORS.PRIMARY,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.BLACK,
  },
  selectedOptionText: {
    color: COLORS.WHITE,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: SIZES.LARGE,
    paddingVertical: SIZES.MEDIUM,
    backgroundColor: COLORS.GRAY,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontWeight: "600",
  },
});

export default Picker;
