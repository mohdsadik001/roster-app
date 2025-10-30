export class GroupSolution {
    constructor() {
        this.numGroups = 0;
        this.numMentors = 0;
        this.employeesPerGroup = 0;
        this.employeesPerMentor = 0;
        this.remainder = 0;
        this.distribution = [];
        this.mentorsDistribution = [];
        this.scores = {
            groupSize: 0,
            balance: 0,
            mentorLoad: 0,
            efficiency: 0,
            total: 0
        };
        this.reasoning = [];
    }
}

/**
 * Calculate group size score
 * Ideal: 5-6 employees per group
 */
function calculateGroupSizeScore(avgSize) {
    if (avgSize >= 5 && avgSize <= 6) {
        return 100; // Perfect
    } else if (avgSize >= 4 && avgSize <= 7) {
        return 80 - Math.abs(avgSize - 5.5) * 10;
    } else if (avgSize >= 3 && avgSize <= 8) {
        return 60 - Math.abs(avgSize - 5.5) * 15;
    } else {
        return Math.max(0, 40 - Math.abs(avgSize - 5.5) * 20);
    }
}

/**
 * Calculate balance score
 * How evenly are employees distributed
 */
function calculateBalanceScore(distribution) {
    const max = Math.max(...distribution);
    const min = Math.min(...distribution);
    const difference = max - min;
    
    if (difference === 0) return 100;
    if (difference === 1) return 90;
    if (difference === 2) return 70;
    if (difference === 3) return 50;
    return Math.max(0, 30 - difference * 10);
}

/**
 * Calculate mentor load score
 * Ideal: 5-6 employees per mentor
 * Acceptable: 4-8
 * Maximum recommended: 10
 */
function calculateMentorLoadScore(avgEmployeesPerMentor) {
    if (avgEmployeesPerMentor >= 5 && avgEmployeesPerMentor <= 6) {
        return 100; // Perfect load
    } else if (avgEmployeesPerMentor >= 4 && avgEmployeesPerMentor <= 8) {
        return 85 - Math.abs(avgEmployeesPerMentor - 5.5) * 5;
    } else if (avgEmployeesPerMentor >= 3 && avgEmployeesPerMentor <= 10) {
        return 70 - Math.abs(avgEmployeesPerMentor - 5.5) * 8;
    } else if (avgEmployeesPerMentor < 3) {
        return 50; // Under-utilized mentors
    } else {
        return Math.max(0, 40 - (avgEmployeesPerMentor - 10) * 5); // Overloaded mentors
    }
}

/**
 * Calculate efficiency score
 * Based on mentor utilization and group structure
 */
function calculateEfficiencyScore(numGroups, numMentors, totalEmployees) {
    const mentorUtilization = numGroups / numMentors;
    const employeesPerMentor = totalEmployees / numMentors;
    
    // Each mentor should ideally handle 1 group
    if (mentorUtilization === 1) {
        // Perfect: 1 mentor per group
        if (employeesPerMentor >= 5 && employeesPerMentor <= 6) {
            return 100;
        } else if (employeesPerMentor >= 4 && employeesPerMentor <= 8) {
            return 90;
        } else {
            return 75;
        }
    } else if (mentorUtilization > 1) {
        // Some mentors handle multiple groups (not ideal)
        return Math.max(0, 70 - (mentorUtilization - 1) * 20);
    } else {
        // More mentors than groups (some mentors co-manage)
        return 85;
    }
}

/**
 * Generate employee distribution
 */
function generateDistribution(totalEmployees, numGroups) {
    const base = Math.floor(totalEmployees / numGroups);
    const remainder = totalEmployees % numGroups;
    
    const distribution = Array(numGroups).fill(base);
    
    for (let i = 0; i < remainder; i++) {
        distribution[i]++;
    }
    
    return distribution;
}

/**
 * Generate mentor distribution
 */
function generateMentorDistribution(numMentors, numGroups) {
    if (numMentors >= numGroups) {
        // More mentors than groups - distribute evenly
        const mentorsPerGroup = Math.floor(numMentors / numGroups);
        const remainder = numMentors % numGroups;
        
        const distribution = Array(numGroups).fill(mentorsPerGroup);
        for (let i = 0; i < remainder; i++) {
            distribution[i]++;
        }
        return distribution;
    } else {
        // Fewer mentors than groups - some mentors handle multiple groups
        const groupsPerMentor = Math.ceil(numGroups / numMentors);
        const distribution = Array(numGroups).fill(1);
        
        return distribution;
    }
}

