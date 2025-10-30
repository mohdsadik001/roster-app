'use client';

import { useState } from 'react';
import { calculateOptimalGroups, getRecommendationText } from '@/lib/groupOptimization';
import { X, Calculator, Users, Award, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';

export default function OptimalGroupCalculator({ onClose, onApply }) {
    const [totalEmployees, setTotalEmployees] = useState('');
    const [totalMentors, setTotalMentors] = useState('');
    const [result, setResult] = useState(null);
    const [expandedSolution, setExpandedSolution] = useState(0);

    const handleCalculate = () => {
        const employees = parseInt(totalEmployees);
        const mentors = parseInt(totalMentors);
        
        if (!employees || employees < 2) {
            alert('Please enter at least 2 employees');
            return;
        }
        
        if (!mentors || mentors < 1) {
            alert('Please enter at least 1 mentor');
            return;
        }
        
        if (employees > 200) {
            alert('Maximum 200 employees supported');
            return;
        }
        
        if (mentors > employees) {
            alert('Cannot have more mentors than employees');
            return;
        }
        
        const optimization = calculateOptimalGroups(employees, mentors);
        
        if (optimization.error) {
            alert(optimization.error);
            return;
        }
        
        setResult(optimization);
        setExpandedSolution(0);
    };

    const handleApplySolution = (solution) => {
        if (confirm(`Apply ${solution.numGroups} groups to your calendar?`)) {
            onApply(solution.numGroups);
            onClose();
        }
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600 dark:text-green-400';
        if (score >= 75) return 'text-blue-600 dark:text-blue-400';
        if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreBarColor = (score) => {
        if (score >= 90) return 'bg-green-500';
        if (score >= 75) return 'bg-blue-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-5xl w-full my-8">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-emerald-600">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Calculator className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Optimal Group Calculator</h2>
                            <p className="text-green-100 text-sm">AI-powered team structure based on employees & mentors</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Input Section */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Total Number of Employees *
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    min="2"
                                    max="200"
                                    value={totalEmployees}
                                    onChange={(e) => setTotalEmployees(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-lg font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g., 48"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Total Number of Mentors *
                            </label>
                            <div className="relative">
                                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={totalMentors}
                                    onChange={(e) => setTotalMentors(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-lg font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g., 8"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCalculate}
                        className="w-full px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-semibold flex items-center justify-center gap-2"
                    >
                        <Calculator className="w-5 h-5" />
                        Calculate Optimal Structure
                    </button>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                        💡 Ideal ratio: 5-6 employees per mentor for optimal management
                    </p>
                </div>

                {/* Results Section */}
                {result && !result.error && (
                    <div className="p-6 max-h-[600px] overflow-y-auto">
                        {/* Best Solution Highlight */}
                        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 dark:border-green-600 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-500 dark:bg-green-600 p-3 rounded-full flex-shrink-0">
                                    <Award className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                                        🏆 Best Solution: {result.bestSolution.numGroups} Groups
                                    </h3>
                                    <p className="text-green-800 dark:text-green-200 mb-3">
                                        {getRecommendationText(result.bestSolution, result.totalEmployees, result.totalMentors)}
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                        <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {result.bestSolution.employeesPerMentor.toFixed(1)}
                                            </p>
                                            <p className="text-xs text-green-700 dark:text-green-300">Employees/Mentor</p>
                                        </div>
                                        <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {result.bestSolution.employeesPerGroup.toFixed(1)}
                                            </p>
                                            <p className="text-xs text-green-700 dark:text-green-300">Employees/Group</p>
                                        </div>
                                        <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {(result.bestSolution.numGroups / result.totalMentors).toFixed(1)}
                                            </p>
                                            <p className="text-xs text-green-700 dark:text-green-300">Groups/Mentor</p>
                                        </div>
                                        <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {result.bestSolution.scores.total.toFixed(1)}
                                            </p>
                                            <p className="text-xs text-green-700 dark:text-green-300">Overall Score</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                        <div>📏 Group Size: <strong>{result.bestSolution.scores.groupSize.toFixed(0)}/100</strong></div>
                                        <div>⚖️ Balance: <strong>{result.bestSolution.scores.balance.toFixed(0)}/100</strong></div>
                                        <div>👥 Mentor Load: <strong>{result.bestSolution.scores.mentorLoad.toFixed(0)}/100</strong></div>
                                        <div>⚡ Efficiency: <strong>{result.bestSolution.scores.efficiency.toFixed(0)}/100</strong></div>
                                    </div>
                                    <button
                                        onClick={() => handleApplySolution(result.bestSolution)}
                                        className="w-full px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition font-medium"
                                    >
                                        Apply This Solution
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Alternative Solutions */}
                        {result.solutions.length > 1 && (
                            <>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                                    Alternative Solutions
                                </h3>
                                <div className="space-y-3">
                                    {result.solutions.slice(1).map((solution, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-green-400 dark:hover:border-green-600 transition"
                                        >
                                            <div
                                                className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                onClick={() => setExpandedSolution(expandedSolution === index + 1 ? null : index + 1)}
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="text-center min-w-[60px]">
                                                        <p className={`text-2xl font-bold ${getScoreColor(solution.scores.total)}`}>
                                                            {solution.scores.total.toFixed(1)}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                            {solution.numGroups} Groups
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {solution.employeesPerMentor.toFixed(1)} employees per mentor • {solution.employeesPerGroup.toFixed(1)} per group
                                                        </p>
                                                    </div>
                                                </div>
                                                {expandedSolution === index + 1 ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>

                                            {expandedSolution === index + 1 && (
                                                <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                                    {/* Score Breakdown */}
                                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                                        {Object.entries({
                                                            'Group Size': solution.scores.groupSize,
                                                            'Balance': solution.scores.balance,
                                                            'Mentor Load': solution.scores.mentorLoad,
                                                            'Efficiency': solution.scores.efficiency
                                                        }).map(([label, score]) => (
                                                            <div key={label}>
                                                                <div className="flex justify-between text-sm mb-1">
                                                                    <span className="text-gray-600 dark:text-gray-400">{label}</span>
                                                                    <span className={`font-semibold ${getScoreColor(score)}`}>
                                                                        {score.toFixed(0)}/100
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                                    <div
                                                                        className={`h-full rounded-full transition-all ${getScoreBarColor(score)}`}
                                                                        style={{ width: `${score}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Reasoning */}
                                                    <div className="mb-4">
                                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Analysis:</p>
                                                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                            {solution.reasoning.map((reason, i) => (
                                                                <li key={i}>{reason}</li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <button
                                                        onClick={() => handleApplySolution(solution)}
                                                        className="w-full px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition font-medium"
                                                    >
                                                        Apply This Solution
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Info Footer */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>How it works:</strong> Our algorithm evaluates configurations based on mentor load (ideal: 5-6 employees/mentor), 
                        group size, balance, and efficiency. Mentor capacity is weighted at 40% for optimal team management.
                    </p>
                </div>
            </div>
        </div>
    );
}
