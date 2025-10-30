// import { X, Plus, Calendar, Sparkles } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { Task, daysBetween, findNextAvailableSlot, calculateEndDate, calculateEndColumn } from '@/lib/taskScheduler';

// export default function AddTaskModal({ onClose, onAdd, tasks, totalCalendarDays = 30 }) {
//     const [taskData, setTaskData] = useState({
//         name: '',
//         start_col: '',
//         end_col: '',
//         start_date: '',
//         end_date: '',
//         duration: 1
//     });
    
//     const [autoSuggest, setAutoSuggest] = useState(true);

//     // Auto-suggest next available slot
//     useEffect(() => {
//         if (autoSuggest && tasks) {
//             const nextSlot = findNextAvailableSlot(tasks, totalCalendarDays);
//             const nextTaskNumber = tasks.length + 1;
            
//             setTaskData({
//                 name: `Task${nextTaskNumber}`,
//                 start_col: nextSlot.startCol.toString(),
//                 end_col: nextSlot.endCol.toString(),
//                 start_date: nextSlot.startDate,
//                 end_date: nextSlot.endDate,
//                 duration: 1
//             });
//         }
//     }, [autoSuggest, tasks, totalCalendarDays]);

//     // Auto-calculate end values when duration or start changes
//     const handleDurationChange = (newDuration) => {
//         const dur = parseInt(newDuration) || 1;
//         const startCol = parseInt(taskData.start_col) || 2;
//         const endCol = calculateEndColumn(startCol, dur);
//         const endDate = calculateEndDate(taskData.start_date, dur);
        
//         setTaskData({
//             ...taskData,
//             duration: dur,
//             end_col: endCol.toString(),
//             end_date: endDate
//         });
//     };

//     const handleStartColChange = (newStartCol) => {
//         const startCol = parseInt(newStartCol) || 2;
//         const endCol = calculateEndColumn(startCol, taskData.duration);
//         const startDay = startCol - 1;
//         const startDate = `${String(startDay).padStart(2, '0')}-11-25`;
//         const endDate = calculateEndDate(startDate, taskData.duration);
        
//         setTaskData({
//             ...taskData,
//             start_col: newStartCol,
//             end_col: endCol.toString(),
//             start_date: startDate,
//             end_date: endDate
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
        
//         const startCol = parseInt(taskData.start_col);
//         const endCol = parseInt(taskData.end_col);

//         if (startCol < 2 || startCol > 31 || endCol < 2 || endCol > 31 || startCol >= endCol) {
//             alert('Invalid column numbers! Ensure start < end and both are between 2-31.');
//             return;
//         }

//         const newTask = new Task();
//         newTask.name = taskData.name;
//         newTask.start_col = startCol;
//         newTask.end_col = endCol;
//         newTask.start_date = taskData.start_date;
//         newTask.end_date = taskData.end_date;
//         newTask.duration = daysBetween(taskData.start_date, taskData.end_date);

//         onAdd(newTask);
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full animate-fade-in max-h-[90vh] overflow-y-auto">
//                 {/* Header */}
//                 <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
//                     <div className="flex items-center gap-3">
//                         <div className="bg-green-100 p-2 rounded-lg">
//                             <Calendar className="w-6 h-6 text-green-600" />
//                         </div>
//                         <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
//                     </div>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
//                         <X className="w-6 h-6" />
//                     </button>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="p-6 space-y-4">
//                     {/* Auto-suggest toggle */}
//                     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                                 <Sparkles className="w-5 h-5 text-blue-600" />
//                                 <span className="font-semibold text-blue-900">Auto-Suggest Next Slot</span>
//                             </div>
//                             <label className="relative inline-flex items-center cursor-pointer">
//                                 <input
//                                     type="checkbox"
//                                     checked={autoSuggest}
//                                     onChange={(e) => setAutoSuggest(e.target.checked)}
//                                     className="sr-only peer"
//                                 />
//                                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                             </label>
//                         </div>
//                         {autoSuggest && (
//                             <p className="text-sm text-blue-700 mt-2">
//                                 ✨ Automatically suggesting next available slot after existing tasks
//                             </p>
//                         )}
//                     </div>

