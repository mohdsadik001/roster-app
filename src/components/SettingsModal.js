import { X, Settings, DollarSign } from 'lucide-react';
import { useState } from 'react';

export default function SettingsModal({ onClose, onUpdate, currentAmount }) {
    const [newAmount, setNewAmount] = useState(currentAmount);

    const handleUpdate = () => {
        if (newAmount <= 0) {
            alert('Please enter a valid amount greater than 0');
            return;
        }
        onUpdate(parseInt(newAmount));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
                            <Settings className="w-6 h-6 text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Amount Per Day
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                $
                            </span>
                            <input
                                type="number"
                                min="1"
                                value={newAmount}
                                onChange={(e) => setNewAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                                placeholder="1000"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900 mb-2">
                            <strong>Current Rate:</strong> ${currentAmount}/day
                        </p>
                        <p className="text-sm text-blue-900">
                            <strong>New Rate:</strong> ${newAmount}/day
                        </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> Changing this value will recalculate all task amounts automatically.
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
                        onClick={handleUpdate}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium flex items-center justify-center gap-2"
                    >
                        <Settings className="w-5 h-5" />
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
