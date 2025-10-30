'use client';

import { Search, Filter, X, Calendar, DollarSign, Users } from 'lucide-react';
import { useState } from 'react';

export default function FilterPanel({ tasks, onFilterChange }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [showFilters, setShowFilters] = useState(false);

    const applyFilters = () => {
        let filtered = [...tasks];

        // Search term
        if (searchTerm) {
            filtered = filtered.filter(task =>
                task.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Amount range
        if (minAmount) {
            filtered = filtered.filter(task => task.nett_amount >= parseInt(minAmount));
        }
        if (maxAmount) {
            filtered = filtered.filter(task => task.nett_amount <= parseInt(maxAmount));
        }

        // Date range
        if (dateRange.start) {
            filtered = filtered.filter(task => task.start_date >= dateRange.start);
        }
        if (dateRange.end) {
            filtered = filtered.filter(task => task.end_date <= dateRange.end);
        }

        onFilterChange(filtered);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedGroup('all');
        setMinAmount('');
        setMaxAmount('');
        setDateRange({ start: '', end: '' });
        onFilterChange(tasks);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            applyFilters();
                        }}
                        placeholder="Search tasks..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
                
                {(searchTerm || minAmount || maxAmount || dateRange.start || dateRange.end) && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        <X className="w-4 h-4" />
                        Clear
                    </button>
                )}
            </div>

            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    {/* Amount Range */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Amount Range
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={minAmount}
                                onChange={(e) => setMinAmount(e.target.value)}
                                placeholder="Min"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                value={maxAmount}
                                onChange={(e) => setMaxAmount(e.target.value)}
                                placeholder="Max"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Date Range */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Date Range
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                placeholder="Start (DD-MM-YY)"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                placeholder="End (DD-MM-YY)"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Apply Button */}
                    <div className="flex items-end">
                        <button
                            onClick={applyFilters}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
