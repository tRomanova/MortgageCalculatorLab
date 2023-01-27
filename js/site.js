//function that get 
function getValue() {
    let paymentTerm = parseInt(document.getElementById('payment').value);
    let amountLoaned = parseFloat(document.getElementById('loanAmount').value);
    let rate = parseFloat(document.getElementById('rate').value);
    let calcResult;

    if (isNaN(paymentTerm) || isNaN(amountLoaned) || isNaN (rate)){
        Swal.fire(
            {
                icon: 'error',
                title: 'Oops',
                text: 'Please enter numerical values!'
            }
        )
    }
    if ( rate > 0 && paymentTerm > 0 && amountLoaned > 0){
        calcResult = doCalc(amountLoaned, paymentTerm, rate);
    }else{
        Swal.fire(
            {
                icon: 'error',
                title: 'Oops',
                text: 'Please enter values that is greater than "0"!'
                // text: 'Interest rate can not be 0.'
            }
        )
    }

    displayResults(calcResult, paymentTerm, amountLoaned);
}

// Total Monthly Payment = (amount loaned) * (rate/1200) / (1 – (1 + rate/1200)(-Number of Months) )
// Remaining Balance before the very first month equals the amount of the loan.
// Interest Payment = Previous Remaining Balance * rate/1200
// Principal Payment = Total Monthly Payment - Interest Payment
// At end each month, Remaining Balance = Previous Remaining Balance - principal payments


function doCalc(amountLoaned, paymentTerm, rate) {
    let totalMonthlyPayment = amountLoaned * (rate / 1200) / (1 - (1 + rate / 1200) ** (- paymentTerm));
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
        tableCells[1].textContent = formatAsCurrency(calcResult.totalMonthlyPayment);
        tableCells[2].textContent = formatAsCurrency(calcResult.principalPayment[i]);
        tableCells[3].textContent = formatAsCurrency(calcResult.interestPayment[i]);
        tableCells[4].textContent = formatAsCurrency(calcResult.totalInterestAmount[i]);
        tableCells[5].textContent = formatAsCurrency(calcResult.remainingBalance[i]);

        tableBody.appendChild(eventRow);
    }

    document.getElementById('totalPrincipcal').textContent = amountLoaned;
    document.getElementById('totalInterest').textContent = formatAsCurrency(calcResult.totalInterestAmount[paymentTerm - 1]);
    document.getElementById('totalCost').textContent = formatAsCurrency(amountLoaned + calcResult.totalInterestAmount[paymentTerm - 1]);
    document.getElementById('monthlyPayment').textContent = formatAsCurrency(calcResult.totalMonthlyPayment);
}
function formatAsCurrency(value){
    return Number(value).toLocaleString("en-IS", {
        style: "currency",
        currency: "USD"
    });
}