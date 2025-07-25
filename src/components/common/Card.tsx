import React, { memo, ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "../../styles/colors";

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  elevation?: number;
  borderRadius?: number;
  backgroundColor?: string;
  shadowColor?: string;
}

const Card = memo<CardProps>(
  ({
    children,
    style,
    padding = 16,
    margin = 8,
    elevation = 2,
    borderRadius = 8,
    backgroundColor,
    shadowColor,
  }) => {
    const cardStyle: ViewStyle = {
      backgroundColor: backgroundColor || COLORS.white,
      padding,
      margin,
      borderRadius,
      shadowColor: shadowColor || COLORS.text,
      shadowOffset: {
        width: 0,
        height: elevation / 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: elevation,
      elevation,
      ...style,
    };

    return <View style={cardStyle}>{children}</View>;
  }
);

Card.displayName = "Card";

export default Card;
