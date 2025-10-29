import { X, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function RemoveGroupModal({ onClose, onRemove, numGroups }) {
    const [selectedGroup, setSelectedGroup] = useState('');

    const handleRemove = () => {
        if (!selectedGroup) {
            alert('Please select a group to remove');
            return;
        }
        onRemove(parseInt(selectedGroup) - 1);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Remove Group</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 cursor-pointer hover:text-gray-600 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-yellow-900">Warning</p>
                            <p className="text-sm text-yellow-800 mt-1">
                                This action will remove the selected group and recalculate all task statistics.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Group to Remove
                        </label>
                        <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="w-full text-gray-500 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">-- Select a group --</option>
                            {Array.from({ length: numGroups }, (_, i) => (
                                <option key={i} value={i + 1}>
                                    Group {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700">
                            <strong>Current Groups:</strong> {numGroups}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                            <strong>After Removal:</strong> {numGroups - 1}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="flex-1 cursor-pointer px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleRemove}
                        className="flex-1 px-4 py-3 cursor-pointer bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition font-medium flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-5 h-5" />
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}
