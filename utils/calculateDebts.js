function calculateDebts(members, expenses) {
    const balances = {};

    // initialize balances
    members.forEach(member => {
        balances[member.name] = 0;
    });

    // process each expense
    expenses.forEach(expense => {
        const splitAmount = expense.amount / members.length;

        members.forEach(member => {
            if (member.name !== expense.paidBy) {
                balances[member.name] -= splitAmount;
                balances[expense.paidBy] += splitAmount;
            }
        });
    });

    // convert balances to pair-wise debts
    const debtors = [];
    const creditors = [];

    Object.entries(balances).forEach(([name, balance]) => {
        if (balance < 0) {
            debtors.push({ name, amount: -balance });
        } else if (balance > 0) {
            creditors.push({ name, amount: balance });
        }
    });

    const debts = [];

    // settlement algorithm
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const settleAmount = Math.min(debtor.amount, creditor.amount);

        debts.push({
            from: debtor.name,
            to: creditor.name,
            amount: Number(settleAmount.toFixed(2))
        });

        debtor.amount -= settleAmount;
        creditor.amount -= settleAmount;

        if (debtor.amount === 0) i++;
        if (creditor.amount === 0) j++;
    }

    return debts;
}

module.exports = calculateDebts;
