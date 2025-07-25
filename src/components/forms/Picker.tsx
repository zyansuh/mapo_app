import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formStyles } from "../styles/formStyles";
import { modalStyles } from "../styles/modalStyles";
import { COLORS } from "../../styles/colors";

interface PickerOption {
  label: string;
  value: string;
}

interface PickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: PickerOption[];
  placeholder?: string;
  style?: any;
}

const Picker: React.FC<PickerProps> = ({
  selectedValue,
  onValueChange,
  options,
  placeholder = "선택하세요",
  style,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[formStyles.pickerButton, formStyles.picker, style]}
        onPress={() => setIsModalVisible(true)}
      >
        <Text
          style={[
            selectedOption
              ? formStyles.pickerText
              : formStyles.pickerPlaceholder,
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={[modalStyles.container, styles.pickerModal]}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>선택하세요</Text>
              <TouchableOpacity
                style={modalStyles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={modalStyles.content}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    selectedValue === option.value && styles.optionItemSelected,
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedValue === option.value &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selectedValue === option.value && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  pickerModal: {
    maxHeight: "70%",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionItemSelected: {
    backgroundColor: COLORS.primary + "10",
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: "500",
  },
});

export default Picker;
