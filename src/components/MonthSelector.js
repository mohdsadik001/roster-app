'use client';

import { Calendar, ChevronLeft, ChevronRight, Copy, RefreshCw } from 'lucide-react';
import { MONTHS, YEARS } from '@/lib/multiMonth';

export default function MonthSelector({ 
    currentMonth, 
    currentYear, 
    onMonthChange, 
    onCopySchedule,
    totalDays
}) {
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            onMonthChange(11, currentYear - 1);
        } else {
            onMonthChange(currentMonth - 1, currentYear);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            onMonthChange(0, currentYear + 1);
        } else {
            onMonthChange(currentMonth + 1, currentYear);
        }
    };

    const handleMonthSelect = (e) => {
        const newMonth = parseInt(e.target.value);
        onMonthChange(newMonth, currentYear);
    };

    const handleYearSelect = (e) => {
        const newYear = parseInt(e.target.value);
        onMonthChange(currentMonth, newYear);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                        title="Previous month"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <select
                            value={currentMonth}
                            onChange={handleMonthSelect}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 font-semibold"
                        >
                            {MONTHS.map((month, index) => (
                                <option key={index} value={index}>{month}</option>
                            ))}
                        </select>
                        
                        <select
                            value={currentYear}
                            onChange={handleYearSelect}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 font-semibold"
                        >
                            {YEARS.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    
                    <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                        title="Next month"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex gap-2">
                    <button
                        onClick={onCopySchedule}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        <Copy className="w-4 h-4" />
                        <span className="hidden sm:inline">Copy to Next Month</span>
                        <span className="sm:hidden">Copy</span>
                    </button>
                </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div>
                    Viewing: <strong className="text-blue-600 dark:text-blue-400">{MONTHS[currentMonth]} {currentYear}</strong>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-blue-800 dark:text-blue-200 text-xs font-semibold">
                        {totalDays} days
                    </span>
                </div>
            </div>
        </div>
    );
}
