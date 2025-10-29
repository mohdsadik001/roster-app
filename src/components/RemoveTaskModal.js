import { X, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function RemoveTaskModal({ onClose, onRemove, tasks }) {
    const [selectedTask, setSelectedTask] = useState('');

    const handleRemove = () => {
        if (!selectedTask) {
            alert('Please select a task to remove');
            return;
        }
        onRemove(parseInt(selectedTask));
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
                        <h2 className="text-2xl font-bold text-gray-800">Remove Task</h2>
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
                                This action will permanently remove the selected task from the schedule.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Task to Remove
                        </label>
                        <select
                            value={selectedTask}
                            onChange={(e) => setSelectedTask(e.target.value)}
                            className="w-full px-4 py-3 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">-- Select a task --</option>
                            {tasks.map((task, idx) => (
                                <option key={idx} value={idx}>
                                    {task.name} (Duration: {task.duration} days, Amount: ${task.nett_amount})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedTask !== '' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-red-900 mb-2">Task Details:</p>
                            <div className="space-y-1 text-sm text-red-800">
                                <p><strong>Name:</strong> {tasks[parseInt(selectedTask)].name}</p>
                                <p><strong>Duration:</strong> {tasks[parseInt(selectedTask)].duration} days</p>
                                <p><strong>Nett Days:</strong> {tasks[parseInt(selectedTask)].nett_days}</p>
                                <p><strong>Amount:</strong> ${tasks[parseInt(selectedTask)].nett_amount}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 cursor-pointer bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
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
