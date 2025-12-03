import { useData } from '../context/DataContext';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

export default function Cart({ cart, onCheckout, total }) {
  const { updateCartQuantity, removeFromCart } = useData();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="card padded" style={{ position: 'sticky', top: 24, maxHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <ShoppingCart size={20} style={{ color: 'var(--primary)' }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
          Cart ({cart.length})
        </h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
            <ShoppingCart size={48} style={{ marginBottom: 16, color: '#d1d5db' }} />
            <p>Cart is empty</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cart.map(item => (
              <div
                key={item.id}
                style={{
                  padding: 12,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  background: '#f8fafc'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0, marginBottom: 4 }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
                      KES {item.price} × {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                      color: '#dc2626'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      style={{
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #cbd5e1',
                        borderRadius: 6,
                        background: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: 14, fontWeight: 600, minWidth: 30, textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      style={{
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #cbd5e1',
                        borderRadius: 6,
                        background: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#059669' }}>
                    KES {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Total:</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>
            KES {total.toLocaleString()}
          </span>
        </div>
        <button
          onClick={onCheckout}
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={cart.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}