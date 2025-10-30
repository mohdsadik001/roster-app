'use client';

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateAnalytics } from '@/lib/analytics';
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

export default function AnalyticsDashboard({ tasks, calendar, numGroups, totalCalendarDays, totalAmount }) {
    const analytics = calculateAnalytics(tasks, calendar, numGroups, totalCalendarDays);

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <Calendar className="w-8 h-8 opacity-80" />
                        <span className="text-2xl font-bold">{analytics.totalTasks}</span>
                    </div>
                    <p className="text-sm opacity-90">Total Tasks</p>
                    <p className="text-xs opacity-75 mt-1">Avg: {analytics.avgTaskDuration.toFixed(1)} days</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="w-8 h-8 opacity-80" />
                        <span className="text-2xl font-bold">${(analytics.totalRevenue / 1000).toFixed(1)}k</span>
                    </div>
                    <p className="text-sm opacity-90">Total Revenue</p>
                    <p className="text-xs opacity-75 mt-1">${analytics.totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="w-8 h-8 opacity-80" />
                        <span className="text-2xl font-bold">{numGroups}</span>
                    </div>
                    <p className="text-sm opacity-90">Active Groups</p>
                    <p className="text-xs opacity-75 mt-1">{analytics.avgGroupUtilization.toFixed(1)}% avg util</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-8 h-8 opacity-80" />
                        <span className="text-2xl font-bold">{analytics.revenueData.length}</span>
                    </div>
                    <p className="text-sm opacity-90">Active Weeks</p>
                    <p className="text-xs opacity-75 mt-1">Revenue distribution</p>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Group Utilization Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Group Utilization</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.groupUtilization}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="group" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1F2937', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="utilization" fill="#3B82F6" name="Utilization %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue by Week */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Weekly Revenue</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="week" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1F2937', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue ($)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Task Distribution Pie Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Task Revenue Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={analytics.taskTimeline}
                                dataKey="amount"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={(entry) => `${entry.name}: $${entry.amount}`}
                            >
                                {analytics.taskTimeline.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1F2937', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Workload Heatmap */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Daily Workload Intensity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.workloadByDay.slice(0, 15)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1F2937', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="activeGroups" fill="#F59E0B" name="Active Groups" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">📊 Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-blue-700 dark:text-blue-300">
                            <strong>Peak Utilization:</strong> Group {analytics.groupUtilization.reduce((max, g) => g.utilization > max.utilization ? g : max).group}
                        </p>
                    </div>
                    <div>
                        <p className="text-blue-700 dark:text-blue-300">
                            <strong>Busiest Week:</strong> {analytics.revenueData.reduce((max, w) => w.revenue > max.revenue ? w : max, {revenue: 0}).week || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-blue-700 dark:text-blue-300">
                            <strong>Avg Task Value:</strong> ${(analytics.totalRevenue / analytics.totalTasks).toFixed(0)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
