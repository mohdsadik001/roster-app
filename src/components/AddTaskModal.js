import { X, Plus, Calendar } from 'lucide-react';
import { useState } from 'react';
import { Task, daysBetween } from '@/lib/taskScheduler';

export default function AddTaskModal({ onClose, onAdd }) {
    const [taskData, setTaskData] = useState({
        name: '',
        start_col: '',
        end_col: '',
        start_date: '',
        end_date: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const startCol = parseInt(taskData.start_col);
        const endCol = parseInt(taskData.end_col);

        if (startCol < 2 || startCol > 31 || endCol < 2 || endCol > 31 || startCol >= endCol) {
            alert('Invalid column numbers! Ensure start < end and both are between 2-31.');
            return;
        }

        const newTask = new Task();
        newTask.name = taskData.name;
        newTask.start_col = startCol;
        newTask.end_col = endCol;
        newTask.start_date = taskData.start_date;
        newTask.end_date = taskData.end_date;
        newTask.duration = daysBetween(taskData.start_date, taskData.end_date);

        onAdd(newTask);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Task Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={taskData.name}
                            onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
                            className="w-full text-gray-500 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Task11"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Start Column *
                            </label>
                            <input
                                type="number"
                                required
                                min="2"
                                max="31"
                                value={taskData.start_col}
                                onChange={(e) => setTaskData({ ...taskData, start_col: e.target.value })}
                                className="w-full text-gray-500 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="2-31"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                End Column *
                            </label>
                            <input
                                type="number"
                                required
                                min="2"
                                max="31"
                                value={taskData.end_col}
                                onChange={(e) => setTaskData({ ...taskData, end_col: e.target.value })}
                                className="w-full text-gray-500 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="2-31"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Start Date *
                            </label>
                            <input
                                type="text"
                                required
                                value={taskData.start_date}
                                onChange={(e) => setTaskData({ ...taskData, start_date: e.target.value })}
                                className="w-full text-gray-500 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="DD-MM-YY"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                End Date *
                            </label>
                            <input
                                type="text"
                                required
                                value={taskData.end_date}
                                onChange={(e) => setTaskData({ ...taskData, end_date: e.target.value })}
                                className="w-full px-4 py-3 text-gray-500 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="DD-MM-YY"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Task statistics (weekoffs, net days, amount) will be calculated automatically based on current group patterns.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
