const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const expensesFile = path.join(__dirname, 'data', 'expenses.json');
const app = express();
const calculateDebts = require('./utils/calculateDebts');

const PORT = 3000;
app.use(express.json());
app.use(cors());

// file path
const membersFile = path.join(__dirname, 'data', 'members.json');

// helper function to read members
const readMembers = () => {
    const data = fs.readFileSync(membersFile, 'utf-8');
    return JSON.parse(data);
};

// helper function to write members
const writeMembers = (data) => {
    fs.writeFileSync(membersFile, JSON.stringify(data, null, 2));
};
// read expenses
const readExpenses = () => {
    const data = fs.readFileSync(expensesFile, 'utf-8');
    return JSON.parse(data);
};

// write expenses
const writeExpenses = (data) => {
    fs.writeFileSync(expensesFile, JSON.stringify(data, null, 2));
};
// ✅ GET /expenses
app.get('/expenses', (req, res) => {
    const expenses = readExpenses();
    res.json(expenses);
});


// ✅ POST /members → add member
app.post('/members', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    const members = readMembers();

    // 🚫 prevent duplicate names
    const exists = members.find(
        m => m.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
        return res.status(400).json({ message: 'Member already exists' });
    }

    const newMember = {
        id: Date.now(),
        name
    };

    members.push(newMember);
    writeMembers(members);

    res.status(201).json(newMember);
});

// ✅ GET /members → get all members
app.get('/members', (req, res) => {
    const members = readMembers();
    res.json(members);
});
// ✅ POST /expenses → add expense
app.post('/expenses', (req, res) => {
    const { paidBy, amount, description } = req.body;

    if (!paidBy || !amount) {
        return res.status(400).json({
            message: 'paidBy and amount are required'
        });
    }

    const members = readMembers();

    // check if payer exists
    const payerExists = members.find(
        m => m.name.toLowerCase() === paidBy.toLowerCase()
    );

    if (!payerExists) {
        return res.status(400).json({
            message: 'PaidBy member does not exist'
        });
    }

    const expenses = readExpenses();

    const newExpense = {
        id: Date.now(),
        paidBy,
        amount: Number(amount),
        description: description || '',
        createdAt: new Date()
    };

    expenses.push(newExpense);
    writeExpenses(expenses);

    res.status(201).json(newExpense);
});

// test route
app.get('/', (req, res) => {
    res.send('Expense Sharing System Backend Running');
});
// ✅ GET /debts
app.get('/debts', (req, res) => {
    const members = readMembers();
    const expenses = readExpenses();

    const debts = calculateDebts(members, expenses);

    res.json(debts);
});
// ✅ GET /transactions
app.get('/transactions', (req, res) => {
    const expenses = readExpenses();
    res.json(expenses);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
