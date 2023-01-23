//function that get 
function getValue() {
    let amountLoaned = parseInt(document.getElementById('loanAmount').value);
    let paymentTerm = parseInt(document.getElementById('payment').value);
    let rate = parseInt(document.getElementById('rate').value);

    let calcResult = doCalc(amountLoaned, paymentTerm, rate);
    displayResults(calcResult, paymentTerm, amountLoaned);
}

// Total Monthly Payment = (amount loaned) * (rate/1200) / (1 – (1 + rate/1200)(-Number of Months) )
// Remaining Balance before the very first month equals the amount of the loan.
// Interest Payment = Previous Remaining Balance * rate/1200
// Principal Payment = Total Monthly Payment - Interest Payment
// At end each month, Remaining Balance = Previous Remaining Balance - principal payments


function doCalc(amountLoaned, paymentTerm, rate) {
    let totalMonthlyPayment = (amountLoaned * (rate / 1200) / (1 - (1 + rate / 1200) ** (- paymentTerm))).toFixed(2);
    let remainingBalance = [];
    remainingBalance[-1] = amountLoaned;
    let interestPayment = [];
    let principalPayment = [];
    principalPayment[0] = 0;
    let totalInterestAmount = [];
    totalInterestAmount[-1] = 0;

    for (let i = 0; i < paymentTerm; i++) {
        interestPayment[i] = remainingBalance[i - 1] * rate / 1200;
        principalPayment[i] = totalMonthlyPayment - interestPayment[i];
        remainingBalance[i] = remainingBalance[i - 1] - principalPayment[i];
        totalInterestAmount[i] = totalInterestAmount[i - 1] + interestPayment[i];

        interestPayment[i] = interestPayment[i].toFixed(2);
        principalPayment[i] = principalPayment[i].toFixed(2);
        remainingBalance[i] = remainingBalance[i].toFixed(2);
    }
    return {
        principalPayment,
        interestPayment,
        totalInterestAmount,
        remainingBalance,
        totalMonthlyPayment,
    }
}

function displayResults(calcResult, paymentTerm, amountLoaned) {
    let tableBody = document.getElementById('mortgageCalcTableBody')
    const tableRowTamplate = document.getElementById('mortgageCalcTableRowTemplate')
    tableBody.innerHTML = '';

    for (let i = 0; i < paymentTerm; i++) {
        let eventRow = document.importNode(tableRowTamplate.content, true);
        let tableCells = eventRow.querySelectorAll('td');

        tableCells[0].textContent = i + 1;
        tableCells[1].textContent = calcResult.totalMonthlyPayment;
        tableCells[2].textContent = calcResult.principalPayment[i];
        tableCells[3].textContent = calcResult.interestPayment[i];
        tableCells[4].textContent = calcResult.totalInterestAmount[i];
        tableCells[5].textContent = calcResult.remainingBalance[i];

        tableBody.appendChild(eventRow);
    }

    document.getElementById('totalPrincipcal').textContent = amountLoaned;
    document.getElementById('totalInterest').textContent = (calcResult.totalInterestAmount[paymentTerm - 1]).toFixed(2);
    document.getElementById('totalCost').textContent = (amountLoaned + calcResult.totalInterestAmount[paymentTerm - 1]).toFixed(2);
    document.getElementById('monthlyPayment').textContent = calcResult.totalMonthlyPayment;

}