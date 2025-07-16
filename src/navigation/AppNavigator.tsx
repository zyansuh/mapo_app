import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  HomeScreen,
  CompanyListScreen,
  CompanyDetailScreen,
  CompanyEditScreen,
  SearchScreen,
  StatisticsScreen,
  SettingsScreen,
} from "../screens";
import { COLORS } from "../constants";
import { ThemeProvider } from "../hooks/useTheme";

export type RootStackParamList = {
  Main: undefined;
  CompanyDetail: { companyId: string };
  CompanyEdit: { companyId?: string };
};

export type TabParamList = {
  Home: undefined;
  Companies: undefined;
  Search: undefined;
  Statistics: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#F5F5F5", // NEUTRAL_100
          borderTopWidth: 1,
          borderTopColor: "#D4D4D4", // NEUTRAL_300
          height:
            Platform.OS === "ios" ? 85 + insets.bottom : 70 + insets.bottom,
          paddingBottom:
            Platform.OS === "ios" ? 20 + insets.bottom : 10 + insets.bottom,
          paddingTop: 8,
          paddingHorizontal: 20,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarActiveTintColor: "#404040", // NEUTRAL_700
        tabBarInactiveTintColor: "#A3A3A3", // NEUTRAL_400
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === "Home") {
            iconName = focused ? "🏠" : "🏡";
          } else if (route.name === "Companies") {
            iconName = focused ? "🏢" : "🏬";
          } else if (route.name === "Search") {
            iconName = focused ? "🔍" : "🔎";
          } else if (route.name === "Statistics") {
            iconName = focused ? "📊" : "📈";
          } else if (route.name === "Settings") {
            iconName = focused ? "⚙️" : "⚙️";
          } else {
            iconName = "📋";
          }

          return <Text style={{ fontSize: size }}>{iconName}</Text>;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "홈" }}
      />
      <Tab.Screen
        name="Companies"
        component={CompanyListScreen}
        options={{ tabBarLabel: "업체 목록" }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: "검색" }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ tabBarLabel: "통계" }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: "설정" }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.PRIMARY,
            },
            headerTintColor: COLORS.WHITE,
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
            options={{ title: "업체 상세" }}
          />
          <Stack.Screen
            name="CompanyEdit"
            component={CompanyEditScreen}
            options={({ route }) => ({
              title: route.params?.companyId ? "업체 수정" : "업체 등록",
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};
