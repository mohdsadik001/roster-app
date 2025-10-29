import { X, Users, Plus } from 'lucide-react';

export default function AddGroupModal({ onClose, onAdd, currentGroups }) {
    const nextGroupNumber = currentGroups + 1;
    const pattern = nextGroupNumber % 2 === 1 
        ? "Weekoff on Monday & Wednesday" 
        : "Weekoff on Tuesday & Thursday";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Add New Group</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700 mb-3">
                            You are about to add <strong className="text-blue-700">Group {nextGroupNumber}</strong>
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700">Current Groups:</span>
                                <span className="text-gray-900">{currentGroups}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700">New Total:</span>
                                <span className="text-blue-700 font-bold">{nextGroupNumber}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
                        <p className="font-semibold text-purple-900 mb-2">📋 Group Pattern</p>
                        <p className="text-sm text-purple-800">{pattern}</p>
                        <p className="text-xs text-purple-700 mt-2">
                            Present on: {nextGroupNumber % 2 === 1 
                                ? "Tue, Thu, Fri, Sat, Sun" 
                                : "Mon, Wed, Fri, Sat, Sun"}
                        </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> All task statistics will be automatically recalculated for the new group count.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onAdd}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Group
                    </button>
                </div>
            </div>
        </div>
    );
}
