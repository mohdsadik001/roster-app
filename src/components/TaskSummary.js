import { Trash2 } from 'lucide-react';

export default function TaskSummary({ tasks, numGroups, amountPerDay, totalAmount, onRemoveTask }) {
    const totals = tasks.reduce((acc, task) => ({
        duration: acc.duration + task.duration,
        weekoff: acc.weekoff + task.weekoff_count,
        avgWeekoff: acc.avgWeekoff + task.avg_weekoff,
        nettDays: acc.nettDays + task.nett_days,
    }), { duration: 0, weekoff: 0, avgWeekoff: 0, nettDays: 0 });

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Task Summary</h2>
                <button
                    onClick={onRemoveTask}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    Remove Task
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse bg-white">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <th className="border border-gray-300 px-4 py-3 text-left">Task</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Start</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">End</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Start Date</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">End Date</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Duration</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Weekoff Count</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Avg Weekoff</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Nett Days</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Nett Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2 font-semibold">{task.name}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{task.start_col}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{task.end_col}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{task.start_date}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{task.end_date}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{task.duration}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{task.weekoff_count}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{task.avg_weekoff}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{task.nett_days}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center font-bold text-green-600">
                                    ${task.nett_amount}
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-gradient-to-r from-gray-100 to-gray-200 font-bold">
                            <td className="border border-gray-300 px-4 py-2">TOTAL</td>
                            <td className="border border-gray-300 px-4 py-2"></td>
                            <td className="border border-gray-300 px-4 py-2"></td>
                            <td className="border border-gray-300 px-4 py-2"></td>
                            <td className="border border-gray-300 px-4 py-2"></td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.duration}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.weekoff}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.avgWeekoff}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.nettDays}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center text-green-600">${totalAmount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium">Total Groups</p>
                    <p className="text-2xl font-bold text-blue-900">{numGroups}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium">Total Tasks</p>
                    <p className="text-2xl font-bold text-green-900">{tasks.length}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm text-purple-600 font-medium">Amount/Day</p>
                    <p className="text-2xl font-bold text-purple-900">${amountPerDay}</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-sm text-orange-600 font-medium">Total Amount</p>
                    <p className="text-2xl font-bold text-orange-900">${totalAmount}</p>
                </div>
            </div>

            {/* Weekoff Pattern Info */}
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-bold text-indigo-900 mb-2">📋 Weekoff Pattern Summary</h3>
                <ul className="space-y-1 text-sm text-indigo-800">
                    <li>• <strong>Odd Groups (1,3,5,...):</strong> Weekoff on Monday & Wednesday</li>
                    <li>• <strong>Even Groups (2,4,6,...):</strong> Weekoff on Tuesday & Thursday</li>
                    <li>• <strong>Saturday & Sunday:</strong> ALL GROUPS PRESENT (No weekoff)</li>
                    <li>• <strong>Friday:</strong> ALL GROUPS PRESENT</li>
                    <li>• <strong>First 2 days:</strong> ALL GROUPS MANDATORY</li>
                </ul>
            </div>
        </div>
    );
}
