'use client';

import { useState, useEffect } from 'react';
import FullyDraggableCalendar from '@/components/FullyDraggableCalendar';
import TaskSummary from '@/components/TaskSummary';
import GroupPatterns from '@/components/GroupPatterns';
import StatsDashboard from '@/components/StatsDashboard';
import ExportPanel from '@/components/ExportPanel';
import AddGroupModal from '@/components/AddGroupModal';
import AddTaskModal from '@/components/AddTaskModal';
import RemoveGroupModal from '@/components/RemoveGroupModal';
import RemoveTaskModal from '@/components/RemoveTaskModal';
import SettingsModal from '@/components/SettingsModal';
import DataManagementModal from '@/components/DataManagementModal';
import MonthSelector from '@/components/MonthSelector';
import GroupProfilesModal from '@/components/GroupProfilesModal';
import BudgetManagement from '@/components/BudgetManagement';
import FilterPanel from '@/components/FilterPanel';
import AnalyticsDashboard from '@/components/Analytics/AnalyticsDashboard';
import DragDropCalendar from '@/components/DragDropCalendar';
import ThemeToggle from '@/components/ThemeToggle';
import OptimalGroupCalculator from '@/components/OptimalGroupCalculator';
import { 
    initializeSampleData, 
    autoAssignGroupPatterns, 
    calculateWeekoffStats,
    autoAssignSubmissions
} from '@/lib/taskScheduler';
import { StorageManager } from '@/lib/storage';
import { generateCalendarForMonth, copyScheduleToMonth, assignTasksToCalendar, MONTHS } from '@/lib/multiMonth';
import { Calendar as CalendarIcon, ListTodo, Users, Settings, Database, Save, TrendingUp, DollarSign, GripVertical, Calculator } from 'lucide-react';

