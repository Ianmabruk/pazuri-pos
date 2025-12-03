import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import ProductGrid from './ProductGrid';
import Cart from './Cart';
import PaymentModal from './PaymentModal';
import ReceiptPrint from './ReceiptPrint';
import CreditRequestModal from './CreditRequestModal';
import NotificationBell from './components/NotificationBell';
import ShiftManagement from './components/ShiftManagement';
import ExpenseTracker from './components/ExpenseTracker';
import { CreditCard, User, BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';

export default function CashierPOS() {
  const { cart, addToCart, clearCart, products, sales, combos, addNotification, timeTracking } = useData();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [showStats, setShowStats] = useState(false);

  // Check for low stock and send notifications
  useEffect(() => {
    const lowStockProducts = products.filter(p => p.stock <= 5 && p.stock > 0);
    lowStockProducts.forEach(product => {
      addNotification({
        type: 'warning',
        message: `Low stock alert: ${product.name} (${product.stock} remaining)`
      });
    });
  }, [products]);

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      addNotification({
        type: 'warning',
        message: `${product.name} is out of stock`
      });
      return;
    }
    addToCart(product);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = (saleData) => {
    setCurrentSale(saleData);
    setShowPaymentModal(false);
    setShowReceiptModal(true);
    addNotification({
      type: 'success',
      message: `Sale completed - ${saleData.ref} (KES ${saleData.total.toLocaleString()})`
    });
  };

  const handleCreditRequest = () => {
    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    setShowCreditModal(true);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(s => s.date === today);
    const totalSales = todaySales.reduce((sum, s) => sum + s.total, 0);
    const cashSales = todaySales.filter(s => s.method === 'Cash').reduce((sum, s) => sum + s.total, 0);
    const mpesaSales = todaySales.filter(s => s.method === 'M-Pesa').reduce((sum, s) => sum + s.total, 0);
    
    return {
      totalSales,
      transactionCount: todaySales.length,
      cashSales,
      mpesaSales,
      averageTransaction: todaySales.length > 0 ? totalSales / todaySales.length : 0
    };
  };

  const stats = getTodayStats();

  const getComboProfit = (product) => {
    const combo = combos.find(c => c.productId === product.id);
    if (!combo) return null;

    const componentCost = combo.components.reduce((sum, comp) => {
      const componentProduct = products.find(p => p.id === comp.productId);
      return sum + (componentProduct ? componentProduct.cost * comp.qty : 0);
    }, 0);

    return {
      cost: componentCost,
      profit: product.price - componentCost,
      margin: ((product.price - componentCost) / product.price * 100).toFixed(1)
    };
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Point of Sale</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <ShiftManagement />
          <button
            onClick={() => setShowStats(!showStats)}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <BarChart3 size={16} />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
          <NotificationBell />
          <input
            type="text"
            placeholder="Customer name (for credit)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              fontSize: 14,
              width: 200
            }}
          />
          <button
            onClick={handleCreditRequest}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <CreditCard size={16} />
            Credit Request
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      {showStats && (
        <div style={{ marginBottom: 24 }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div className="card padded" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <TrendingUp size={24} />
                <p style={{ fontSize: 12, margin: 0, opacity: 0.9 }}>Total Sales Today</p>
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
                KES {stats.totalSales.toLocaleString()}
              </p>
            </div>

            <div className="card padded" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <BarChart3 size={24} />
                <p style={{ fontSize: 12, margin: 0, opacity: 0.9 }}>Transactions</p>
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
                {stats.transactionCount}
              </p>
            </div>

            <div className="card padded" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <DollarSign size={24} />
                <p style={{ fontSize: 12, margin: 0, opacity: 0.9 }}>Cash Collected</p>
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
                KES {stats.cashSales.toLocaleString()}
              </p>
            </div>

            <div className="card padded" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Package size={24} />
                <p style={{ fontSize: 12, margin: 0, opacity: 0.9 }}>M-PESA Collected</p>
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
                KES {stats.mpesaSales.toLocaleString()}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <ExpenseTracker />
          </div>
        </div>
      )}

      {/* Main POS Interface */}
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <ProductGrid onAddToCart={handleAddToCart} />
        <Cart
          cart={cart}
          onCheckout={handleCheckout}
          total={calculateTotal()}
        />
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={calculateTotal()}
        cart={cart}
        onPaymentComplete={handlePaymentComplete}
      />

      <ReceiptPrint
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        saleData={currentSale}
      />

      <CreditRequestModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        customerName={customerName}
      />
    </div>
  );
}
