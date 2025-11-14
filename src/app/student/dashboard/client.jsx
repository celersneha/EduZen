'use client';

import { motion } from 'motion/react';
import {
  BarChart,
  PieChart,
  LineChart,
  BookOpen,
  Target,
  Brain,
  Award,
  TrendingUp,
  CheckCircle,
  FileText,
} from 'lucide-react';
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
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';

// Chart configurations
const difficultyConfig = {
  Easy: { label: 'Easy', color: '#22C55E' },
  Medium: { label: 'Medium', color: '#EAB308' },
  Hard: { label: 'Hard', color: '#EF4444' },
};

const contentMasteryConfig = {
  'High Performance': { label: 'High Performance (80%+)', color: '#22C55E' },
  'Medium Performance': {
    label: 'Medium Performance (60-79%)',
    color: '#EAB308',
  },
  'Needs Improvement': {
    label: 'Needs Improvement (<60%)',
    color: '#EF4444',
  },
};

export function DashboardClient({ dashboardData, error }) {
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 sm:p-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 mb-4">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
            Performance Dashboard
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Track your test performance and academic progress at a glance
          </p>
          {insights.recentPerformanceTrend && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mt-4 shadow-sm ${
                insights.recentPerformanceTrend === 'Improving'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/25'
                  : insights.recentPerformanceTrend === 'Declining'
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-500/25'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Recent Trend: {insights.recentPerformanceTrend}
            </motion.div>
          )}
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-10">
          {[
            {
              title: 'Total Subjects',
              value: keyMetrics.totalSubjects,
              desc: 'Added to your library',
              Icon: BookOpen,
              gradient: 'from-blue-500 to-cyan-500',
              iconBg: 'bg-blue-500/10',
              iconColor: 'text-blue-600',
              badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
              trend: 'Active',
            },
            {
              title: 'Total Chapters',
              value: keyMetrics.totalChapters,
              desc: 'Across all subjects',
              Icon: Target,
              gradient: 'from-green-500 to-emerald-500',
              iconBg: 'bg-green-500/10',
              iconColor: 'text-green-600',
              badgeColor: 'bg-green-50 text-green-700 border-green-200',
              trend: 'Organized',
            },
            {
              title: 'Total Topics',
              value: keyMetrics.totalTopics,
              desc: 'Available to study',
              Icon: Brain,
              gradient: 'from-purple-500 to-pink-500',
              iconBg: 'bg-purple-500/10',
              iconColor: 'text-purple-600',
              badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
              trend: 'Available',
            },
            {
              title: 'Tests Taken',
              value: keyMetrics.totalTests,
              desc: 'Completed assessments',
              Icon: FileText,
              gradient: 'from-orange-500 to-amber-500',
              iconBg: 'bg-orange-500/10',
              iconColor: 'text-orange-600',
              badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
              trend: 'Completed',
            },
            {
              title: 'Average Score',
              value: keyMetrics.averageScore,
              desc: 'Overall performance',
              Icon: Award,
              gradient: 'from-yellow-500 to-amber-500',
              iconBg: 'bg-yellow-500/10',
              iconColor: 'text-yellow-600',
              badgeColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
              trend: 'Performance',
            },
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${metric.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <metric.Icon className={`h-6 w-6 ${metric.iconColor}`} />
                  </div>
                  <Badge className={`${metric.badgeColor} border font-medium`}>
                    {metric.trend}
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                  {metric.value}
                </h3>
                <p className="text-gray-700 font-medium text-sm mb-1">{metric.title}</p>
                <p className="text-gray-500 text-xs">{metric.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Subject Performance Analysis */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    Subject Test Performance
                  </h3>
                  <p className="text-sm text-gray-500">Average scores by subject</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50">
                  <BarChart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            {chartData.subjectPerformanceData && chartData.subjectPerformanceData.length > 0 ? (
              <div className="h-[320px] -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart 
                    data={chartData.subjectPerformanceData}
                    margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280" 
                      tick={{ fontSize: 13, fill: '#374151', fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                      height={50}
                      interval={0}
                      tickFormatter={(value) => {
                        // Split long subject names into multiple lines if needed
                        if (value.length > 15) {
                          const words = value.split(' ');
                          const mid = Math.ceil(words.length / 2);
                          return words.slice(0, mid).join(' ') + '\n' + words.slice(mid).join(' ');
                        }
                        return value;
                      }}
                    />
                    <YAxis 
                      stroke="#6b7280" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                      width={50}
                      domain={[0, 'dataMax + 10']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
                        padding: '12px 16px',
                      }}
                      formatter={(value, name) => {
                        if (name === 'avgScore') {
                          return [`${value}%`, 'Average Score'];
                        } else if (name === 'testsAttempted') {
                          return [value, 'Tests Taken'];
                        }
                        return [value, name];
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: '4px', color: '#111827' }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: '20px', paddingTop: '10px' }}
                      iconSize={12}
                      formatter={(value) => <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>{value}</span>}
                    />
                    <Bar
                      dataKey="avgScore"
                      fill="url(#blueGradient)"
                      name="Average Score"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={60}
                    />
                    <Bar
                      dataKey="testsAttempted"
                      fill="url(#greenGradient)"
                      name="Tests Taken"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={60}
                    />
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0.9} />
                      </linearGradient>
                      <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                        <stop offset="100%" stopColor="#059669" stopOpacity={0.9} />
                      </linearGradient>
                    </defs>
                  </RechartsBarChart>
                </ResponsiveContainer>
                {chartData.subjectPerformanceData.every(subject => subject.testsAttempted === 0) && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl text-center">
                    <p className="text-sm font-medium text-yellow-800">
                      📊 All subjects shown. Take tests to see performance data.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-center">
                <div className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <BarChart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    No subjects available yet
                  </p>
                  <p className="text-gray-500 text-xs">
                    Join classrooms to see your subjects here
                  </p>
                </div>
              </div>
            )}
            </div>
          </motion.div>

          {/* Test Difficulty Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    Test Difficulty Distribution
                  </h3>
                  <p className="text-sm text-gray-500">Breakdown by difficulty level</p>
                </div>
                <div className="p-3 rounded-xl bg-green-50">
                  <PieChart className="w-6 h-6 text-green-600" />
                </div>
              </div>
            <div className="h-64 flex items-center">
              <ChartContainer
                config={difficultyConfig}
                className="w-full aspect-square max-h-[250px]"
              >
                <RechartsPieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={chartData.difficultyData}
                    dataKey="count"
                    nameKey="difficulty"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {chartData.difficultyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.difficulty === 'Easy'
                            ? '#22C55E'
                            : entry.difficulty === 'Medium'
                              ? '#EAB308'
                              : '#EF4444'
                        }
                      />
                    ))}
                  </Pie>
                  <Legend />
                </RechartsPieChart>
              </ChartContainer>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {chartData.difficultyData.map((item, index) => (
                <div key={index} className="text-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                    {item.count}
                  </div>
                  <div className="text-xs font-medium text-gray-600 mb-1">
                    {item.difficulty} Tests
                  </div>
                  <div className="text-sm font-semibold text-gray-700">{item.avgScore}% Avg</div>
                </div>
              ))}
            </div>
            </div>
          </motion.div>
        </div>

        {/* Progress and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score Progress Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    Score Progression
                  </h3>
                  <p className="text-sm text-gray-500">Performance over time</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50">
                  <LineChart className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={chartData.scoreProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="testNumber" stroke="#666" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#666" tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      padding: '12px',
                    }}
                    formatter={(value) => [`${value}%`, 'Score']}
                    labelFormatter={(label) => `Test ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="url(#purpleGradient)"
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7 }}
                  />
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#EC4899" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            </div>
          </motion.div>

          {/* Performance Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    Performance Distribution
                  </h3>
                  <p className="text-sm text-gray-500">Score range breakdown</p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50">
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
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
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          const totalTests = chartData.contentMasteryData.reduce(
                            (sum, item) => sum + item.value,
                            0
                          );
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
                                {totalTests}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-gray-500 text-sm"
                              >
                                Total Tests
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
            </div>
          </motion.div>
        </div>

        {/* Enhanced Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Test Analytics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-blue-50">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Performance Analytics
                </h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow duration-200">
                  <h4 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Best Performing Subject
                  </h4>
                  <p className="text-sm text-blue-700 font-medium">
                    {insights.bestPerformingSubject}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100 hover:shadow-md transition-shadow duration-200">
                  <h4 className="font-semibold text-yellow-900 mb-1 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Needs Attention
                  </h4>
                  <p className="text-sm text-yellow-700 font-medium">
                    {insights.weakestSubject}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-shadow duration-200">
                  <h4 className="font-semibold text-green-900 mb-1 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Preferred Difficulty
                  </h4>
                  <p className="text-sm text-green-700 font-medium">
                    {insights.difficultyPreference} level tests
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow duration-200">
                  <h4 className="font-semibold text-purple-900 mb-1 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Most Active Subject
                  </h4>
                  <p className="text-sm text-purple-700 font-medium">
                    {insights.mostTestedSubject}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Performance Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-purple-50">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Performance Summary
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-shadow duration-200">
                  <div className="p-1.5 rounded-lg bg-green-100 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Test Progress</h4>
                    <p className="text-sm text-green-700 font-medium">
                      {insights.testReadiness}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow duration-200">
                  <div className="p-1.5 rounded-lg bg-blue-100 mt-0.5">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Content Overview</h4>
                    <p className="text-sm text-blue-700 font-medium">
                      You have {keyMetrics.totalSubjects} subjects with{' '}
                      {keyMetrics.totalChapters} chapters covering{' '}
                      {keyMetrics.totalTopics} topics.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100 hover:shadow-md transition-shadow duration-200">
                  <div className="p-1.5 rounded-lg bg-yellow-100 mt-0.5">
                    <FileText className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">
                      Assessment Status
                    </h4>
                    <p className="text-sm text-yellow-700 font-medium">
                      {keyMetrics.totalTests} tests completed with{' '}
                      {keyMetrics.averageScore} average score.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

