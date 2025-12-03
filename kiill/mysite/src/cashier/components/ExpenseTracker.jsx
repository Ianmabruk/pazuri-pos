import { useState } from 'react';
import { DollarSign, Plus, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function ExpenseTracker() {
  const { expenses, addExpense } = useData();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'ingredients'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    setFormData({ description: '', amount: '', category: 'ingredients' });
    setShowModal(false);
  };

  const todayExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.timestamp).toDateString();
    const today = new Date().toDateString();
    return expenseDate === today;
  });

  const totalToday = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <div className="card padded">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Expenses Today</h3>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-outline"
            style={{ fontSize: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Plus size={14} />
            Add Expense
          </button>
        </div>

        <div style={{
          padding: 16,
          background: '#fef3c7',
          borderRadius: 8,
          marginBottom: 16
        }}>
          <p style={{ fontSize: 12, color: '#92400e', margin: 0, marginBottom: 4 }}>
            Total Expenses
          </p>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#92400e', margin: 0 }}>
            KES {totalToday.toLocaleString()}
          </p>
        </div>

        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
          {todayExpenses.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 14, padding: 20 }}>
              No expenses recorded today
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {todayExpenses.map(expense => (
                <div
                  key={expense.id}
                  style={{
                    padding: 12,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    background: '#f8fafc'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>
                      {expense.description}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#dc2626' }}>
                      -KES {expense.amount.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280' }}>
                    <span>{expense.category}</span>
                    <span>{new Date(expense.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
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
            maxWidth: 400
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Add Expense</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Oil, Breadcrumbs, Packaging"
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
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                >
                  <option value="ingredients">Ingredients</option>
                  <option value="packaging">Packaging</option>
                  <option value="utilities">Utilities</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  Amount (KES)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Enter amount"
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
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}