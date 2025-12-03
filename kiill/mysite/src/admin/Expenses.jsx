import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

const EXPENSE_CATEGORIES = ['Utilities', 'Wages', 'Tokens', 'Rent', 'Maintenance', 'Supplies', 'Transport', 'Other'];
const PAYMENT_MODES = ['Cash', 'M-Pesa', 'Bank Transfer', 'Card'];

export default function Expenses() {
  const { expenses, addExpense, deleteExpense, editExpense } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    mode: 'Cash',
    description: ''
  });

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setEditingId(expense.id);
      setFormData({
        category: expense.category,
        date: expense.date,
        amount: expense.amount,
        mode: expense.mode,
        description: expense.description
      });
    } else {
      setEditingId(null);
      setFormData({
        category: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        mode: 'Cash',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      editExpense(editingId, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
    } else {
      addExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    }

    setShowModal(false);
    setFormData({
      category: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      mode: 'Cash',
      description: ''
    });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const expensesByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Expenses</h1>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card padded">
          <p className="muted" style={{ fontSize: 14 }}>Total Expenses</p>
          <p style={{ fontSize: 28, fontWeight: 800, marginTop: 8, color: '#dc2626' }}>
            KES {totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="card padded">
          <p className="muted" style={{ fontSize: 14 }}>Number of Expenses</p>
          <p style={{ fontSize: 28, fontWeight: 800, marginTop: 8, color: '#3b82f6' }}>
            {expenses.length}
          </p>
        </div>
        <div className="card padded">
          <p className="muted" style={{ fontSize: 14 }}>Highest Category</p>
          <p style={{ fontSize: 28, fontWeight: 800, marginTop: 8, color: '#10b981' }}>
            {Object.keys(expensesByCategory).length > 0
              ? Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a)[0][0]
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card padded" style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Expenses by Category</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {Object.entries(expensesByCategory).map(([category, amount]) => (
            <div key={category} style={{
              padding: 12,
              background: '#f3f4f6',
              borderRadius: 8,
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{category}</p>
              <p style={{ fontSize: 18, fontWeight: 700, margin: '4px 0 0 0' }}>
                KES {amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="card padded">
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>All Expenses</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Date</th>
                <th>Amount (KES)</th>
                <th>Mode</th>
                <th>Description</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#9ca3af' }}>
                    No expenses recorded yet
                  </td>
                </tr>
              ) : (
                expenses.map(expense => (
                  <tr key={expense.id}>
                    <td style={{ fontWeight: 600 }}>{expense.category}</td>
                    <td>{expense.date}</td>
                    <td style={{ fontWeight: 600, color: '#dc2626' }}>
                      KES {expense.amount.toLocaleString()}
                    </td>
                    <td>
                      <span className="badge" style={{
                        background: expense.mode === 'Cash' ? '#dbeafe' :
                          expense.mode === 'M-Pesa' ? '#dcfce7' :
                            expense.mode === 'Bank Transfer' ? '#fef3c7' : '#f3e8ff',
                        color: expense.mode === 'Cash' ? '#0c4a6e' :
                          expense.mode === 'M-Pesa' ? '#166534' :
                            expense.mode === 'Bank Transfer' ? '#92400e' : '#581c87'
                      }}>
                        {expense.mode}
                      </span>
                    </td>
                    <td style={{ fontSize: 14, color: '#6b7280' }}>{expense.description || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleOpenModal(expense)}
                          className="btn btn-outline"
                          style={{ padding: '4px 8px' }}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="btn btn-danger"
                          style={{ padding: '4px 8px' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Expense Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            width: '90%',
            maxWidth: 500
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                {editingId ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 4
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                >
                  <option value="">Select a category</option>
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  Amount (KES) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0"
                  required
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  Mode of Payment *
                </label>
                <select
                  value={formData.mode}
                  onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                >
                  {PAYMENT_MODES.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional: Add details about this expense"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 14,
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {editingId ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
