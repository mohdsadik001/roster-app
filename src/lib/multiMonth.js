import { DayEntry, Task, autoAssignGroupPatterns } from './taskScheduler';

export function generateMonthData(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const dates = [];
    const days = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayName = dayNames[date.getDay()];
        
        dates.push(`${String(day).padStart(2, '0')}-${String(month + 1).padStart(2, '0')}-${String(year).slice(-2)}`);
        days.push(dayName);
    }
    
    return {
        year,
        month,
        monthName: monthNames[month],
        daysInMonth,
        dates,
        days
    };
}

// NEW: Function to assign tasks to calendar based on columns
export function assignTasksToCalendar(calendar, tasks, totalCalendarDays) {
    // Clear existing task assignments
    calendar.forEach(day => {
        day.task = '';
    });
    
    // Assign each task to its calendar days
    tasks.forEach(task => {
        const startIdx = task.start_col - 2; // Column 2 = index 0
        const endIdx = task.end_col - 2;
        
        // Mark the first day of the task
        if (startIdx >= 0 && startIdx < totalCalendarDays) {
            calendar[startIdx].task = task.name.toLowerCase();
        }
    });
    
    return calendar;
}

export function generateCalendarForMonth(year, month, numGroups) {
    const monthData = generateMonthData(year, month);
    const calendar = [];
    
    // Create calendar entries for the month
    for (let i = 0; i < monthData.daysInMonth; i++) {
        const day = new DayEntry();
        day.date = monthData.dates[i];
        day.day = monthData.days[i];
        day.task = ''; // Will be assigned later
        day.submission = '';
        day.groups = Array(numGroups).fill('');
        calendar.push(day);
    }
    
    // Apply group patterns
    autoAssignGroupPatterns(calendar, numGroups, monthData.daysInMonth);
    
    return {
        calendar,
        monthData
    };
}

export function copyScheduleToMonth(sourceCalendar, sourceTasks, targetYear, targetMonth) {
    const targetMonthData = generateMonthData(targetYear, targetMonth);
    const newCalendar = [];
    
    // Create calendar for target month
    for (let i = 0; i < targetMonthData.daysInMonth; i++) {
        const day = new DayEntry();
        day.date = targetMonthData.dates[i];
        day.day = targetMonthData.days[i];
        day.task = i < sourceCalendar.length ? sourceCalendar[i].task : '';
        day.submission = '';
        day.groups = [];
        newCalendar.push(day);
    }
    
    // Copy tasks with adjusted dates
    const newTasks = sourceTasks.map((task, index) => {
        const newTask = { ...task };
        
        // Extract day from original date
        const [day] = task.start_date.split('-');
        const [endDay] = task.end_date.split('-');
        
        // Create new dates for target month
        newTask.start_date = `${day}-${String(targetMonth + 1).padStart(2, '0')}-${String(targetYear).slice(-2)}`;
        newTask.end_date = `${endDay}-${String(targetMonth + 1).padStart(2, '0')}-${String(targetYear).slice(-2)}`;
        
        // Adjust columns if needed (in case target month has different days)
        if (newTask.end_col > targetMonthData.daysInMonth + 1) {
            newTask.end_col = targetMonthData.daysInMonth + 1;
        }
        
        return newTask;
    });
    
    return { calendar: newCalendar, tasks: newTasks, monthData: targetMonthData };
}

export const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const YEARS = [2024, 2025, 2026, 2027, 2028];
