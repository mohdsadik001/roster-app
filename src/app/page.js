'use client';

import { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import TaskSummary from '@/components/TaskSummary';
import GroupPatterns from '@/components/GroupPatterns';
import StatsDashboard from '@/components/StatsDashboard';
import ExportPanel from '@/components/ExportPanel';
import AddGroupModal from '@/components/AddGroupModal';
import AddTaskModal from '@/components/AddTaskModal';
import RemoveGroupModal from '@/components/RemoveGroupModal';
import RemoveTaskModal from '@/components/RemoveTaskModal';
import SettingsModal from '@/components/SettingsModal';
import { 
    initializeSampleData, 
    autoAssignGroupPatterns, 
    calculateWeekoffStats 
} from '@/lib/taskScheduler';
import { Calendar as CalendarIcon, ListTodo, Users, Settings } from 'lucide-react';

export default function Home() {
    const [calendar, setCalendar] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [numGroups, setNumGroups] = useState(5);
    const [amountPerDay, setAmountPerDay] = useState(1000);
    const [totalCalendarDays] = useState(30);
    const [activeTab, setActiveTab] = useState('calendar');
    
    // Modal states
    const [showAddGroup, setShowAddGroup] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showRemoveGroup, setShowRemoveGroup] = useState(false);
    const [showRemoveTask, setShowRemoveTask] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const { calendar: initialCalendar, tasks: initialTasks } = initializeSampleData();
        const updatedCalendar = autoAssignGroupPatterns(initialCalendar, numGroups, totalCalendarDays);
        
        const updatedTasks = initialTasks.map(task => 
            calculateWeekoffStats(task, updatedCalendar, numGroups, totalCalendarDays)
        );
        
        updatedTasks.forEach(task => {
            task.nett_amount = task.nett_days * amountPerDay;
        });
        
        setCalendar(updatedCalendar);
        setTasks(updatedTasks);
    }, []);

    const recalculateAll = (newCalendar = calendar, newTasks = tasks, newNumGroups = numGroups, newAmount = amountPerDay) => {
        const updatedCalendar = autoAssignGroupPatterns([...newCalendar], newNumGroups, totalCalendarDays);
        
        const updatedTasks = newTasks.map(task => {
            const calculatedTask = calculateWeekoffStats(
                { ...task }, 
                updatedCalendar, 
                newNumGroups, 
                totalCalendarDays
            );
            calculatedTask.nett_amount = calculatedTask.nett_days * newAmount;
            return calculatedTask;
        });
        
        setCalendar(updatedCalendar);
        setTasks(updatedTasks);
        setNumGroups(newNumGroups);
        setAmountPerDay(newAmount);
    };

    const handleAddGroup = () => {
        if (numGroups < 10) {
            recalculateAll(calendar, tasks, numGroups + 1, amountPerDay);
            setShowAddGroup(false);
        }
    };

    const handleRemoveGroup = (groupIndex) => {
        if (numGroups > 1) {
            const newCalendar = calendar.map(day => {
                const newDay = { ...day };
                newDay.groups = day.groups.filter((_, idx) => idx !== groupIndex);
                return newDay;
            });
            recalculateAll(newCalendar, tasks, numGroups - 1, amountPerDay);
            setShowRemoveGroup(false);
        }
    };

    const handleAddTask = (newTask) => {
        const taskWithStats = calculateWeekoffStats(newTask, calendar, numGroups, totalCalendarDays);
        taskWithStats.nett_amount = taskWithStats.nett_days * amountPerDay;
        setTasks([...tasks, taskWithStats]);
        setShowAddTask(false);
    };

    const handleRemoveTask = (taskIndex) => {
        const newTasks = tasks.filter((_, idx) => idx !== taskIndex);
        setTasks(newTasks);
        setShowRemoveTask(false);
    };

    const handleUpdateSettings = (newAmount) => {
        recalculateAll(calendar, tasks, numGroups, newAmount);
        setShowSettings(false);
    };

    const totalAmount = tasks.reduce((sum, task) => sum + task.nett_amount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Dynamic Task Scheduler
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                November 2025 - Task & Workforce Management
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowAddGroup(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                + Add Group
                            </button>
                            <button
                                onClick={() => setShowAddTask(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                + Add Task
                            </button>
                            <button
                                onClick={() => setShowSettings(true)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Dashboard */}
            <StatsDashboard 
                numGroups={numGroups}
                taskCount={tasks.length}
                amountPerDay={amountPerDay}
                totalAmount={totalAmount}
            />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                                activeTab === 'calendar'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <CalendarIcon className="w-5 h-5" />
                            Calendar View
                        </button>
                        <button
                            onClick={() => setActiveTab('tasks')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                                activeTab === 'tasks'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <ListTodo className="w-5 h-5" />
                            Task Summary
                        </button>
                        <button
                            onClick={() => setActiveTab('groups')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                                activeTab === 'groups'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Users className="w-5 h-5" />
                            Group Patterns
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'calendar' && (
                            <Calendar 
                                calendar={calendar} 
                                numGroups={numGroups}
                                totalCalendarDays={totalCalendarDays}
                            />
                        )}
                        {activeTab === 'tasks' && (
                            <TaskSummary 
                                tasks={tasks}
                                numGroups={numGroups}
                                amountPerDay={amountPerDay}
                                totalAmount={totalAmount}
                                onRemoveTask={() => setShowRemoveTask(true)}
                            />
                        )}
                        {activeTab === 'groups' && (
                            <GroupPatterns 
                                numGroups={numGroups}
                                onRemoveGroup={() => setShowRemoveGroup(true)}
                            />
                        )}
                    </div>
                </div>

                {/* Export Panel */}
                <ExportPanel 
                    calendar={calendar}
                    tasks={tasks}
                    numGroups={numGroups}
                    amountPerDay={amountPerDay}
                    totalAmount={totalAmount}
                    totalCalendarDays={totalCalendarDays}
                />
            </main>

            {/* Modals */}
            {showAddGroup && (
                <AddGroupModal 
                    onClose={() => setShowAddGroup(false)}
                    onAdd={handleAddGroup}
                    currentGroups={numGroups}
                />
            )}
            {showAddTask && (
                <AddTaskModal 
                    onClose={() => setShowAddTask(false)}
                    onAdd={handleAddTask}
                />
            )}
            {showRemoveGroup && (
                <RemoveGroupModal 
                    onClose={() => setShowRemoveGroup(false)}
                    onRemove={handleRemoveGroup}
                    numGroups={numGroups}
                />
            )}
            {showRemoveTask && (
                <RemoveTaskModal 
                    onClose={() => setShowRemoveTask(false)}
                    onRemove={handleRemoveTask}
                    tasks={tasks}
                />
            )}
            {showSettings && (
                <SettingsModal 
                    onClose={() => setShowSettings(false)}
                    onUpdate={handleUpdateSettings}
                    currentAmount={amountPerDay}
                />
            )}
        </div>
    );
}
