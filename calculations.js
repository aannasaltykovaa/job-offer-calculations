// convert an annual base salary into monthly pay
function calculateMonthlyIncome(annualSalary) {
    return annualSalary / 12;
}

// calculate annual compensation before taxes
function calculateTotalCompensation(salary, bonus, stock) {
    return salary + bonus + stock;
}

// calculate the base salary equivalent for an hourly employee
function calculateHourlyRate(annualSalary) {
    return annualSalary / 2080; // 40 hours per week for 52 weeks
}

// show the approximate value of paid days off, not extra compensation
function calculatePtoValue(annualSalary, ptoDays) {
    return (annualSalary / 260) * ptoDays;
}

// a positive result means job 2 offers more than job 1
function calculateDifference(job1Value, job2Value) {
    return job2Value - job1Value;
}

// estimate 2026 federal income tax for a single filer using the standard deduction
function calculateFederalTax(annualCompensation) {
    const taxableIncome = Math.max(0, annualCompensation - 16100);
    const brackets = [
        { limit: 12400, rate: 0.10 },
        { limit: 50400, rate: 0.12 },
        { limit: 105700, rate: 0.22 },
        { limit: 201775, rate: 0.24 },
        { limit: 256225, rate: 0.32 },
        { limit: 640600, rate: 0.35 },
        { limit: Infinity, rate: 0.37 }
    ];

    let tax = 0;
    let previousLimit = 0;

    for (const bracket of brackets) {
        if (taxableIncome <= previousLimit) {
            break;
        }
        const amountInBracket = Math.min(taxableIncome, bracket.limit) - previousLimit;
        tax += amountInBracket * bracket.rate;
        previousLimit = bracket.limit;
    }

    return tax;
}

// estimate employee social security and medicare taxes for 2026
function calculatePayrollTax(annualCompensation) {
    const socialSecurity = Math.min(annualCompensation, 184500) * 0.062;
    const medicare = annualCompensation * 0.0145;
    const additionalMedicare = Math.max(0, annualCompensation - 200000) * 0.009;
    return socialSecurity + medicare + additionalMedicare;
}

// the state percentage is an editable estimate, not a full state tax calculation
function calculateAfterTaxIncome(annualCompensation, stateRatePercent) {
    const federalTax = calculateFederalTax(annualCompensation);
    const payrollTax = calculatePayrollTax(annualCompensation);
    const stateTax = annualCompensation * (stateRatePercent / 100);
    return Math.max(0, annualCompensation - federalTax - payrollTax - stateTax);
}

// project base salary, applying yearly raises and any service-year milestones
function calculateRaiseProjection(baseSalary, bonus, stock, annualRaisePercent, serviceMilestones, manualRaises, years) {
    let projectedSalary = baseSalary;
    const projection = [{
        year: 0,
        baseSalary: projectedSalary,
        totalCompensation: projectedSalary + bonus + stock
    }];

    for (let year = 1; year <= years; year += 1) {
        const raisePercent = manualRaises[year] ?? annualRaisePercent;
        projectedSalary *= 1 + (raisePercent / 100);

        for (const milestone of serviceMilestones) {
            if (milestone.year === year) {
                projectedSalary *= 1 + (milestone.raisePercent / 100);
            }
        }

        projection.push({
            year,
            baseSalary: projectedSalary,
            totalCompensation: projectedSalary + bonus + stock
        });
    }

    return projection;
}
