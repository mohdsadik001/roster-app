export function calculateBudgetMetrics(tasks, amountPerDay, budgetLimit = 50000) {
    const totalAmount = tasks.reduce((sum, task) => sum + task.nett_amount, 0);
    const totalDays = tasks.reduce((sum, task) => sum + task.nett_days, 0);
    const averageTaskCost = tasks.length > 0 ? totalAmount / tasks.length : 0;
    const budgetUtilization = budgetLimit > 0 ? (totalAmount / budgetLimit) * 100 : 0;
    const remainingBudget = budgetLimit - totalAmount;
    const projectedOverrun = totalAmount > budgetLimit ? totalAmount - budgetLimit : 0;
    
    return {
        totalAmount,
        totalDays,
        averageTaskCost,
        budgetUtilization,
        remainingBudget,
        projectedOverrun,
        budgetLimit,
        isOverBudget: totalAmount > budgetLimit,
        status: budgetUtilization > 100 ? 'over' : budgetUtilization > 80 ? 'warning' : 'good'
    };
}

export function calculateTaskCostBreakdown(tasks) {
    return tasks.map(task => ({
        name: task.name,
        cost: task.nett_amount,
        days: task.nett_days,
        costPerDay: task.nett_days > 0 ? task.nett_amount / task.nett_days : 0,
        percentage: 0 // Will be calculated after we have total
    })).map((item, _, arr) => {
        const total = arr.reduce((sum, t) => sum + t.cost, 0);
        return {
            ...item,
            percentage: total > 0 ? (item.cost / total) * 100 : 0
        };
    });
}

export function generateInvoice(tasks, groupProfiles, amountPerDay, invoiceNumber) {
    const invoiceDate = new Date().toLocaleDateString();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
    
    return {
        invoiceNumber,
        invoiceDate,
        dueDate,
        tasks: tasks.map(task => ({
            name: task.name,
            duration: task.duration,
            nettDays: task.nett_days,
            rate: amountPerDay,
            amount: task.nett_amount
        })),
        subtotal: tasks.reduce((sum, task) => sum + task.nett_amount, 0),
        tax: 0, // Can be customized
        total: tasks.reduce((sum, task) => sum + task.nett_amount, 0)
    };
}
