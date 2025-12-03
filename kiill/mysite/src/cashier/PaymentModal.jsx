import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { X, CreditCard, DollarSign, Smartphone, Building, Receipt } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', icon: DollarSign },
  { id: 'mpesa', name: 'M-PESA', icon: Smartphone },
  { id: 'card', name: 'Card', icon: CreditCard },
  { id: 'bank', name: 'Bank Transfer', icon: Building }
];

export default function PaymentModal({ isOpen, onClose, total, cart, onPaymentComplete }) {
  const { addSale, updateProductStock, adjustProductStock, clearCart, products } = useData();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [splitPayments, setSplitPayments] = useState([]);
  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddSplitPayment = () => {
    setSplitPayments([...splitPayments, { method: 'cash', amount: '' }]);
  };

  const handleSplitPaymentChange = (index, field, value) => {
    const updated = [...splitPayments];
    updated[index][field] = value;
    setSplitPayments(updated);
  };

  const handleRemoveSplitPayment = (index) => {
    setSplitPayments(splitPayments.filter((_, i) => i !== index));
  };

  const calculateSplitTotal = () => {
    return splitPayments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
  };

  const calculateChange = () => {
    if (isSplitPayment) {
      return Math.max(0, calculateSplitTotal() - total);
    }
    const paid = parseFloat(amountPaid) || 0;
    return Math.max(0, paid - total);
  };

  const calculateBalance = () => {
    if (isSplitPayment) {
      return Math.max(0, total - calculateSplitTotal());
    }
    const paid = parseFloat(amountPaid) || 0;
    return Math.max(0, total - paid);
  };

  const handlePayment = async () => {
    if (calculateBalance() > 0) {
      alert('Payment amount is insufficient');
      return;
    }

    setLoading(true);
    try {
      // Generate invoice reference
      const ref = `INV-${Date.now().toString().slice(-6)}`;

      // Create sale record
      const saleData = {
        ref,
        total,
        method: isSplitPayment ? 'Split Payment' : paymentMethod,
        cashier: 'John Doe', // In real app, get from auth context
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        items: cart,
        change: calculateChange()
      };

      addSale(saleData);

      // Update stock in kg - deduct based on quantity × weight per unit
      cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          // Deduct in units (which translates to kg via the product's weight)
          adjustProductStock(item.id, -item.quantity, 'POS Sale');
        }
      });

      // Clear cart
      clearCart();

      // Call completion callback
      onPaymentComplete(saleData);

      // Close modal
      onClose();

      // Reset form
      setAmountPaid('');
      setSplitPayments([]);
      setIsSplitPayment(false);
      setPaymentMethod('cash');

    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
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
        maxWidth: 600,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
          <h2 style={{fontSize: 20, fontWeight: 700, margin: 0}}>
            Payment - KES {total.toLocaleString()}
          </h2>
          <button
            onClick={onClose}
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

        <div style={{marginBottom: 24}}>
          <div style={{display: 'flex', gap: 8, marginBottom: 16}}>
            <button
              onClick={() => setIsSplitPayment(false)}
              className={!isSplitPayment ? 'btn btn-primary' : 'btn btn-outline'}
              style={{flex: 1}}
            >
              Single Payment
            </button>
            <button
              onClick={() => setIsSplitPayment(true)}
              className={isSplitPayment ? 'btn btn-primary' : 'btn btn-outline'}
              style={{flex: 1}}
            >
              Split Payment
            </button>
          </div>

          {!isSplitPayment ? (
            <div>
              <div style={{marginBottom: 16}}>
                <label style={{display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8}}>
                  Payment Method
                </label>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8}}>
                  {PAYMENT_METHODS.map(method => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={paymentMethod === method.id ? 'btn btn-primary' : 'btn btn-outline'}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: 12
                        }}
                      >
                        <Icon size={16} />
                        {method.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{marginBottom: 16}}>
                <label style={{display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4}}>
                  Amount Paid (KES)
                </label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="Enter amount paid"
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              <div style={{marginBottom: 16}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                  <label style={{fontSize: 14, fontWeight: 600}}>
                    Split Payments
                  </label>
                  <button
                    onClick={handleAddSplitPayment}
                    className="btn btn-outline"
                    style={{fontSize: 12, padding: '4px 8px'}}
                  >
                    Add Payment
                  </button>
                </div>

                {splitPayments.map((payment, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    marginBottom: 8,
                    padding: 12,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8
                  }}>
                    <select
                      value={payment.method}
                      onChange={(e) => handleSplitPaymentChange(index, 'method', e.target.value)}
                      style={{
                        padding: 8,
                        border: '1px solid #e2e8f0',
                        borderRadius: 4,
                        fontSize: 12
                      }}
                    >
                      {PAYMENT_METHODS.map(method => (
                        <option key={method.id} value={method.id}>
                          {method.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={payment.amount}
                      onChange={(e) => handleSplitPaymentChange(index, 'amount', e.target.value)}
                      placeholder="Amount"
                      style={{
                        flex: 1,
                        padding: 8,
                        border: '1px solid #e2e8f0',
                        borderRadius: 4,
                        fontSize: 12
                      }}
                    />

                    <button
                      onClick={() => handleRemoveSplitPayment(index)}
                      className="btn btn-outline"
                      style={{padding: '4px 8px'}}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                {splitPayments.length === 0 && (
                  <p style={{fontSize: 14, color: '#6b7280', textAlign: 'center', padding: 20}}>
                    Click "Add Payment" to start split payment
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{
          padding: 16,
          background: '#f8fafc',
          borderRadius: 8,
          marginBottom: 24
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
            <span style={{fontSize: 14}}>Total Amount:</span>
            <span style={{fontSize: 14, fontWeight: 600}}>KES {total.toLocaleString()}</span>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
            <span style={{fontSize: 14}}>
              {isSplitPayment ? 'Total Paid:' : 'Amount Paid:'}
            </span>
            <span style={{fontSize: 14, fontWeight: 600}}>
              KES {(isSplitPayment ? calculateSplitTotal() : parseFloat(amountPaid) || 0).toLocaleString()}
            </span>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
            <span style={{fontSize: 14}}>Balance Due:</span>
            <span style={{
              fontSize: 14,
              fontWeight: 600,
              color: calculateBalance() > 0 ? '#dc2626' : '#059669'
            }}>
              KES {calculateBalance().toLocaleString()}
            </span>
          </div>

          {calculateChange() > 0 && (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{fontSize: 14}}>Change:</span>
              <span style={{fontSize: 14, fontWeight: 600, color: '#059669'}}>
                KES {calculateChange().toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div style={{display: 'flex', gap: 12}}>
          <button
            onClick={onClose}
            className="btn btn-outline"
            style={{flex: 1}}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            className="btn btn-primary"
            style={{flex: 1}}
            disabled={calculateBalance() > 0 || loading}
          >
            {loading ? 'Processing...' : 'Complete Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