/**
 * Generate reasoning for a solution
 */
function generateReasoning(solution, totalEmployees, totalMentors) {
    const reasoning = [];
    const avgSize = totalEmployees / solution.numGroups;
    const avgPerMentor = totalEmployees / totalMentors;
    const groupsPerMentor = solution.numGroups / totalMentors;
    
    // Mentor load reasoning
    if (avgPerMentor >= 5 && avgPerMentor <= 6) {
        reasoning.push(`✅ Optimal mentor load: ${avgPerMentor.toFixed(1)} employees per mentor`);
    } else if (avgPerMentor < 5) {
        reasoning.push(`⚠️ Mentors under-utilized: Only ${avgPerMentor.toFixed(1)} employees per mentor`);
    } else if (avgPerMentor > 8) {
        reasoning.push(`⚠️ High mentor load: ${avgPerMentor.toFixed(1)} employees per mentor (consider hiring more mentors)`);
    } else {
        reasoning.push(`✅ Acceptable mentor load: ${avgPerMentor.toFixed(1)} employees per mentor`);
    }
    
    // Group size reasoning
    if (avgSize >= 5 && avgSize <= 6) {
        reasoning.push(`✅ Perfect group size: ${avgSize.toFixed(1)} employees per group`);
    } else if (avgSize < 5) {
        reasoning.push(`⚠️ Small groups: ${avgSize.toFixed(1)} employees per group`);
    } else {
        reasoning.push(`⚠️ Large groups: ${avgSize.toFixed(1)} employees per group`);
    }
    
    // Mentor-to-group ratio
    if (groupsPerMentor === 1) {
        reasoning.push(`✅ Ideal structure: 1 mentor per group (${totalMentors} mentors for ${solution.numGroups} groups)`);
    } else if (groupsPerMentor < 1) {
        const mentorsPerGroup = totalMentors / solution.numGroups;
        reasoning.push(`✅ Enhanced support: ${mentorsPerGroup.toFixed(1)} mentors per group`);
    } else {
        reasoning.push(`⚠️ Stretched mentors: Each mentor handles ${groupsPerMentor.toFixed(1)} groups on average`);
    }
    
    // Balance reasoning
    const max = Math.max(...solution.distribution);
    const min = Math.min(...solution.distribution);
    if (max === min) {
        reasoning.push(`✅ Perfect balance: All groups have ${min} employees`);
    } else {
        reasoning.push(`⚠️ Groups vary: ${min}-${max} employees per group`);
    }
    
    // Efficiency insight
    if (solution.numGroups === totalMentors && avgPerMentor >= 5 && avgPerMentor <= 6) {
        reasoning.push(`🌟 Optimal configuration: Perfect mentor-to-group ratio with ideal team sizes`);
    }
    
    return reasoning;
}

/**
 * Calculate optimal groups based on employees and mentors
 */
