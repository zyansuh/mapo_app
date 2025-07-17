import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ContributionGraph,
} from "react-native-chart-kit";
import { useTheme } from "../../hooks/useTheme";
import { Company, CallHistoryItem } from "../../types";

const screenWidth = Dimensions.get("window").width;

interface BusinessChartProps {
  companies: Company[];
  callHistory: CallHistoryItem[];
  type: "line" | "bar" | "pie" | "contribution";
  title: string;
  data: any;
}

export const BusinessChart: React.FC<BusinessChartProps> = ({
  companies,
  callHistory,
  type,
  title,
  data,
}) => {
  const { theme } = useTheme();

  const chartConfig = {
    backgroundColor: theme.colors.card,
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) =>
      `rgba(${theme.colors.primary.slice(1)}, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: theme.colors.primary,
    },
  };

  const renderLineChart = () => {
    const monthlyData = getMonthlyCallData();

    return (
      <LineChart
        data={monthlyData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    );
  };

  const renderBarChart = () => {
    const companyData = getCompanyCallData();

    return (
      <BarChart
        data={companyData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars
        yAxisLabel=""
        yAxisSuffix=""
      />
    );
  };

  const renderPieChart = () => {
    const typeData = getCallTypeData();

    return (
      <PieChart
        data={typeData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="15"
        style={styles.chart}
      />
    );
  };

  const renderContributionChart = () => {
    const contributionData = getContributionData();

    return (
      <ContributionGraph
        values={contributionData}
        endDate={new Date()}
        numDays={105}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        tooltipDataAttrs={(value) => ({})}
      />
    );
  };

  const getMonthlyCallData = () => {
    const monthlyStats: { [key: string]: number } = {};

    // 최근 6개월 데이터 초기화
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getMonth() + 1}월`;
      monthlyStats[key] = 0;
    }

    // 통화 기록 집계
    callHistory.forEach((call) => {
      const callDate = new Date(call.timestamp);
      const monthKey = `${callDate.getMonth() + 1}월`;
      if (monthlyStats.hasOwnProperty(monthKey)) {
        monthlyStats[monthKey]++;
      }
    });

    return {
      labels: Object.keys(monthlyStats),
      datasets: [
        {
          data: Object.values(monthlyStats),
        },
      ],
    };
  };

  const getCompanyCallData = () => {
    const companyStats: { [key: string]: number } = {};

    // 상위 5개 거래처의 통화 횟수 계산
    callHistory.forEach((call) => {
      if (call.companyName) {
        companyStats[call.companyName] =
          (companyStats[call.companyName] || 0) + 1;
      }
    });

    const sortedCompanies = Object.entries(companyStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      labels: sortedCompanies.map(([name]) =>
        name.length > 6 ? `${name.slice(0, 6)}...` : name
      ),
      datasets: [
        {
          data: sortedCompanies.map(([, count]) => count),
        },
      ],
    };
  };

  const getCallTypeData = () => {
    const typeStats = {
      outgoing: 0,
      incoming: 0,
      missed: 0,
    };

    callHistory.forEach((call) => {
      typeStats[call.type]++;
    });

    const colors = [
      theme.colors.primary,
      theme.colors.success,
      theme.colors.error,
    ];

    return [
      {
        name: "발신",
        count: typeStats.outgoing,
        color: colors[0],
        legendFontColor: theme.colors.textSecondary,
        legendFontSize: 12,
      },
      {
        name: "수신",
        count: typeStats.incoming,
        color: colors[1],
        legendFontColor: theme.colors.textSecondary,
        legendFontSize: 12,
      },
      {
        name: "부재중",
        count: typeStats.missed,
        color: colors[2],
        legendFontColor: theme.colors.textSecondary,
        legendFontSize: 12,
      },
    ];
  };

  const getContributionData = () => {
    const contributions: Array<{ date: string; count: number }> = [];
    const today = new Date();

    // 최근 105일 데이터 생성
    for (let i = 104; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dateStr = date.toISOString().split("T")[0];
      const callsOnDate = callHistory.filter((call) => {
        const callDate = new Date(call.timestamp).toISOString().split("T")[0];
        return callDate === dateStr;
      }).length;

      contributions.push({
        date: dateStr,
        count: callsOnDate,
      });
    }

    return contributions;
  };

  const renderChart = () => {
    switch (type) {
      case "line":
        return renderLineChart();
      case "bar":
        return renderBarChart();
      case "pie":
        return renderPieChart();
      case "contribution":
        return renderContributionChart();
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {renderChart()}
      </ScrollView>
    </View>
  );
};

// 통계 차트 컬렉션 컴포넌트
interface StatisticsChartsProps {
  companies: Company[];
  callHistory: CallHistoryItem[];
}

export const StatisticsCharts: React.FC<StatisticsChartsProps> = ({
  companies,
  callHistory,
}) => {
  const { theme } = useTheme();

  const charts = [
    {
      type: "line" as const,
      title: "월별 통화 추이",
      description: "최근 6개월간 통화 횟수 변화",
    },
    {
      type: "bar" as const,
      title: "거래처별 통화 현황",
      description: "상위 5개 거래처 통화 횟수",
    },
    {
      type: "pie" as const,
      title: "통화 유형 분포",
      description: "발신/수신/부재중 통화 비율",
    },
    {
      type: "contribution" as const,
      title: "일별 통화 활동",
      description: "최근 105일간 일별 통화 활동도",
    },
  ];

  if (callHistory.length === 0) {
    return (
      <View
        style={[styles.emptyContainer, { backgroundColor: theme.colors.card }]}
      >
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          차트를 표시할 통화 데이터가 없습니다
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.chartsContainer}
      showsVerticalScrollIndicator={false}
    >
      {charts.map((chart, index) => (
        <View key={index} style={styles.chartWrapper}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
              {chart.title}
            </Text>
            <Text
              style={[
                styles.chartDescription,
                { color: theme.colors.textSecondary },
              ]}
            >
              {chart.description}
            </Text>
          </View>
          <BusinessChart
            companies={companies}
            callHistory={callHistory}
            type={chart.type}
            title={chart.title}
            data={{}}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
  },
  chartsContainer: {
    flex: 1,
  },
  chartWrapper: {
    marginBottom: 24,
  },
  chartHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  chartDescription: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    margin: 16,
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});
