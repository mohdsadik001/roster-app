// Task Scheduler Core Logic

export class DayEntry {
    constructor() {
        this.date = '';
        this.day = '';
        this.task = '';
        this.groups = [];
        this.submission = '';
    }
}

export class Task {
    constructor() {
        this.name = '';
        this.start_col = 0;
        this.end_col = 0;
        this.start_date = '';
        this.end_date = '';
        this.duration = 0;
        this.weekoff_count = 0;
        this.avg_weekoff = 0;
        this.nett_days = 0;
        this.nett_amount = 0;
    }
}

export const MAX_TASKS = 50;
export const MAX_DAYS = 31;
export const MAX_GROUPS = 10;

export function isWeekoff(groupStatus) {
    return groupStatus === "weekoff";
}

export function daysBetween(startDate, endDate) {
    const startParts = startDate.split('-');
    const endParts = endDate.split('-');
    const startDay = parseInt(startParts[0]);
    const endDay = parseInt(endParts[0]);
    return (endDay - startDay) + 1;
}

export function calculateWeekoffStats(task, calendar, numGroups, totalCalendarDays) {
    let startIdx = task.start_col - 2;
    let endIdx = task.end_col - 2;
    
    if (startIdx < 0) startIdx = 0;
    if (endIdx > totalCalendarDays) endIdx = totalCalendarDays;
    
    task.weekoff_count = 0;
    
    for (let i = startIdx; i < endIdx && i < totalCalendarDays; i++) {
        for (let j = 0; j < numGroups; j++) {
            if (isWeekoff(calendar[i].groups[j])) {
                task.weekoff_count++;
            }
        }
    }
    
    task.avg_weekoff = (numGroups > 0) ? Math.floor(task.weekoff_count / numGroups) : 0;
    task.nett_days = task.duration - task.avg_weekoff;
    if (task.nett_days < 0) task.nett_days = 0;
    
    return task;
}

export function autoAssignGroupPatterns(calendar, numGroups, totalCalendarDays) {
    for (let i = 0; i < totalCalendarDays; i++) {
        const currentDay = calendar[i].day;
        
        for (let g = 0; g < numGroups; g++) {
            if (i < 2) {
                calendar[i].groups[g] = "Mandatory";
            } else if (currentDay === "Saturday" || currentDay === "Sunday") {
                calendar[i].groups[g] = "present";
            } else {
                if (g % 2 === 0) {
                    if (currentDay === "Monday" || currentDay === "Wednesday") {
                        calendar[i].groups[g] = "weekoff";
                    } else {
                        calendar[i].groups[g] = "present";
                    }
                } else {
                    if (currentDay === "Tuesday" || currentDay === "Thursday") {
                        calendar[i].groups[g] = "weekoff";
                    } else {
                        calendar[i].groups[g] = "present";
                    }
                }
            }
        }
    }
    return calendar;
}

export function initializeSampleData() {
    const dates = [
        "01-11-25", "02-11-25", "03-11-25", "04-11-25", "05-11-25", "06-11-25", "07-11-25", 
        "08-11-25", "09-11-25", "10-11-25", "11-11-25", "12-11-25", "13-11-25", "14-11-25", 
        "15-11-25", "16-11-25", "17-11-25", "18-11-25", "19-11-25", "20-11-25", "21-11-25", 
        "22-11-25", "23-11-25", "24-11-25", "25-11-25", "26-11-25", "27-11-25", "28-11-25", 
        "29-11-25", "30-11-25"
    ];
    
    const days = [
        "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
        "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
        "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
        "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
        "Saturday", "Sunday"
    ];
    
    const taskAssignments = [
        "task1", "task2", "", "", "", "", "task3", "", "task4", "", "", "", "", "task5", 
        "", "task6", "", "", "", "", "", "task7", "task8", "", "", "", "", "task9", "task0", ""
    ];
    
    const submissions = [
        "", "task1", "", "", "", "", "", "task2", "task3", "", "", "", "", "", 
        "task4", "task5", "", "", "", "", "", "", "task6", "task7", "", "", "", "", "task8", "task9", "task0"
    ];
    
    const calendar = [];
    for (let i = 0; i < 30; i++) {
        const day = new DayEntry();
        day.date = dates[i];
        day.day = days[i];
        day.task = taskAssignments[i];
        day.submission = submissions[i];
        day.groups = [];
        calendar.push(day);
    }
    
    const tasks = [
        {name: "Task1", start_col: 2, end_col: 3, start_date: "01-11-25", end_date: "02-11-25", duration: 2},
        {name: "Task2", start_col: 3, end_col: 9, start_date: "02-11-25", end_date: "08-11-25", duration: 6},
        {name: "Task3", start_col: 8, end_col: 10, start_date: "07-11-25", end_date: "09-11-25", duration: 1},
        {name: "Task4", start_col: 10, end_col: 16, start_date: "09-11-25", end_date: "15-11-25", duration: 6},
        {name: "Task5", start_col: 15, end_col: 17, start_date: "14-11-25", end_date: "16-11-25", duration: 1},
        {name: "Task6", start_col: 17, end_col: 23, start_date: "16-11-25", end_date: "22-11-25", duration: 6},
        {name: "Task7", start_col: 23, end_col: 24, start_date: "22-11-25", end_date: "23-11-25", duration: 1},
        {name: "Task8", start_col: 24, end_col: 29, start_date: "23-11-25", end_date: "28-11-25", duration: 5},
        {name: "Task9", start_col: 29, end_col: 30, start_date: "28-11-25", end_date: "29-11-25", duration: 1},
        {name: "Task0", start_col: 30, end_col: 31, start_date: "29-11-25", end_date: "30-11-25", duration: 1}
    ].map(t => ({ ...new Task(), ...t }));
    
    return { calendar, tasks };
}