export function calculateOptimalGroups(totalEmployees, totalMentors) {
    if (totalEmployees < 2) {
        return {
            solutions: [],
            bestSolution: null,
            error: "Need at least 2 employees"
        };
    }
    
    if (totalMentors < 1) {
        return {
            solutions: [],
            bestSolution: null,
            error: "Need at least 1 mentor"
        };
    }
    
    if (totalEmployees < totalMentors) {
        return {
            solutions: [],
            bestSolution: null,
            error: "Cannot have more mentors than employees"
        };
    }
    
    const solutions = [];
    
    // Strategy 1: Groups equal to mentors (1 mentor per group)
    if (totalMentors >= 2 && totalMentors <= 15) {
        const numGroups = totalMentors;
        const solution = new GroupSolution();
        solution.numGroups = numGroups;
        solution.numMentors = totalMentors;
        solution.distribution = generateDistribution(totalEmployees, numGroups);
        solution.mentorsDistribution = Array(numGroups).fill(1);
        solution.employeesPerGroup = totalEmployees / numGroups;
        solution.employeesPerMentor = totalEmployees / totalMentors;
        
        const avgSize = totalEmployees / numGroups;
        const avgPerMentor = totalEmployees / totalMentors;
        
        solution.scores.groupSize = calculateGroupSizeScore(avgSize);
        solution.scores.balance = calculateBalanceScore(solution.distribution);
        solution.scores.mentorLoad = calculateMentorLoadScore(avgPerMentor);
        solution.scores.efficiency = calculateEfficiencyScore(numGroups, totalMentors, totalEmployees);
        
        solution.scores.total = (
            solution.scores.groupSize * 0.30 +
            solution.scores.balance * 0.15 +
            solution.scores.mentorLoad * 0.40 +
            solution.scores.efficiency * 0.15
        );
        
        solution.reasoning = generateReasoning(solution, totalEmployees, totalMentors);
        solutions.push(solution);
    }
    
    // Strategy 2: Groups = mentors * 2 (each mentor handles 2 groups)
    if (totalMentors * 2 <= 20) {
        const numGroups = totalMentors * 2;
        const avgSize = totalEmployees / numGroups;
        
        if (avgSize >= 3) { // Minimum 3 per group
            const solution = new GroupSolution();
            solution.numGroups = numGroups;
            solution.numMentors = totalMentors;
            solution.distribution = generateDistribution(totalEmployees, numGroups);
            solution.mentorsDistribution = generateMentorDistribution(totalMentors, numGroups);
            solution.employeesPerGroup = totalEmployees / numGroups;
            solution.employeesPerMentor = totalEmployees / totalMentors;
            
            const avgPerMentor = totalEmployees / totalMentors;
            
            solution.scores.groupSize = calculateGroupSizeScore(avgSize);
            solution.scores.balance = calculateBalanceScore(solution.distribution);
            solution.scores.mentorLoad = calculateMentorLoadScore(avgPerMentor);
            solution.scores.efficiency = calculateEfficiencyScore(numGroups, totalMentors, totalEmployees);
            
            solution.scores.total = (
                solution.scores.groupSize * 0.30 +
                solution.scores.balance * 0.15 +
                solution.scores.mentorLoad * 0.40 +
                solution.scores.efficiency * 0.15
            );
            
            solution.reasoning = generateReasoning(solution, totalEmployees, totalMentors);
            solutions.push(solution);
        }
    }
    
    // Strategy 3: Ideal group size (5-6 per group), adjust number of groups
    const idealGroupSize = 5.5;
    const idealNumGroups = Math.round(totalEmployees / idealGroupSize);
    
    if (idealNumGroups >= 2 && idealNumGroups <= 20 && idealNumGroups !== totalMentors) {
        const solution = new GroupSolution();
        solution.numGroups = idealNumGroups;
        solution.numMentors = totalMentors;
        solution.distribution = generateDistribution(totalEmployees, idealNumGroups);
        solution.mentorsDistribution = generateMentorDistribution(totalMentors, idealNumGroups);
        solution.employeesPerGroup = totalEmployees / idealNumGroups;
        solution.employeesPerMentor = totalEmployees / totalMentors;
        
        const avgSize = totalEmployees / idealNumGroups;
        const avgPerMentor = totalEmployees / totalMentors;
        
        solution.scores.groupSize = calculateGroupSizeScore(avgSize);
        solution.scores.balance = calculateBalanceScore(solution.distribution);
        solution.scores.mentorLoad = calculateMentorLoadScore(avgPerMentor);
        solution.scores.efficiency = calculateEfficiencyScore(idealNumGroups, totalMentors, totalEmployees);
        
        solution.scores.total = (
            solution.scores.groupSize * 0.30 +
            solution.scores.balance * 0.15 +
            solution.scores.mentorLoad * 0.40 +
            solution.scores.efficiency * 0.15
        );
        
        solution.reasoning = generateReasoning(solution, totalEmployees, totalMentors);
        solutions.push(solution);
    }
    
    // Strategy 4: Groups = mentors / 2 (2 mentors per group) - if lots of mentors
    if (totalMentors >= 4 && totalMentors % 2 === 0) {
        const numGroups = Math.floor(totalMentors / 2);
        const solution = new GroupSolution();
        solution.numGroups = numGroups;
        solution.numMentors = totalMentors;
        solution.distribution = generateDistribution(totalEmployees, numGroups);
        solution.mentorsDistribution = Array(numGroups).fill(2);
        solution.employeesPerGroup = totalEmployees / numGroups;
        solution.employeesPerMentor = totalEmployees / totalMentors;
        
        const avgSize = totalEmployees / numGroups;
        const avgPerMentor = totalEmployees / totalMentors;
        
        solution.scores.groupSize = calculateGroupSizeScore(avgSize);
        solution.scores.balance = calculateBalanceScore(solution.distribution);
        solution.scores.mentorLoad = calculateMentorLoadScore(avgPerMentor);
        solution.scores.efficiency = calculateEfficiencyScore(numGroups, totalMentors, totalEmployees);
        
        solution.scores.total = (
            solution.scores.groupSize * 0.30 +
            solution.scores.balance * 0.15 +
            solution.scores.mentorLoad * 0.40 +
            solution.scores.efficiency * 0.15
        );
        
        solution.reasoning = generateReasoning(solution, totalEmployees, totalMentors);
        solutions.push(solution);
    }
    
    // Strategy 5: Balanced approach (try to get 5-6 per group considering mentors)
    const minGroupSize = 5;
    const maxGroupSize = 6;
    
    for (let groupSize = minGroupSize; groupSize <= maxGroupSize; groupSize++) {
        const numGroups = Math.round(totalEmployees / groupSize);
        
        if (numGroups >= 2 && numGroups <= 20 && !solutions.find(s => s.numGroups === numGroups)) {
            const solution = new GroupSolution();
            solution.numGroups = numGroups;
            solution.numMentors = totalMentors;
            solution.distribution = generateDistribution(totalEmployees, numGroups);
            solution.mentorsDistribution = generateMentorDistribution(totalMentors, numGroups);
            solution.employeesPerGroup = totalEmployees / numGroups;
            solution.employeesPerMentor = totalEmployees / totalMentors;
            
            const avgSize = totalEmployees / numGroups;
            const avgPerMentor = totalEmployees / totalMentors;
            
            solution.scores.groupSize = calculateGroupSizeScore(avgSize);
            solution.scores.balance = calculateBalanceScore(solution.distribution);
            solution.scores.mentorLoad = calculateMentorLoadScore(avgPerMentor);
            solution.scores.efficiency = calculateEfficiencyScore(numGroups, totalMentors, totalEmployees);
            
            solution.scores.total = (
                solution.scores.groupSize * 0.30 +
                solution.scores.balance * 0.15 +
                solution.scores.mentorLoad * 0.40 +
                solution.scores.efficiency * 0.15
            );
            
            solution.reasoning = generateReasoning(solution, totalEmployees, totalMentors);
            solutions.push(solution);
        }
    }
    
    // Sort by total score
    solutions.sort((a, b) => b.scores.total - a.scores.total);
    
    // Return top 5 unique solutions
    const uniqueSolutions = [];
    const seenGroups = new Set();
    
    for (const solution of solutions) {
        if (!seenGroups.has(solution.numGroups) && uniqueSolutions.length < 5) {
            uniqueSolutions.push(solution);
            seenGroups.add(solution.numGroups);
        }
    }
    
    const bestSolution = uniqueSolutions[0];
    
    return {
        solutions: uniqueSolutions,
        bestSolution,
        totalEmployees,
        totalMentors,
        error: null
    };
}

/**
 * Get recommendation text
 */
export function getRecommendationText(solution, totalEmployees, totalMentors) {
    const groupsPerMentor = solution.numGroups / totalMentors;
    
    let recommendation = `For ${totalEmployees} employees and ${totalMentors} mentors, we recommend ${solution.numGroups} groups. `;
    
    if (solution.numGroups === totalMentors) {
        recommendation += `Each mentor will handle 1 group. `;
    } else if (groupsPerMentor > 1) {
        recommendation += `Each mentor will handle approximately ${groupsPerMentor.toFixed(1)} groups. `;
    } else {
        const mentorsPerGroup = totalMentors / solution.numGroups;
        recommendation += `Each group will have approximately ${mentorsPerGroup.toFixed(1)} mentors. `;
    }
    
    recommendation += `Each group will have ${solution.employeesPerGroup.toFixed(1)} employees on average. `;
    recommendation += `This configuration scores ${solution.scores.total.toFixed(1)}/100.`;
    
    return recommendation;
}
