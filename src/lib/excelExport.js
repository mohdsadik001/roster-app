import * as XLSX from 'xlsx';

export function exportCalendarToExcel(calendar, numGroups, totalCalendarDays) {
    const wb = XLSX.utils.book_new();
    const calendarData = [];
    
    const dateRow = ['Date', ...calendar.slice(0, totalCalendarDays).map(d => d.date)];
    calendarData.push(dateRow);
    
    const dayRow = ['Day', ...calendar.slice(0, totalCalendarDays).map(d => d.day)];
    calendarData.push(dayRow);
    
    const taskRow = ['Task', ...calendar.slice(0, totalCalendarDays).map(d => d.task)];
    calendarData.push(taskRow);
    
    for (let g = 0; g < numGroups; g++) {
        const groupRow = [`Group${g+1}`, ...calendar.slice(0, totalCalendarDays).map(d => d.groups[g])];
        calendarData.push(groupRow);
    }
    
    const submissionRow = ['Submission', ...calendar.slice(0, totalCalendarDays).map(d => d.submission)];
    calendarData.push(submissionRow);
    
    const ws = XLSX.utils.aoa_to_sheet(calendarData);
    XLSX.utils.book_append_sheet(wb, ws, "Calendar");
    XLSX.writeFile(wb, `Task_Schedule_Calendar_${Date.now()}.xlsx`);
}

export function exportTaskSummaryToExcel(tasks, numGroups, amountPerDay, totalAmount) {
    const wb = XLSX.utils.book_new();
    const taskData = [];
    
    taskData.push(['Task', 'Start', 'End', 'Start Date', 'End Date', 'Duration', 'Week-off Count', 'Avg Week-off', 'Nett Days', 'Nett Amount']);
    
    let totalDuration = 0, totalWeekoff = 0, totalNettDays = 0, totalAvgWeekoff = 0;
    
    tasks.forEach(t => {
        taskData.push([t.name, t.start_col, t.end_col, t.start_date, t.end_date, t.duration, t.weekoff_count, t.avg_weekoff, t.nett_days, t.nett_amount]);
        totalDuration += t.duration;
        totalWeekoff += t.weekoff_count;
        totalNettDays += t.nett_days;
        totalAvgWeekoff += t.avg_weekoff;
    });
    
    taskData.push(['Total', '', '', '', '', totalDuration, totalWeekoff, totalAvgWeekoff, totalNettDays, totalAmount]);
    taskData.push([]);
    taskData.push(['SUMMARY INFORMATION']);
    taskData.push(['Total Groups:', numGroups]);
    taskData.push(['Total Tasks:', tasks.length]);
    taskData.push(['Amount per Day:', amountPerDay]);
    taskData.push(['Total Amount:', totalAmount]);
    
    const ws = XLSX.utils.aoa_to_sheet(taskData);
    XLSX.utils.book_append_sheet(wb, ws, "Task Summary");
    XLSX.writeFile(wb, `Task_Summary_${Date.now()}.xlsx`);
}

export function exportCompleteReport(calendar, tasks, numGroups, amountPerDay, totalAmount, totalCalendarDays) {
    const wb = XLSX.utils.book_new();
    
    // Calendar Sheet
    const calendarData = [];
    calendarData.push(['Date', ...calendar.slice(0, totalCalendarDays).map(d => d.date)]);
    calendarData.push(['Day', ...calendar.slice(0, totalCalendarDays).map(d => d.day)]);
    calendarData.push(['Task', ...calendar.slice(0, totalCalendarDays).map(d => d.task)]);
    
    for (let g = 0; g < numGroups; g++) {
        calendarData.push([`Group${g+1}`, ...calendar.slice(0, totalCalendarDays).map(d => d.groups[g])]);
    }
    
    calendarData.push(['Submission', ...calendar.slice(0, totalCalendarDays).map(d => d.submission)]);
    
    const wsCalendar = XLSX.utils.aoa_to_sheet(calendarData);
    XLSX.utils.book_append_sheet(wb, wsCalendar, "Calendar");
    
    // Task Summary Sheet
    const taskData = [];
    taskData.push(['Task', 'Start', 'End', 'Start Date', 'End Date', 'Duration', 'Week-off Count', 'Avg Week-off', 'Nett Days', 'Nett Amount']);
    
    let totalDuration = 0, totalWeekoff = 0, totalNettDays = 0, totalAvgWeekoff = 0;
    
    tasks.forEach(t => {
        taskData.push([t.name, t.start_col, t.end_col, t.start_date, t.end_date, t.duration, t.weekoff_count, t.avg_weekoff, t.nett_days, t.nett_amount]);
        totalDuration += t.duration;
        totalWeekoff += t.weekoff_count;
        totalNettDays += t.nett_days;
        totalAvgWeekoff += t.avg_weekoff;
    });
    
    taskData.push(['Total', '', '', '', '', totalDuration, totalWeekoff, totalAvgWeekoff, totalNettDays, totalAmount]);
    
    const wsTasks = XLSX.utils.aoa_to_sheet(taskData);
    XLSX.utils.book_append_sheet(wb, wsTasks, "Task Summary");
    
    // Group Patterns Sheet
    const patternData = [];
    patternData.push(['Group', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
    
    for (let g = 0; g < numGroups; g++) {
        patternData.push([
            `Group${g+1}`,
            g % 2 === 0 ? 'WEEKOFF' : 'present',
            g % 2 === 1 ? 'WEEKOFF' : 'present',
            g % 2 === 0 ? 'WEEKOFF' : 'present',
            g % 2 === 1 ? 'WEEKOFF' : 'present',
            'present', 'present', 'present'
        ]);
    }
    
    const wsPatterns = XLSX.utils.aoa_to_sheet(patternData);
    XLSX.utils.book_append_sheet(wb, wsPatterns, "Group Patterns");
    
    XLSX.writeFile(wb, `Complete_Task_Report_${Date.now()}.xlsx`);
}
