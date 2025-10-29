import { Download, FileSpreadsheet, FileText, FileStack } from 'lucide-react';
import { exportCalendarToExcel, exportTaskSummaryToExcel, exportCompleteReport } from '@/lib/excelExport';

export default function ExportPanel({ calendar, tasks, numGroups, amountPerDay, totalAmount, totalCalendarDays }) {
    const handleExportCalendar = () => {
        exportCalendarToExcel(calendar, numGroups, totalCalendarDays);
        alert('✅ Calendar exported successfully!');
    };

    const handleExportTaskSummary = () => {
        exportTaskSummaryToExcel(tasks, numGroups, amountPerDay, totalAmount);
        alert('✅ Task Summary exported successfully!');
    };

    const handleExportComplete = () => {
        exportCompleteReport(calendar, tasks, numGroups, amountPerDay, totalAmount, totalCalendarDays);
        alert('✅ Complete Report exported successfully!');
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
                <Download className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Export Options</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
                Export your data to Excel files for offline analysis and reporting.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Export Calendar */}
                <button
                    onClick={handleExportCalendar}
                    className="flex flex-col items-center gap-3 p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                    <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-200 transition">
                        <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-semibold text-gray-800">Export Calendar</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Download calendar view with all groups
                        </p>
                    </div>
                </button>

                {/* Export Task Summary */}
                <button
                    onClick={handleExportTaskSummary}
                    className="flex flex-col items-center gap-3 p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all group"
                >
                    <div className="bg-green-100 p-4 rounded-full group-hover:bg-green-200 transition">
                        <FileText className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-semibold text-gray-800">Export Tasks</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Download task summary with statistics
                        </p>
                    </div>
                </button>

                {/* Export Complete Report */}
                <button
                    onClick={handleExportComplete}
                    className="flex flex-col items-center gap-3 p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all group"
                >
                    <div className="bg-purple-100 p-4 rounded-full group-hover:bg-purple-200 transition">
                        <FileStack className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-semibold text-gray-800">Complete Report</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Download all sheets in one file
                        </p>
                    </div>
                </button>
            </div>

            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                    <span className="text-2xl">💡</span>
                    <div>
                        <p className="font-semibold text-blue-900">Export Tips</p>
                        <ul className="mt-2 space-y-1 text-sm text-blue-800">
                            <li>• Files are saved with timestamps for easy tracking</li>
                            <li>• Complete report includes Calendar, Task Summary, and Group Patterns</li>
                            <li>• All exports are compatible with Excel, Google Sheets, and Numbers</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
