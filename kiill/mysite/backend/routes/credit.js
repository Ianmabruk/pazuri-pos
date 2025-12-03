const express = require('express');
const router = express.Router();

// In-memory storage for demo (replace with database in production)
let creditRequests = [
  { id: 1, cashier: 'Jane Smith', customer: 'Alice Johnson', amount: 2000, reason: 'Regular customer, requested 7-day credit', status: 'pending', date: '2023-10-01', time: '14:30', verificationCode: null },
  { id: 2, cashier: 'John Doe', customer: 'Bob Williams', amount: 1500, reason: 'Bulk order, payment next week', status: 'pending', date: '2023-10-01', time: '15:00', verificationCode: null },
  { id: 3, cashier: 'Jane Smith', customer: 'Carol Davis', amount: 3000, reason: 'Corporate order, invoice payment', status: 'approved', date: '2023-09-30', time: '10:00', verificationCode: '123456' },
];

let customerHistory = {
  'Alice Johnson': [{ id: 1, amount: 2000, status: 'pending', date: '2023-10-01' }],
  'Bob Williams': [{ id: 2, amount: 1500, status: 'pending', date: '2023-10-01' }],
  'Carol Davis': [{ id: 3, amount: 3000, status: 'approved', date: '2023-09-30' }],
};

// Get all credit requests
router.get('/requests', (req, res) => {
  res.json(creditRequests);
});

// Submit new credit request
router.post('/requests', (req, res) => {
  const { cashier, customer, amount, reason } = req.body;
  const newRequest = {
    id: Date.now(),
    cashier,
    customer,
    amount,
    reason,
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    verificationCode: null
  };
  creditRequests.push(newRequest);

  // Add to customer history
  if (!customerHistory[customer]) {
    customerHistory[customer] = [];
  }
  customerHistory[customer].push({
    id: newRequest.id,
    amount: newRequest.amount,
    status: newRequest.status,
    date: newRequest.date
  });

  res.status(201).json(newRequest);
});

// Approve credit request and generate verification code
router.put('/requests/:id/approve', (req, res) => {
  const id = parseInt(req.params.id);
  const request = creditRequests.find(r => r.id === id);
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }
  request.status = 'approved';
  request.verificationCode = Math.random().toString(36).substr(2, 6).toUpperCase(); // Generate 6-char code

  // Update customer history
  const history = customerHistory[request.customer].find(h => h.id === id);
  if (history) history.status = 'approved';

  res.json(request);
});

// Reject credit request
router.put('/requests/:id/reject', (req, res) => {
  const id = parseInt(req.params.id);
  const request = creditRequests.find(r => r.id === id);
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }
  request.status = 'rejected';

  // Update customer history
  const history = customerHistory[request.customer].find(h => h.id === id);
  if (history) history.status = 'rejected';

  res.json(request);
});

// Verify credit with code
router.post('/verify', (req, res) => {
  const { code, customer } = req.body;
  const request = creditRequests.find(r => r.customer === customer && r.verificationCode === code && r.status === 'approved');
  if (request) {
    res.json({ valid: true, request });
  } else {
    res.json({ valid: false });
  }
});

// Get customer credit history
router.get('/history/:customer', (req, res) => {
  const customer = req.params.customer;
  res.json(customerHistory[customer] || []);
});

module.exports = router;
