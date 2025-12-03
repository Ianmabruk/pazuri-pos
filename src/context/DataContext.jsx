import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);
const API_BASE = 'http://localhost:5000/api';

export function DataProvider({ children }) {
  const [products, setProducts] = useState([
    { id: 1, name: 'Tilapia', price: 350, stock: 50, weight: 1.0, cost: 250, category: 'Fish' },
    { id: 2, name: 'Sardines', price: 150, stock: 20, weight: 0.5, cost: 100, category: 'Fish' },
    { id: 3, name: 'Catfish', price: 400, stock: 30, weight: 1.5, cost: 300, category: 'Fish' },
    { id: 4, name: 'Fish Fillet Combo', price: 500, stock: 15, weight: 2.0, cost: 350, category: 'Combo' },
    { id: 5, name: 'Salmon', price: 600, stock: 8, weight: 1.2, cost: 450, category: 'Fish' },
    { id: 6, name: 'Tuna', price: 550, stock: 12, weight: 1.3, cost: 400, category: 'Fish' },
    { id: 7, name: 'Chips', price: 100, stock: 60, weight: 0.25, cost: 50, category: 'Side' },
    { id: 8, name: 'Salad', price: 80, stock: 35, weight: 0.3, cost: 40, category: 'Side' },
  ]);

  // Combos describe composition of combo products in terms of base product ids and quantities.
  // This lets the UI compute component costs and profit margins for combos.
  const [combos, setCombos] = useState([
    {
      id: 1,
      name: 'Fish Fillet Combo',
      productId: 4, // matches product id in `products`
      components: [
        { productId: 1, qty: 1 },
        { productId: 2, qty: 1 }
      ]
    }
  ]);

  const [sales, setSales] = useState([
    { id: 1, ref: 'INV-1421', total: 1250, method: 'M-Pesa', cashier: 'John Doe', date: '2023-10-01', time: '10:30' },
    { id: 2, ref: 'INV-1422', total: 850, method: 'Cash', cashier: 'Jane Smith', date: '2023-10-01', time: '11:15' },
    { id: 3, ref: 'INV-1423', total: 1499, method: 'Card', cashier: 'John Doe', date: '2023-10-01', time: '12:00' },
    { id: 4, ref: 'INV-1424', total: 2100, method: 'M-Pesa', cashier: 'Jane Smith', date: '2023-10-01', time: '13:45' },
    { id: 5, ref: 'INV-1425', total: 750, method: 'Cash', cashier: 'John Doe', date: '2023-10-01', time: '14:20' },
    { id: 6, ref: 'INV-1426', total: 1800, method: 'Card', cashier: 'Jane Smith', date: '2023-10-01', time: '15:30' },
  ]);

  const [creditRequests, setCreditRequests] = useState([]);
  const [cart, setCart] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [timeTracking, setTimeTracking] = useState({
    currentShift: null,
    shifts: []
  });
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Utilities', date: '2023-10-01', amount: 2500, mode: 'Cash', description: 'Electricity bill', timestamp: '2023-10-01 09:00' },
    { id: 2, category: 'Wages', date: '2023-10-01', amount: 15000, mode: 'Bank Transfer', description: 'Staff salaries', timestamp: '2023-10-01 10:00' },
    { id: 3, category: 'Tokens', date: '2023-10-01', amount: 5000, mode: 'M-Pesa', description: 'Shop tokens', timestamp: '2023-10-01 11:00' },
  ]);
  const [cashierProfile, setCashierProfile] = useState({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    profilePicture: null,
    theme: 'light'
  });
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, action: 'Sale processed - INV-1426', cashier: 'Jane Smith', timestamp: '2023-10-01 15:30', amount: 1800 },
    { id: 2, action: 'Sale processed - INV-1425', cashier: 'John Doe', timestamp: '2023-10-01 14:20', amount: 750 },
    { id: 3, action: 'Credit request submitted', cashier: 'John Doe', timestamp: '2023-10-01 15:00', amount: 1500 },
    { id: 4, action: 'Sale processed - INV-1424', cashier: 'Jane Smith', timestamp: '2023-10-01 13:45', amount: 2100 },
    { id: 5, action: 'Stock added - Tilapia 20kg', user: 'Admin', timestamp: '2023-10-01 09:00' },
    { id: 6, action: 'Credit request submitted', cashier: 'Jane Smith', timestamp: '2023-10-01 14:30', amount: 2000 },
  ]);

  // Fetch credit requests from backend
  const fetchCreditRequests = async () => {
    try {
      const response = await fetch(`${API_BASE}/credit/requests`);
      const data = await response.json();
      setCreditRequests(data);
    } catch (error) {
      console.error('Error fetching credit requests:', error);
    }
  };

  useEffect(() => {
    fetchCreditRequests();
  }, []);

  const addSale = (sale) => {
    setSales(prev => [...prev, { ...sale, id: Date.now() }]);
    setActivityLogs(prev => [...prev, {
      id: Date.now(),
      action: 'Sale processed',
      cashier: sale.cashier,
      timestamp: new Date().toISOString()
    }]);
  };

  const updateProductStock = (productId, quantity) => {
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, stock: p.stock - quantity } : p
    ));
  };

  const addCreditRequest = async (request) => {
    try {
      const response = await fetch(`${API_BASE}/credit/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      const newRequest = await response.json();
      setCreditRequests(prev => [...prev, newRequest]);
      setActivityLogs(prev => [...prev, {
        id: Date.now(),
        action: 'Credit request submitted',
        cashier: request.cashier,
        timestamp: new Date().toISOString(),
        amount: request.amount
      }]);
    } catch (error) {
      console.error('Error adding credit request:', error);
    }
  };

  const approveCreditRequest = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/credit/requests/${id}/approve`, {
        method: 'PUT'
      });
      const updatedRequest = await response.json();
      setCreditRequests(prev => prev.map(r => r.id === id ? updatedRequest : r));
    } catch (error) {
      console.error('Error approving credit request:', error);
    }
  };

  const rejectCreditRequest = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/credit/requests/${id}/reject`, {
        method: 'PUT'
      });
      const updatedRequest = await response.json();
      setCreditRequests(prev => prev.map(r => r.id === id ? updatedRequest : r));
    } catch (error) {
      console.error('Error rejecting credit request:', error);
    }
  };

  const verifyCreditCode = async (code, customer) => {
    try {
      const response = await fetch(`${API_BASE}/credit/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, customer })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error verifying credit code:', error);
      return { valid: false };
    }
  };

  const getCustomerHistory = async (customer) => {
    try {
      const response = await fetch(`${API_BASE}/credit/history/${encodeURIComponent(customer)}`);
      const history = await response.json();
      return history;
    } catch (error) {
      console.error('Error fetching customer history:', error);
      return [];
    }
  };

  // Local verification codes state (for admin to generate codes for cashiers)
  // Each record: { id, code, cashier, createdAt, expiresAt, used }
  const [verificationCodes, setVerificationCodes] = useState([]);

  // Adjust product stock by delta (positive to add, negative to remove)
  const adjustProductStock = (productId, delta, actor = 'Admin') => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
    setActivityLogs(prev => [...prev, {
      id: Date.now(),
      action: delta >= 0 ? `Stock added (${delta})` : `Stock removed (${Math.abs(delta)})`,
      user: actor,
      timestamp: new Date().toISOString()
    }]);
  };

  const setProductStock = (productId, newStock, actor = 'Admin') => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p));
    setActivityLogs(prev => [...prev, {
      id: Date.now(),
      action: `Stock set to ${newStock}`,
      user: actor,
      timestamp: new Date().toISOString()
    }]);
  };

  // Generate a random 6-character uppercase alnum code and store it
  const generateVerificationCode = (cashierName = 'Any', ttlMinutes = 30) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const code = Array.from({ length: 6 }).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    const now = Date.now();
    const rec = { id: now, code, cashier: cashierName, createdAt: now, expiresAt: now + ttlMinutes * 60 * 1000, used: false };
    setVerificationCodes(prev => [rec, ...prev]);
    setActivityLogs(prev => [...prev, { id: Date.now(), action: 'Verification code generated', user: 'Admin', timestamp: new Date().toISOString() }]);
    return rec;
  };

  const revokeVerificationCode = (id) => {
    setVerificationCodes(prev => prev.filter(c => c.id !== id));
    setActivityLogs(prev => [...prev, { id: Date.now(), action: 'Verification code revoked', user: 'Admin', timestamp: new Date().toISOString() }]);
  };

  // Verify a code locally (used by cashier modal) - returns { valid: boolean, reason? }
  const verifyLocalCode = (code) => {
    const rec = verificationCodes.find(c => c.code === code);
    if (!rec) return { valid: false, reason: 'not_found' };
    if (rec.used) return { valid: false, reason: 'used' };
    if (Date.now() > rec.expiresAt) return { valid: false, reason: 'expired' };
    setVerificationCodes(prev => prev.map(c => c.code === code ? { ...c, used: true } : c));
    setActivityLogs(prev => [...prev, { id: Date.now(), action: 'Verification code used', user: rec.cashier || 'Unknown', timestamp: new Date().toISOString() }]);
    return { valid: true };
  };

  // Cart and notification helpers for cashier
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartItem = (productId, quantity) => {
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item).filter(item => item.quantity > 0));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addNotification = (notification) => {
    const id = Date.now();
    const notif = { ...notification, id };
    setNotifications(prev => [...prev, notif]);
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Shift management helpers
  const startShift = (openingFloat) => {
    const newShift = {
      id: Date.now(),
      startTime: new Date().toISOString(),
      openingFloat,
      status: 'active'
    };
    setTimeTracking(prev => ({
      ...prev,
      currentShift: newShift
    }));
    setActivityLogs(prev => [...prev, {
      id: Date.now(),
      action: `Shift started with opening float KES ${openingFloat.toLocaleString()}`,
      user: cashierProfile.name,
      timestamp: new Date().toISOString()
    }]);
  };

  const endShift = (closingCash, closingMpesa) => {
    if (timeTracking.currentShift) {
      const shiftRecord = {
        ...timeTracking.currentShift,
        endTime: new Date().toISOString(),
        closingCash,
        closingMpesa,
        status: 'completed'
      };
      setTimeTracking(prev => ({
        ...prev,
        shifts: [...prev.shifts, shiftRecord],
        currentShift: null
      }));
      setActivityLogs(prev => [...prev, {
        id: Date.now(),
        action: `Shift ended - Cash: KES ${closingCash.toLocaleString()}, M-Pesa: KES ${closingMpesa.toLocaleString()}`,
        user: cashierProfile.name,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  // Profile update helper
  const updateCashierProfile = (updates) => {
    setCashierProfile(prev => ({ ...prev, ...updates }));
  };

  // Expense management helpers
  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    setExpenses(prev => [...prev, newExpense]);
    setActivityLogs(prev => [...prev, {
      id: Date.now(),
      action: `Expense recorded: ${expense.category} - KES ${expense.amount.toLocaleString()}`,
      user: 'Admin',
      timestamp: new Date().toISOString()
    }]);
    return newExpense;
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    setActivityLogs(prev => [...prev, {
      id: Date.now(),
      action: 'Expense deleted',
      user: 'Admin',
      timestamp: new Date().toISOString()
    }]);
  };

  const editExpense = (id, updates) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    setActivityLogs(prev => [...prev, {
      id: Date.now(),
      action: `Expense updated: ${updates.category || 'Unknown'} - KES ${updates.amount || 0}`,
      user: 'Admin',
      timestamp: new Date().toISOString()
    }]);
  };

  const value = {
    products,
    combos,
    verificationCodes,
    setProducts,
    sales,
    creditRequests,
    activityLogs,
    cart,
    notifications,
    timeTracking,
    expenses,
    cashierProfile,
    addSale,
    updateProductStock,
    adjustProductStock,
    setProductStock,
    addCreditRequest,
    approveCreditRequest,
    rejectCreditRequest,
    verifyCreditCode,
    verifyLocalCode,
    generateVerificationCode,
    revokeVerificationCode,
    getCustomerHistory,
    fetchCreditRequests,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    addNotification,
    startShift,
    endShift,
    updateCashierProfile,
    cashierProfile,
    expenses,
    addExpense,
    deleteExpense,
    editExpense
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
