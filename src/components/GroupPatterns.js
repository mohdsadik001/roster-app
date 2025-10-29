import { Trash2 } from 'lucide-react';

export default function GroupPatterns({ numGroups, onRemoveGroup }) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    const getStatus = (groupIndex, day) => {
        if (day === 'Saturday' || day === 'Sunday' || day === 'Friday') {
            return 'present';
        }
        
        if (groupIndex % 2 === 0) {
            return (day === 'Monday' || day === 'Wednesday') ? 'weekoff' : 'present';
        } else {
            return (day === 'Tuesday' || day === 'Thursday') ? 'weekoff' : 'present';
        }
    };

    const getStatusColor = (status) => {
        return status === 'weekoff' 
            ? 'bg-red-100 text-red-800 border-red-300' 
            : 'bg-green-100 text-green-800 border-green-300';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Group Weekoff Patterns</h2>
                <button
                    onClick={onRemoveGroup}
                    className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    Remove Group
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse bg-white">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <th className="border border-gray-300 px-4 py-3 text-left">Group</th>
                            {days.map(day => (
                                <th key={day} className="border border-gray-300 px-4 py-3 text-center">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: numGroups }).map((_, groupIdx) => (
                            <tr key={groupIdx} className="hover:bg-gray-50">
                                <td className="border text-blue-500 border-gray-300 px-4 py-3 font-semibold">
                                    Group {groupIdx + 1}
                                </td>
                                {days.map(day => {
                                    const status = getStatus(groupIdx, day);
                                    return (
                                        <td key={day} className="border  border-gray-300 px-4 py-3 text-center">
                                            <span className={`px-3 py-1  rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                                                {status}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pattern Explanation */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-bold text-blue-900 mb-2">👥 Odd Groups (1, 3, 5, ...)</h3>
                    <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-500">
                            <span className="px-2 py-1 bg-red-100 text-red-800 border border-red-300 rounded text-xs">weekoff</span>
                            Monday & Wednesday
                        </p>
                        <p className="flex items-center gap-2 text-gray-500">
                            <span className="px-2 py-1 bg-green-100 text-green-800 border border-green-300 rounded text-xs">present</span>
                            Tuesday, Thursday, Friday, Sat, Sun
                        </p>
                    </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2">👥 Even Groups (2, 4, 6, ...)</h3>
                    <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-500">
                            <span className="px-2 py-1 bg-red-100 text-red-800 border border-red-300 rounded text-xs">weekoff</span>
                            Tuesday & Thursday
                        </p>
                        <p className="flex items-center gap-2 text-gray-500">
                            <span className="px-2 py-1 bg-green-100 text-green-800 border border-green-300 rounded text-xs">present</span>
                            Monday, Wednesday, Friday, Sat, Sun
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-green-900 mb-2">✨ Special Rules</h3>
                <ul className="space-y-1 text-sm text-green-800">
                    <li>• <strong>Friday, Saturday, Sunday:</strong> ALL groups work (no weekoffs)</li>
                    <li>• <strong>First 2 calendar days:</strong> Mandatory for ALL groups</li>
                </ul>
            </div>
        </div>
    );
}
