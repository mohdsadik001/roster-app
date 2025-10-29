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

// Add this function after isWeekoff() and before daysBetween()

export function isValidSubmissionDay(dayEntry, numGroups) {
    const day = dayEntry.day;
    
    // Saturday, Sunday, and Friday - all groups present (valid submission days)
    if (day === 'Friday' || day === 'Saturday' || day === 'Sunday') {
        return true;
    }
    
    // Check if ALL groups are present (no weekoffs)
    for (let g = 0; g < numGroups; g++) {
        if (isWeekoff(dayEntry.groups[g])) {
            return false; // At least one group is off
        }
    }
    
    return true;
}


export function findNextValidSubmissionDay(calendar, startIndex, numGroups, totalCalendarDays) {
    for (let i = startIndex; i < totalCalendarDays; i++) {
        if (isValidSubmissionDay(calendar[i], numGroups)) {
            return i;
        }
    }
    return -1; // No valid day found
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
            // Saturday and Sunday - MANDATORY for ALL groups (weekends)
            if (currentDay === "Saturday" || currentDay === "Sunday") {
                calendar[i].groups[g] = "Mandatory";
            }
            // First 2 days are ALWAYS Mandatory (regardless of day)
            else if (i < 2) {
                calendar[i].groups[g] = "Mandatory";
            }
            // Friday - ALL GROUPS PRESENT (no weekoff)
            else if (currentDay === "Friday") {
                calendar[i].groups[g] = "present";
            }
            // Monday to Thursday - Alternating weekoff pattern
            else {
                // Odd groups (1,3,5,...): Weekoff on Monday & Wednesday
                if (g % 2 === 0) { // Group 1,3,5,7,...
                    if (currentDay === "Monday" || currentDay === "Wednesday") {
                        calendar[i].groups[g] = "weekoff";
                    } else {
                        calendar[i].groups[g] = "present";
                    }
                }
                // Even groups (2,4,6,...): Weekoff on Tuesday & Thursday
                else { // Group 2,4,6,8,...
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
      "Task1",
      "Task2",
      "",
      "",
      "",
      "",
      "Task3",
      "",
      "Task4",
      "",
      "",
      "",
      "",
      "Task5",
      "",
      "Task6",
      "",
      "",
      "",
      "",
      "",
      "Task7",
      "Task8",
      "",
      "",
      "",
      "",
      "Task9",
      "Task10",
      "",
    ];
    
    // Create calendar first
    const calendar = [];
    for (let i = 0; i < 30; i++) {
        const day = new DayEntry();
        day.date = dates[i];
        day.day = days[i];
        day.task = taskAssignments[i];
        day.submission = ""; // Initialize empty
        day.groups = [];
        calendar.push(day);
    }
    
    // Apply group patterns
    const numGroups = 5;
    autoAssignGroupPatterns(calendar, numGroups, 30);
    
    // NOW assign submissions ONLY on valid days
    const taskSubmissions = [
        { task: "Task1", startIdx: 1 },   // Nov 1 (Mandatory day)
        { task: "Task2", startIdx: 2 },   // Need to find valid day after Nov 2
        { task: "Task3", startIdx: 7 },   // Need to find valid day after Nov 7
        { task: "Task4", startIdx: 9 },   // Need to find valid day after Nov 9
        { task: "Task5", startIdx: 14 },  // Need to find valid day after Nov 14
        { task: "Task6", startIdx: 17 },  // Need to find valid day after Nov 17
        { task: "Task7", startIdx: 22 },  // Need to find valid day after Nov 22
        { task: "Task8", startIdx: 24 },  // Need to find valid day after Nov 24
        { task: "Task9", startIdx: 28 },  // Need to find valid day after Nov 28
        { task: "Task10", startIdx: 29 }   // Need to find valid day after Nov 29
    ];
    
    // Assign submissions on valid days only
    taskSubmissions.forEach(({ task, startIdx }) => {
        const validDayIdx = findNextValidSubmissionDay(calendar, startIdx, numGroups, 30);
        if (validDayIdx !== -1) {
            calendar[validDayIdx].submission = task;
        }
    });
    
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
        {name: "Task10", start_col: 30, end_col: 31, start_date: "29-11-25", end_date: "30-11-25", duration: 1}
    ].map(t => ({ ...new Task(), ...t }));
    
    return { calendar, tasks };
}
