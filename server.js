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
const membersFile = path.join(__dirname, 'data', 'members.json');
const readMembers = () => {
    const data = fs.readFileSync(membersFile, 'utf-8');
    return JSON.parse(data);
};

const writeMembers = (data) => {
    fs.writeFileSync(membersFile, JSON.stringify(data, null, 2));
};
const readExpenses = () => {
    const data = fs.readFileSync(expensesFile, 'utf-8');
    return JSON.parse(data);
};
const writeExpenses = (data) => {
    fs.writeFileSync(expensesFile, JSON.stringify(data, null, 2));
};
app.get('/expenses', (req, res) => {
    const expenses = readExpenses();
    res.json(expenses);
});


// POST /members → add member
app.post('/members', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    const members = readMembers();

    // prevent duplicate names
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

// GET /members → get all members
app.get('/members', (req, res) => {
    const members = readMembers();
    res.json(members);
});
app.post('/expenses', (req, res) => {
    const { paidBy, amount, description } = req.body;

    if (!paidBy || !amount) {
        return res.status(400).json({
            message: 'paidBy and amount are required'
        });
    }

    const members = readMembers();
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
app.get('/', (req, res) => {
    res.send('Expense Sharing System Backend Running');
});
//GET /debts
app.get('/debts', (req, res) => {
    const members = readMembers();
    const expenses = readExpenses();

    const debts = calculateDebts(members, expenses);

    res.json(debts);
});
// GET /transactions
app.get('/transactions', (req, res) => {
    const expenses = readExpenses();
    res.json(expenses);
});
//DELETE /members/:id
app.delete('/members/:id', (req, res) => {
    const id = Number(req.params.id);
    const members = readMembers();

    const updatedMembers = members.filter(m => m.id !== id);

    if (members.length === updatedMembers.length) {
        return res.status(404).json({ message: 'Member not found' });
    }

    writeMembers(updatedMembers);
    res.json({ message: 'Member deleted successfully' });
});
// DELETE /expenses 
app.delete('/expenses', (req, res) => {
  writeExpenses([]);
  res.json({ message: 'All transaction history cleared' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
