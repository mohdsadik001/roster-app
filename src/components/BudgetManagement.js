'use client';

import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { calculateBudgetMetrics, calculateTaskCostBreakdown } from '@/lib/budgetCalculator';

export default function BudgetManagement({ tasks, amountPerDay, budgetLimit, onBudgetChange }) {
    const metrics = calculateBudgetMetrics(tasks, amountPerDay, budgetLimit);
    const costBreakdown = calculateTaskCostBreakdown(tasks);

    const getStatusColor = () => {
        switch (metrics.status) {
            case 'over': return 'text-red-600 dark:text-red-400';
            case 'warning': return 'text-yellow-600 dark:text-yellow-400';
            default: return 'text-green-600 dark:text-green-400';
        }
    };

    const getStatusIcon = () => {
        switch (metrics.status) {
            case 'over': return <AlertTriangle className="w-5 h-5" />;
            case 'warning': return <TrendingUp className="w-5 h-5" />;
            default: return <CheckCircle className="w-5 h-5" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Budget Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Spent */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Spent</span>
                        <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        ${metrics.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {metrics.totalDays} working days
                    </p>
                </div>

                {/* Budget Limit */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Budget Limit</span>
                        <input
                            type="number"
                            value={budgetLimit}
                            onChange={(e) => onBudgetChange(parseInt(e.target.value) || 0)}
                            className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-1 focus:ring-purple-500"
                        />
                    </div>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        ${budgetLimit.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Monthly budget
                    </p>
                </div>

                {/* Remaining */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Remaining</span>
                        {metrics.remainingBudget >= 0 ? (
                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                    </div>
                    <p className={`text-3xl font-bold ${metrics.remainingBudget >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        ${Math.abs(metrics.remainingBudget).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {metrics.remainingBudget >= 0 ? 'Under budget' : 'Over budget'}
                    </p>
                </div>

                {/* Utilization */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Utilization</span>
                        <span className={getStatusColor()}>
                            {getStatusIcon()}
                        </span>
                    </div>
                    <p className={`text-3xl font-bold ${getStatusColor()}`}>
                        {metrics.budgetUtilization.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        of budget used
                    </p>
                </div>
            </div>

            {/* Budget Progress Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Budget Progress</h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        ${metrics.totalAmount.toLocaleString()} / ${budgetLimit.toLocaleString()}
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${
                            metrics.status === 'over' ? 'bg-red-600' :
                            metrics.status === 'warning' ? 'bg-yellow-500' :
                            'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(metrics.budgetUtilization, 100)}%` }}
                    />
                </div>
                {metrics.isOverBudget && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-900 dark:text-red-100">Budget Exceeded!</p>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                You are ${metrics.projectedOverrun.toLocaleString()} over budget. Consider adjusting tasks or increasing budget.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="font-semibold mb-4">Task Cost Breakdown</h3>
                <div className="space-y-3">
                    {costBreakdown.slice(0, 5).map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">{item.name}</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        ${item.cost.toLocaleString()} ({item.percentage.toFixed(1)}%)
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {costBreakdown.length > 5 && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-3 text-center">
                        + {costBreakdown.length - 5} more tasks
                    </p>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Average Task Cost</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                        ${metrics.averageTaskCost.toFixed(0)}
                    </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Tasks</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                        {tasks.length}
                    </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Rate per Day</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                        ${amountPerDay}
                    </p>
                </div>
            </div>
        </div>
    );
}
