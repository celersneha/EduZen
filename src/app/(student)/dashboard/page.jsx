"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  BarChart,
  PieChart,
  LineChart,
  BookOpen,
  Clock,
  Target,
  Brain,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  LineChart as RechartsLineChart,
  Bar,
  Pie,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Label,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  // Chart configurations
  const studyTimeConfig = {
    hours: { label: "Study Hours", color: "hsl(var(--chart-1))" },
  };

  const contentMasteryConfig = {
    "Syllabus Added": { label: "Syllabus Added", color: "#22C55E" },
    "Ready to Study": { label: "Ready to Study", color: "#EAB308" },
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user) return;

      try {
        const loadingToast = toast.loading("Loading dashboard data...");
        const response = await fetch("/api/get-dashboard-metrics");
        toast.dismiss(loadingToast);

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
        } else {
          throw new Error(result.error || "Failed to load dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Data Available
          </h2>
          <p className="text-gray-600">
            Please add some subjects to see your dashboard.
          </p>
        </div>
      </div>
    );
  }

  const { keyMetrics, chartData, insights } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Student Learning Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Track your syllabus content and study preparation
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Subjects",
              value: keyMetrics.totalSubjects,
              desc: "Added to your library",
              Icon: BookOpen,
              color: "bg-blue-500",
              trend: "Active",
            },
            {
              title: "Total Chapters",
              value: keyMetrics.totalChapters,
              desc: "Across all subjects",
              Icon: Target,
              color: "bg-green-500",
              trend: "Organized",
            },
            {
              title: "Total Topics",
              value: keyMetrics.totalTopics,
              desc: "Ready to study",
              Icon: Brain,
              color: "bg-purple-500",
              trend: "Available",
            },
            {
              title: "Study Hours",
              value: keyMetrics.estimatedStudyHours,
              desc: "Estimated total",
              Icon: Clock,
              color: "bg-yellow-500",
              trend: "Estimated",
            },
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  <metric.Icon className="h-6 w-6 text-white" />
                </div>
                <Badge
                  variant="secondary"
                  className="text-green-600 bg-green-50"
                >
                  {metric.trend}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {metric.value}
              </h3>
              <p className="text-gray-600 text-sm">{metric.title}</p>
              <p className="text-gray-500 text-xs mt-1">{metric.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Subject Content Analysis */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Subject Content Analysis
              </h3>
              <BarChart className="w-5 h-5 text-blue-500" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={chartData.subjectPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="chaptersCount"
                    fill="#3B82F6"
                    name="Chapters"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="topicsCount"
                    fill="#10B981"
                    name="Topics"
                    radius={[2, 2, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Study Time Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Estimated Study Hours
              </h3>
              <PieChart className="w-5 h-5 text-green-500" />
            </div>
            <div className="h-64 flex items-center">
              <ChartContainer
                config={studyTimeConfig}
                className="w-full aspect-square max-h-[250px]"
              >
                <RechartsPieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={chartData.studyTimeData}
                    dataKey="hours"
                    nameKey="subject"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {chartData.studyTimeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(${index * 72}, 70%, 50%)`}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </RechartsPieChart>
              </ChartContainer>
            </div>
          </motion.div>
        </div>

        {/* Content Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Content Readiness */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Study Readiness
              </h3>
              <Brain className="w-5 h-5 text-green-500" />
            </div>
            <div className="h-64 flex items-center justify-center">
              <ChartContainer
                config={contentMasteryConfig}
                className="w-full aspect-square max-h-[200px]"
              >
                <RechartsPieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={chartData.contentMasteryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="text-3xl font-bold fill-gray-900"
                              >
                                {keyMetrics.totalTopics}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-gray-500 text-sm"
                              >
                                Topics
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </RechartsPieChart>
              </ChartContainer>
            </div>
          </motion.div>

          {/* Growth Tracking */}
          {chartData.growthData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Content Growth
                </h3>
                <LineChart className="w-5 h-5 text-purple-500" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={chartData.growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      stroke="#666"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulativeTopics"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: "#8B5CF6", r: 4 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Study Insights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-6 w-6 text-blue-500" />
              <h3 className="text-xl font-bold text-gray-900">
                Study Insights
              </h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">
                  Content Rich Subject
                </h4>
                <p className="text-sm text-blue-700">
                  {insights.mostContentRichSubject}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">
                  Average Topics per Subject
                </h4>
                <p className="text-sm text-green-700">
                  {insights.averageTopicsPerSubject} topics
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-1">
                  Total Content Items
                </h4>
                <p className="text-sm text-purple-700">
                  {insights.totalContentItems} items to study
                </p>
              </div>
            </div>
          </motion.div>

          {/* Study Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Award className="h-6 w-6 text-purple-500" />
              <h3 className="text-xl font-bold text-gray-900">Study Status</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Ready to Learn</h4>
                  <p className="text-sm text-green-700">
                    {insights.studyReadiness}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">
                    Content Overview
                  </h4>
                  <p className="text-sm text-blue-700">
                    You have {keyMetrics.totalSubjects} subjects with{" "}
                    {keyMetrics.totalChapters} chapters covering{" "}
                    {keyMetrics.totalTopics} topics.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">
                    Time Investment
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Estimated {keyMetrics.estimatedStudyHours} of study time
                    required.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