export default function Home() {
    const [calendar, setCalendar] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [numGroups, setNumGroups] = useState(5);
    const [amountPerDay, setAmountPerDay] = useState(1000);
    const [budgetLimit, setBudgetLimit] = useState(50000);
    const [totalCalendarDays, setTotalCalendarDays] = useState(30);
    const [activeTab, setActiveTab] = useState('calendar');
    const [dataLoaded, setDataLoaded] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [groupProfiles, setGroupProfiles] = useState([]);
    
    // Month selector
    const [currentMonth, setCurrentMonth] = useState(10); // November = 10
    const [currentYear, setCurrentYear] = useState(2025);
    const [currentMonthName, setCurrentMonthName] = useState('November');
    
    // Modal states
    const [showAddGroup, setShowAddGroup] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showRemoveGroup, setShowRemoveGroup] = useState(false);
    const [showRemoveTask, setShowRemoveTask] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showDataManagement, setShowDataManagement] = useState(false);
    const [showGroupProfiles, setShowGroupProfiles] = useState(false);
    const [showOptimalCalculator, setShowOptimalCalculator] = useState(false);

    // Load data from localStorage on mount
    useEffect(() => {
        const savedSettings = StorageManager.loadSettings();
        const savedCalendar = StorageManager.loadCalendar();
        const savedTasks = StorageManager.loadTasks();

        if (savedSettings && savedCalendar && savedTasks) {
            setNumGroups(savedSettings.numGroups);
            setAmountPerDay(savedSettings.amountPerDay);
            
            // Re-assign tasks to calendar to ensure they show
            assignTasksToCalendar(savedCalendar, savedTasks, savedCalendar.length);
            
            setCalendar(savedCalendar);
            setTasks(savedTasks);
            setFilteredTasks(savedTasks);
            setTotalCalendarDays(savedCalendar.length);
            console.log('✅ Data loaded from localStorage');
            console.log('   Tasks loaded:', savedTasks.map(t => t.name).join(', '));
        } else {
            // Initialize with current month/year
            regenerateCalendarForMonth(currentYear, currentMonth, numGroups);
        }
        
        setDataLoaded(true);
    }, []);

    // Auto-save function
    const saveToLocalStorage = (cal, tsk, grps, amt) => {
        StorageManager.saveCalendar(cal);
        StorageManager.saveTasks(tsk);
        StorageManager.saveSettings(grps, amt);
        setLastSaved(new Date());
        console.log('💾 Data auto-saved');
    };

    // Auto-save whenever data changes
    useEffect(() => {
        if (dataLoaded && calendar.length > 0) {
            saveToLocalStorage(calendar, tasks, numGroups, amountPerDay);
        }
    }, [calendar, tasks, numGroups, amountPerDay, dataLoaded]);

    // Regenerate calendar for specific month/year
    const regenerateCalendarForMonth = (year, month, groups) => {
        const { calendar: newCalendar, monthData } = generateCalendarForMonth(year, month, groups);
        
        // If we have existing tasks, adjust and assign them
        const adjustedTasks = tasks.map(task => {
            const calculatedTask = calculateWeekoffStats(
                { ...task }, 
                newCalendar, 
                groups, 
                monthData.daysInMonth
            );
            calculatedTask.nett_amount = calculatedTask.nett_days * amountPerDay;
            return calculatedTask;
        });
        
        // Assign tasks to calendar cells
        if (adjustedTasks.length > 0) {
            assignTasksToCalendar(newCalendar, adjustedTasks, monthData.daysInMonth);
            autoAssignSubmissions(newCalendar, adjustedTasks, groups, monthData.daysInMonth);
        }
        
        setCalendar(newCalendar);
        setTotalCalendarDays(monthData.daysInMonth);
        setCurrentMonthName(monthData.monthName);
        setTasks(adjustedTasks);
        setFilteredTasks(adjustedTasks);
        
        console.log(`✅ Calendar generated for ${monthData.monthName} ${year}`);
        console.log(`   Days in month: ${monthData.daysInMonth}`);
        console.log(`   Tasks assigned: ${adjustedTasks.length}`);
        
        saveToLocalStorage(newCalendar, adjustedTasks, groups, amountPerDay);
    };

    // Handle month change
    const handleMonthChange = (month, year) => {
        setCurrentMonth(month);
        setCurrentYear(year);
        
        // Regenerate calendar for new month
        regenerateCalendarForMonth(year, month, numGroups);
    };

    // Handle copy schedule to next month
    const handleCopySchedule = () => {
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        
        if (confirm(`Copy current schedule to ${MONTHS[nextMonth]} ${nextYear}?`)) {
            const { calendar: newCal, tasks: newTasks, monthData } = copyScheduleToMonth(
                calendar, 
                tasks, 
                nextYear,
                nextMonth
            );
            
            // Apply group patterns to new calendar
            autoAssignGroupPatterns(newCal, numGroups, monthData.daysInMonth);
            
            // Recalculate task stats for new calendar
            const updatedTasks = newTasks.map(task => {
                const calculatedTask = calculateWeekoffStats(
                    { ...task }, 
                    newCal, 
                    numGroups, 
                    monthData.daysInMonth
                );
                calculatedTask.nett_amount = calculatedTask.nett_days * amountPerDay;
                return calculatedTask;
            });
            
            // Assign tasks to calendar and submissions
            assignTasksToCalendar(newCal, updatedTasks, monthData.daysInMonth);
            autoAssignSubmissions(newCal, updatedTasks, numGroups, monthData.daysInMonth);
            
            setCurrentMonth(nextMonth);
            setCurrentYear(nextYear);
            setCurrentMonthName(monthData.monthName);
            setCalendar(newCal);
            setTasks(updatedTasks);
            setFilteredTasks(updatedTasks);
            setTotalCalendarDays(monthData.daysInMonth);
            
            saveToLocalStorage(newCal, updatedTasks, numGroups, amountPerDay);
            
            alert(`✅ Schedule copied to ${MONTHS[nextMonth]} ${nextYear}!`);
        }
    };

    // Handle calendar manual updates (drag and drop)
    const handleCalendarUpdate = (updatedCalendar) => {
        // Recalculate everything based on new calendar
        const recalculatedTasks = tasks.map(task => {
            const calculatedTask = calculateWeekoffStats(
                { ...task },
                updatedCalendar,
                numGroups,
                totalCalendarDays
            );
            calculatedTask.nett_amount = calculatedTask.nett_days * amountPerDay;
            return calculatedTask;
        });
        
        setCalendar(updatedCalendar);
        setTasks(recalculatedTasks);
        setFilteredTasks(recalculatedTasks);
        
        console.log('✅ Calendar updated manually via drag-and-drop');
    };

    // Handle task movement on calendar (drag and drop)
    const handleTaskMove = (task, newStartCol, newEndCol, newDayIndex) => {
        console.log(`Moving ${task.name} to column ${newStartCol}-${newEndCol}`);
        
        // Calculate new dates
        const newStartDay = newStartCol - 1;
        const newEndDay = newEndCol - 1;
        const newStartDate = calendar[newStartDay]?.date || task.start_date;
        const newEndDate = calendar[newEndDay]?.date || task.end_date;
        
        // Update task
        const updatedTasks = tasks.map(t => {
            if (t.name === task.name) {
                return {
                    ...t,
                    start_col: newStartCol,
                    end_col: newEndCol,
                    start_date: newStartDate,
                    end_date: newEndDate
                };
            }
            return t;
        });
        
        // Update calendar
        const updatedCalendar = [...calendar];
        
        // Recalculate stats
        const recalculatedTasks = updatedTasks.map(t => {
            const calculatedTask = calculateWeekoffStats(
                { ...t },
                updatedCalendar,
                numGroups,
                totalCalendarDays
            );
            calculatedTask.nett_amount = calculatedTask.nett_days * amountPerDay;
            return calculatedTask;
        });
        
        // Reassign tasks to calendar
        assignTasksToCalendar(updatedCalendar, recalculatedTasks, totalCalendarDays);
        autoAssignSubmissions(updatedCalendar, recalculatedTasks, numGroups, totalCalendarDays);
        
        setTasks(recalculatedTasks);
        setFilteredTasks(recalculatedTasks);
        setCalendar(updatedCalendar);
        
        console.log(`✅ Task ${task.name} moved to ${newStartDate} - ${newEndDate}`);
    };

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
        
        // Assign tasks to calendar
        assignTasksToCalendar(updatedCalendar, updatedTasks, totalCalendarDays);
        autoAssignSubmissions(updatedCalendar, updatedTasks, newNumGroups, totalCalendarDays);
        
        setCalendar(updatedCalendar);
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks);
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
        
        const updatedTasks = [...tasks, taskWithStats];
        const updatedCalendar = [...calendar];
        
        // Assign task to calendar
        assignTasksToCalendar(updatedCalendar, updatedTasks, totalCalendarDays);
        autoAssignSubmissions(updatedCalendar, updatedTasks, numGroups, totalCalendarDays);
        
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks);
        setCalendar(updatedCalendar);
        setShowAddTask(false);
    };

    const handleRemoveTask = (taskIndex) => {
        const newTasks = tasks.filter((_, idx) => idx !== taskIndex);
        const updatedCalendar = [...calendar];
        
        // Re-assign remaining tasks to calendar
        assignTasksToCalendar(updatedCalendar, newTasks, totalCalendarDays);
        autoAssignSubmissions(updatedCalendar, newTasks, numGroups, totalCalendarDays);
        
        setTasks(newTasks);
        setFilteredTasks(newTasks);
        setCalendar(updatedCalendar);
        setShowRemoveTask(false);
    };

    const handleUpdateSettings = (newAmount) => {
        recalculateAll(calendar, tasks, numGroups, newAmount);
        setShowSettings(false);
    };

    const handleResetData = () => {
        if (confirm('Are you sure you want to reset all data to default? This cannot be undone.')) {
            StorageManager.clearAll();
            window.location.reload();
        }
    };

    const handleTaskReorder = (reorderedTasks) => {
        const updatedCalendar = [...calendar];
        
        // Re-assign tasks to calendar with new order
        assignTasksToCalendar(updatedCalendar, reorderedTasks, totalCalendarDays);
        autoAssignSubmissions(updatedCalendar, reorderedTasks, numGroups, totalCalendarDays);
        
        setTasks(reorderedTasks);
        setFilteredTasks(reorderedTasks);
        setCalendar(updatedCalendar);
    };

    const handleFilterChange = (filtered) => {
        setFilteredTasks(filtered);
    };

    const handleUpdateGroupProfiles = (profiles) => {
        setGroupProfiles(profiles);
        alert('✅ Group profiles updated!');
    };

    // Handle applying optimal groups from calculator
    const handleApplyOptimalGroups = (optimalNumGroups) => {
        // Apply the optimal number of groups
        recalculateAll(calendar, tasks, optimalNumGroups, amountPerDay);
        console.log(`✅ Applied optimal solution: ${optimalNumGroups} groups`);
        alert(`✅ Applied optimal solution: ${optimalNumGroups} groups to your calendar!`);
    };

    const totalAmount = tasks.reduce((sum, task) => sum + task.nett_amount, 0);

    if (!dataLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                Dynamic Task Scheduler Pro
                            </h1>
                           
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <ThemeToggle />
                            <button
                                onClick={() => setShowOptimalCalculator(true)}
                                className="px-3 lg:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition text-sm lg:text-base flex items-center gap-2"
                                title="Calculate Optimal Groups"
                            >
                                <Calculator className="w-5 h-5" />
                                <span className="hidden lg:inline">Calculate No. of Groups</span>
                            </button>
                            <button
                                onClick={() => setShowGroupProfiles(true)}
                                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                title="Group Profiles"
                            >
                                <Users className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowAddGroup(true)}
                                className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm lg:text-base"
                            >
                                <span className="hidden lg:inline">+ Group</span>
                                <span className="lg:hidden">+G</span>
                            </button>
                            <button
                                onClick={() => setShowAddTask(true)}
                                className="px-3 lg:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm lg:text-base"
                            >
                                <span className="hidden lg:inline">+ Task</span>
                                <span className="lg:hidden">+T</span>
                            </button>
                            <button
                                onClick={() => setShowDataManagement(true)}
                                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                title="Data Management"
                            >
                                <Database className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowSettings(true)}
                                className="px-3 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition"
                                title="Settings"
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
                {/* Month Selector */}
                <MonthSelector
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    onMonthChange={handleMonthChange}
                    onCopySchedule={handleCopySchedule}
                    totalDays={totalCalendarDays}
                />

                {/* Filter Panel */}
                <FilterPanel 
                    tasks={tasks}
                    onFilterChange={handleFilterChange}
                />

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 transition-colors">
                    <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition whitespace-nowrap ${
                                activeTab === 'calendar'
                                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            <CalendarIcon className="w-5 h-5" />
                            Calendar
                        </button>
                        <button
                            onClick={() => setActiveTab('tasks')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition whitespace-nowrap ${
                                activeTab === 'tasks'
                                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            <ListTodo className="w-5 h-5" />
                            Tasks
                        </button>
                        <button
                            onClick={() => setActiveTab('groups')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition whitespace-nowrap ${
                                activeTab === 'groups'
                                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            <Users className="w-5 h-5" />
                            Groups
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition whitespace-nowrap ${
                                activeTab === 'analytics'
                                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            <TrendingUp className="w-5 h-5" />
                            Analytics
                        </button>
                        <button
                            onClick={() => setActiveTab('budget')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition whitespace-nowrap ${
                                activeTab === 'budget'
                                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            <DollarSign className="w-5 h-5" />
                            Budget
                        </button>
                        <button
                            onClick={() => setActiveTab('dragdrop')}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition whitespace-nowrap ${
                                activeTab === 'dragdrop'
                                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            <GripVertical className="w-5 h-5" />
                            Reorder
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'calendar' && (
                            <FullyDraggableCalendar 
                                calendar={calendar}
                                tasks={tasks}
                                numGroups={numGroups}
                                totalCalendarDays={totalCalendarDays}
                                onCalendarUpdate={handleCalendarUpdate}
                                onTaskMove={handleTaskMove}
                            />
                        )}
                        {activeTab === 'tasks' && (
                            <TaskSummary 
                                tasks={filteredTasks}
                                numGroups={numGroups}
                                amountPerDay={amountPerDay}
                                totalAmount={filteredTasks.reduce((sum, t) => sum + t.nett_amount, 0)}
                                onRemoveTask={() => setShowRemoveTask(true)}
                            />
                        )}
                        {activeTab === 'groups' && (
                            <GroupPatterns 
                                numGroups={numGroups}
                                onRemoveGroup={() => setShowRemoveGroup(true)}
                            />
                        )}
                        {activeTab === 'analytics' && (
                            <AnalyticsDashboard
                                tasks={tasks}
                                calendar={calendar}
                                numGroups={numGroups}
                                totalCalendarDays={totalCalendarDays}
                                totalAmount={totalAmount}
                            />
                        )}
                        {activeTab === 'budget' && (
                            <BudgetManagement
                                tasks={tasks}
                                amountPerDay={amountPerDay}
                                budgetLimit={budgetLimit}
                                onBudgetChange={setBudgetLimit}
                            />
                        )}
                        {activeTab === 'dragdrop' && (
                            <DragDropCalendar
                                tasks={tasks}
                                onTaskReorder={handleTaskReorder}
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
                    tasks={tasks}
                    totalCalendarDays={totalCalendarDays}
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
            {showDataManagement && (
                <DataManagementModal
                    onClose={() => setShowDataManagement(false)}
                    onReset={handleResetData}
                />
            )}
            {showGroupProfiles && (
                <GroupProfilesModal
                    onClose={() => setShowGroupProfiles(false)}
                    numGroups={numGroups}
                    groupProfiles={groupProfiles}
                    onUpdateProfiles={handleUpdateGroupProfiles}
                />
            )}
            {showOptimalCalculator && (
                <OptimalGroupCalculator
                    onClose={() => setShowOptimalCalculator(false)}
                    onApply={handleApplyOptimalGroups}
                />
            )}
        </div>
    );
}
