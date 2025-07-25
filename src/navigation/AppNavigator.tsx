import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  HomeScreen,
  CompanyListScreen,
  CompanyDetailScreen,
  CompanyEditScreen,
  CompanyImportScreen,
  DirectImportScreen,
  InvoiceManagementScreen,
  InvoiceEditScreen,
  InvoiceDetailScreen,
  CompanySalesAnalysisScreen,
  CompanySalesDetailScreen,
  DeliveryManagementScreen,
  DeliveryDetailScreen,
  DeliveryEditScreen,
} from "../screens";
import { COLORS } from "../constants";
import { Ionicons } from "@expo/vector-icons";

// navigation 타입들을 types에서 import
import { RootStackParamList, TabParamList } from "../types";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "CompanyList") {
            iconName = focused ? "business" : "business-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E5EA",
          borderTopWidth: 1,
          height:
            Platform.OS === "ios"
              ? 80 + insets.bottom
              : 70 + Math.max(insets.bottom, 10),
          paddingBottom:
            Platform.OS === "ios"
              ? insets.bottom + 5
              : Math.max(insets.bottom, 10),
          paddingTop: 8,
          paddingHorizontal: 10,
          elevation: 8, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "홈" }}
      />
      <Tab.Screen
        name="CompanyList"
        component={CompanyListScreen}
        options={{ title: "거래처" }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.PRIMARY,
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompanyDetail"
          component={CompanyDetailScreen}
          options={({ route }) => ({
            title: "거래처 상세",
            headerBackTitle: "뒤로",
          })}
        />
        <Stack.Screen
          name="CompanyEdit"
          component={CompanyEditScreen}
          options={({ route }) => ({
            title: (route.params as any)?.companyId
              ? "거래처 수정"
              : "거래처 등록",
            headerBackTitle: "뒤로",
          })}
        />
        <Stack.Screen
          name="CompanyImport"
          component={CompanyImportScreen}
          options={{
            title: "거래처 일괄 등록",
            headerBackTitle: "뒤로",
          }}
        />
        <Stack.Screen
          name="DirectImport"
          component={DirectImportScreen}
          options={{
            title: "데이터베이스 직접 등록",
            headerBackTitle: "뒤로",
          }}
        />
        <Stack.Screen
          name="InvoiceManagement"
          component={InvoiceManagementScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="InvoiceEdit"
          component={InvoiceEditScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="InvoiceDetail"
          component={InvoiceDetailScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CompanySalesAnalysis"
          component={CompanySalesAnalysisScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CompanySalesDetail"
          component={CompanySalesDetailScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DeliveryManagement"
          component={DeliveryManagementScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DeliveryDetail"
          component={DeliveryDetailScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DeliveryEdit"
          component={DeliveryEditScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
