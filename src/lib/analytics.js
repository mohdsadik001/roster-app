export function calculateAnalytics(tasks, calendar, numGroups, totalCalendarDays) {
    // Group utilization
    const groupUtilization = Array.from({ length: numGroups }, (_, g) => {
        let workDays = 0;
        let totalDays = 0;
        
        for (let i = 0; i < totalCalendarDays; i++) {
            totalDays++;
            if (calendar[i].groups[g] !== 'weekoff') {
                workDays++;
            }
        }
        
        return {
            group: g + 1,
            workDays,
            totalDays,
            utilization: totalDays > 0 ? (workDays / totalDays) * 100 : 0
        };
    });

    // Task timeline data
    const taskTimeline = tasks.map(task => ({
        name: task.name,
        duration: task.duration,
        nettDays: task.nett_days,
        weekoffs: task.weekoff_count,
        amount: task.nett_amount,
        startCol: task.start_col,
        endCol: task.end_col
    }));

    // Revenue by week
    const weeklyRevenue = {};
    tasks.forEach(task => {
        const startDay = parseInt(task.start_date.split('-')[0]);
        const week = Math.floor((startDay - 1) / 7) + 1;
        if (!weeklyRevenue[week]) {
            weeklyRevenue[week] = 0;
        }
        weeklyRevenue[week] += task.nett_amount;
    });

    const revenueData = Object.keys(weeklyRevenue).map(week => ({
        week: `Week ${week}`,
        revenue: weeklyRevenue[week]
    }));

    // Peak workload days
    const workloadByDay = Array.from({ length: totalCalendarDays }, (_, i) => {
        let activeGroups = 0;
        for (let g = 0; g < numGroups; g++) {
            if (calendar[i].groups[g] !== 'weekoff') {
                activeGroups++;
            }
        }
        return {
            date: calendar[i].date,
            day: calendar[i].day,
            activeGroups,
            utilization: (activeGroups / numGroups) * 100
        };
    });

    return {
        groupUtilization,
        taskTimeline,
        revenueData,
        workloadByDay,
        totalTasks: tasks.length,
        totalRevenue: tasks.reduce((sum, t) => sum + t.nett_amount, 0),
        avgTaskDuration: tasks.length > 0 ? tasks.reduce((sum, t) => sum + t.duration, 0) / tasks.length : 0,
        avgGroupUtilization: groupUtilization.reduce((sum, g) => sum + g.utilization, 0) / numGroups
    };
}