//                     {/* Task Name */}
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                             Task Name *
//                         </label>
//                         <input
//                             type="text"
//                             required
//                             value={taskData.name}
//                             onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                             placeholder="e.g., Task11"
//                         />
//                     </div>

//                     {/* Duration Input (Primary Control) */}
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                             Task Duration (Days) *
//                         </label>
//                         <input
//                             type="number"
//                             required
//                             min="1"
//                             max="30"
//                             value={taskData.duration}
//                             onChange={(e) => handleDurationChange(e.target.value)}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold"
//                             placeholder="1"
//                         />
//                         <p className="text-sm text-gray-600 mt-1">
//                             How many days will this task run?
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         {/* Start Column */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Start Column *
//                             </label>
//                             <input
//                                 type="number"
//                                 required
//                                 min="2"
//                                 max="31"
//                                 value={taskData.start_col}
//                                 onChange={(e) => handleStartColChange(e.target.value)}
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                                 placeholder="2-31"
//                             />
//                         </div>

//                         {/* End Column (Auto-calculated) */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 End Column (Auto)
//                             </label>
//                             <input
//                                 type="number"
//                                 value={taskData.end_col}
//                                 readOnly
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         {/* Start Date */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Start Date *
//                             </label>
//                             <input
//                                 type="text"
//                                 required
//                                 value={taskData.start_date}
//                                 readOnly
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
//                                 placeholder="DD-MM-YY"
//                             />
//                         </div>

//                         {/* End Date (Auto-calculated) */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 End Date (Auto)
//                             </label>
//                             <input
//                                 type="text"
//                                 value={taskData.end_date}
//                                 readOnly
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
//                                 placeholder="DD-MM-YY"
//                             />
//                         </div>
//                     </div>

//                     {/* Preview Box */}
//                     <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                         <p className="text-sm font-semibold text-green-900 mb-2">📋 Task Preview</p>
//                         <div className="space-y-1 text-sm text-green-800">
//                             <p><strong>Name:</strong> {taskData.name || 'Not set'}</p>
//                             <p><strong>Duration:</strong> {taskData.duration} day(s)</p>
//                             <p><strong>Period:</strong> {taskData.start_date} to {taskData.end_date}</p>
//                             <p><strong>Columns:</strong> {taskData.start_col} to {taskData.end_col}</p>
//                         </div>
//                     </div>

//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                         <p className="text-sm text-blue-800">
//                             <strong>Note:</strong> Task statistics (weekoffs, net days, amount) will be calculated automatically. 
//                             Submission will be scheduled on the next valid day (all groups present, not immediately after weekoff).
//                         </p>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex gap-3 pt-4">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium flex items-center justify-center gap-2"
//                         >
//                             <Plus className="w-5 h-5" />
//                             Add Task
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }


import { X, Plus, Calendar, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Task, daysBetween, findNextAvailableSlot, calculateEndDate, calculateEndColumn } from '@/lib/taskScheduler';

export default function AddTaskModal({ onClose, onAdd, tasks, totalCalendarDays = 30 }) {
    const [taskData, setTaskData] = useState({
        name: '',
        start_col: '',
        end_col: '',
        start_date: '',
        end_date: '',
        duration: ''
    });
    
    const [autoSuggest, setAutoSuggest] = useState(true);

    // Auto-suggest next available slot
    useEffect(() => {
        if (autoSuggest && tasks) {
            const nextSlot = findNextAvailableSlot(tasks, totalCalendarDays);
            const nextTaskNumber = tasks.length + 1;
            
            setTaskData({
                name: `Task${nextTaskNumber}`,
                start_col: nextSlot.startCol.toString(),
                end_col: nextSlot.endCol.toString(),
                start_date: nextSlot.startDate,
                end_date: nextSlot.endDate,
                duration: '1'
            });
        }
    }, [autoSuggest, tasks, totalCalendarDays]);

    // Auto-calculate end values when duration or start changes
    const handleDurationChange = (e) => {
        const newDuration = e.target.value;
        
        // Allow empty string for clearing
        if (newDuration === '') {
            setTaskData({
                ...taskData,
                duration: '',
                end_col: '',
                end_date: ''
            });
            return;
        }
        
        const dur = parseInt(newDuration) || 1;
        const startCol = parseInt(taskData.start_col) || 2;
        const endCol = calculateEndColumn(startCol, dur);
        const endDate = calculateEndDate(taskData.start_date, dur);
        
        setTaskData({
            ...taskData,
            duration: newDuration,
            end_col: endCol.toString(),
            end_date: endDate
        });
    };

    const handleStartColChange = (e) => {
        const newStartCol = e.target.value;
        
        // Allow empty string
        if (newStartCol === '') {
            setTaskData({
                ...taskData,
                start_col: '',
                end_col: '',
                start_date: '',
                end_date: ''
            });
            return;
        }
        
        const startCol = parseInt(newStartCol) || 2;
        const dur = parseInt(taskData.duration) || 1;
        const endCol = calculateEndColumn(startCol, dur);
        const startDay = startCol - 1;
        const startDate = `${String(startDay).padStart(2, '0')}-11-25`;
        const endDate = calculateEndDate(startDate, dur);
        
        setTaskData({
            ...taskData,
            start_col: newStartCol,
            end_col: endCol.toString(),
            start_date: startDate,
            end_date: endDate
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const startCol = parseInt(taskData.start_col);
        const endCol = parseInt(taskData.end_col);
        const duration = parseInt(taskData.duration);

        if (!taskData.name || !taskData.start_col || !taskData.duration) {
            alert('Please fill in all required fields!');
            return;
        }

        if (startCol < 2 || startCol > 31 || endCol < 2 || endCol > 31 || startCol >= endCol) {
            alert('Invalid column numbers! Ensure start < end and both are between 2-31.');
            return;
        }

        if (duration < 1 || duration > 30) {
            alert('Duration must be between 1 and 30 days!');
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full animate-fade-in max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                            <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add New Task</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Auto-suggest toggle */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span className="font-semibold text-blue-900 dark:text-blue-100">Auto-Suggest Next Slot</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoSuggest}
                                    onChange={(e) => setAutoSuggest(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        {autoSuggest && (
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                                ✨ Automatically suggesting next available slot after existing tasks
                            </p>
                        )}
                    </div>

                    {/* Task Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Task Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={taskData.name}
                            onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="e.g., Task11"
                        />
                    </div>

                    {/* Duration Input (Primary Control) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Task Duration (Days) *
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            max="30"
                            value={taskData.duration}
                            onChange={handleDurationChange}
                            onFocus={(e) => e.target.select()}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="1"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            How many days will this task run?
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Start Column */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Start Column *
                            </label>
                            <input
                                type="number"
                                required
                                min="2"
                                max="31"
                                value={taskData.start_col}
                                onChange={handleStartColChange}
                                onFocus={(e) => e.target.select()}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder="2-31"
                            />
                        </div>

                        {/* End Column (Auto-calculated) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                End Column (Auto)
                            </label>
                            <input
                                type="number"
                                value={taskData.end_col}
                                readOnly
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Start Date *
                            </label>
                            <input
                                type="text"
                                required
                                value={taskData.start_date}
                                readOnly
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 cursor-not-allowed"
                                placeholder="DD-MM-YY"
                            />
                        </div>

                        {/* End Date (Auto-calculated) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                End Date (Auto)
                            </label>
                            <input
                                type="text"
                                value={taskData.end_date}
                                readOnly
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 cursor-not-allowed"
                                placeholder="DD-MM-YY"
                            />
                        </div>
                    </div>

                    {/* Preview Box */}
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">📋 Task Preview</p>
                        <div className="space-y-1 text-sm text-green-800 dark:text-green-200">
                            <p><strong>Name:</strong> {taskData.name || 'Not set'}</p>
                            <p><strong>Duration:</strong> {taskData.duration || '0'} day(s)</p>
                            <p><strong>Period:</strong> {taskData.start_date || 'Not set'} to {taskData.end_date || 'Not set'}</p>
                            <p><strong>Columns:</strong> {taskData.start_col || '?'} to {taskData.end_col || '?'}</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Note:</strong> Task statistics (weekoffs, net days, amount) will be calculated automatically. 
                            Submission will be scheduled on the next valid day (all groups present, not immediately after weekoff).
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
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
