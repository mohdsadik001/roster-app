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


export class GroupProfile {
    constructor() {
        this.id = 0;
        this.name = '';
        this.skillLevel = 'Junior'; // Junior, Mid, Senior
        this.leader = '';
        this.customWeekoffDays = []; // e.g., ['Monday', 'Wednesday']
        this.color = '#3B82F6';
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

// Check if previous day had any weekoffs
export function hadWeekoffPreviousDay(dayEntry, dayIndex, calendar, numGroups) {
    if (dayIndex === 0) return false; // First day, no previous day
    
    const previousDay = calendar[dayIndex - 1];
    
    // Check if any group had weekoff on previous day
    for (let g = 0; g < numGroups; g++) {
        if (isWeekoff(previousDay.groups[g])) {
            return true; // At least one group had weekoff yesterday
        }
    }
    
    return false;
}

// Validate if day is valid for submission (all groups present + no previous weekoff)
// STRICT: Only Saturday and Sunday are valid for submissions
export function isValidSubmissionDay(dayEntry, dayIndex, calendar, numGroups) {
    const day = dayEntry.day;
    
    // Rule 1: ONLY Saturday and Sunday allowed
    if (day !== 'Saturday' && day !== 'Sunday') {
        return false;
    }
    
    // Rule 2: All groups must be present/mandatory today
    for (let g = 0; g < numGroups; g++) {
        const status = dayEntry.groups[g];
        if (status !== 'Mandatory' && status !== 'present') {
            return false;
        }
    }
    
    // Rule 3: Previous day should have had all groups present
    if (dayIndex > 0) {
        const previousDay = calendar[dayIndex - 1];
        for (let g = 0; g < numGroups; g++) {
            if (isWeekoff(previousDay.groups[g])) {
                return false;
            }
        }
    }
    
    return true;
}


// Find next valid submission day
export function findNextValidSubmissionDay(calendar, startIndex, numGroups, totalCalendarDays) {
    for (let i = startIndex; i < totalCalendarDays; i++) {
        if (isValidSubmissionDay(calendar[i], i, calendar, numGroups)) {
            return i;
        }
    }
    return -1; // No valid day found
}

// Automatically assign submissions for all tasks
export function autoAssignSubmissions(calendar, tasks, numGroups, totalCalendarDays) {
    // Clear all existing submissions first
    calendar.forEach(day => {
        day.submission = '';
    });
    
    console.log('\n🔍 Starting submission assignment...\n');
    
    // For each task, find its valid submission day
    tasks.forEach((task, index) => {
        // Start searching from the task's end column
        const startSearchIdx = task.end_col - 2; // Convert column to index
        
        console.log(`\n📋 ${task.name}:`);
        console.log(`   Task ends at column ${task.end_col} (${calendar[startSearchIdx]?.date})`);
        console.log(`   Searching for valid submission day...`);
        
        // Find the next valid submission day
        const validDayIdx = findNextValidSubmissionDay(
            calendar, 
            startSearchIdx, 
            numGroups, 
            totalCalendarDays
        );
        
        if (validDayIdx !== -1) {
            const submissionDay = calendar[validDayIdx];
            calendar[validDayIdx].submission = task.name.toLowerCase();
            
            // Show what made this day valid
            const prevDay = validDayIdx > 0 ? calendar[validDayIdx - 1] : null;
            const prevDayWeekoffs = prevDay ? prevDay.groups.filter(g => g === 'weekoff').length : 0;
            const currentDayWeekoffs = submissionDay.groups.filter(g => g === 'weekoff').length;
            
            console.log(`   ✅ Valid day found: ${submissionDay.date} (${submissionDay.day})`);
            console.log(`      - Previous day (${prevDay?.date}): ${prevDayWeekoffs} weekoffs`);
            console.log(`      - Current day: ${currentDayWeekoffs} weekoffs, all groups present`);
        } else {
            console.warn(`   ⚠️ No valid submission day found for ${task.name}`);
        }
    });
    
    console.log('\n✅ Submission assignment complete\n');
    
    return calendar;
}



// Find the next available task slot
export function findNextAvailableSlot(tasks, totalCalendarDays) {
    if (tasks.length === 0) {
        return {
            startCol: 2,
            endCol: 3,
            startDate: "01-11-25",
            endDate: "02-11-25"
        };
    }
    
    // Find the last task
    const lastTask = tasks.reduce((latest, task) => 
        task.end_col > latest.end_col ? task : latest
    , tasks[0]);
    
    const nextStartCol = lastTask.end_col;
    const nextEndCol = Math.min(nextStartCol + 1, totalCalendarDays + 1);
    
    // Calculate dates
    const nextStartDay = nextStartCol - 1; // Column 2 = day 1
    const nextEndDay = nextEndCol - 1;
    
    const startDate = `${String(nextStartDay).padStart(2, '0')}-11-25`;
    const endDate = `${String(nextEndDay).padStart(2, '0')}-11-25`;
    
    return {
        startCol: nextStartCol,
        endCol: nextEndCol,
        startDate: startDate,
        endDate: endDate
    };
}

// Calculate end date based on start date and duration
export function calculateEndDate(startDate, duration) {
    const [day, month, year] = startDate.split('-').map(Number);
    const endDay = day + duration - 1;
    return `${String(endDay).padStart(2, '0')}-${String(month).padStart(2, '0')}-${String(year).padStart(2, '0')}`;
}

// Calculate end column based on start column and duration
export function calculateEndColumn(startCol, duration) {
    return startCol + duration;
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
    
    // Create calendar first
    const calendar = [];
    for (let i = 0; i < 30; i++) {
        const day = new DayEntry();
        day.date = dates[i];
        day.day = days[i];
        day.task = taskAssignments[i];
        day.submission = "";
        day.groups = [];
        calendar.push(day);
    }
    
    // Apply group patterns
    const numGroups = 5;
    autoAssignGroupPatterns(calendar, numGroups, 30);
    
    // Define tasks
    const tasks = [
        {name: "task1", start_col: 2, end_col: 3, start_date: "01-11-25", end_date: "02-11-25", duration: 2},
        {name: "task2", start_col: 3, end_col: 9, start_date: "02-11-25", end_date: "08-11-25", duration: 6},
        {name: "task3", start_col: 8, end_col: 10, start_date: "07-11-25", end_date: "09-11-25", duration: 1},
        {name: "task4", start_col: 10, end_col: 16, start_date: "09-11-25", end_date: "15-11-25", duration: 6},
        {name: "task5", start_col: 15, end_col: 17, start_date: "14-11-25", end_date: "16-11-25", duration: 1},
        {name: "task6", start_col: 17, end_col: 23, start_date: "16-11-25", end_date: "22-11-25", duration: 6},
        {name: "task7", start_col: 23, end_col: 24, start_date: "22-11-25", end_date: "23-11-25", duration: 1},
        {name: "task8", start_col: 24, end_col: 29, start_date: "23-11-25", end_date: "28-11-25", duration: 5},
        {name: "task9", start_col: 29, end_col: 30, start_date: "28-11-25", end_date: "29-11-25", duration: 1},
        {name: "task0", start_col: 30, end_col: 31, start_date: "29-11-25", end_date: "30-11-25", duration: 1}
    ].map(t => ({ ...new Task(), ...t }));
    
    // Automatically assign submissions to valid days with detailed logging
    autoAssignSubmissions(calendar, tasks, numGroups, 30);
    
    // Optional: Show validation for a few specific days for debugging
    console.log('\n🔍 Sample Day Validations:');
    [6, 7, 8, 13, 14, 15, 21, 22, 23].forEach(idx => {
        const validation = explainDayValidity(calendar, idx, numGroups);
        console.log(`\n${validation.date} (${validation.day}): ${validation.isValid ? '✅ VALID' : '❌ INVALID'}`);
        validation.reasons.forEach(r => console.log(`  ${r}`));
    });
    
    return { calendar, tasks };
}
