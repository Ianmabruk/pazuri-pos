import { X, Printer, Download } from 'lucide-react';

export default function ReceiptPrint({ isOpen, onClose, saleData }) {
  if (!isOpen || !saleData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate a PDF
    alert('PDF download feature would be implemented here');
  };

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
        maxWidth: 500,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Receipt</h2>
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

        <div id="receipt-content" style={{
          border: '2px solid #e2e8f0',
          borderRadius: 8,
          padding: 24,
          marginBottom: 24
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24, borderBottom: '2px dashed #cbd5e1', paddingBottom: 16 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, marginBottom: 4, color: 'var(--primary)' }}>
              Pazuri POS
            </h1>
            <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
              Fish & Seafood Restaurant
            </p>
          </div>

          <div style={{ marginBottom: 16, fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#6b7280' }}>Invoice:</span>
              <span style={{ fontWeight: 600 }}>{saleData.ref}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#6b7280' }}>Date:</span>
              <span style={{ fontWeight: 600 }}>{saleData.date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#6b7280' }}>Time:</span>
              <span style={{ fontWeight: 600 }}>{saleData.time}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Cashier:</span>
              <span style={{ fontWeight: 600 }}>{saleData.cashier}</span>
            </div>
          </div>

          <div style={{ borderTop: '2px dashed #cbd5e1', borderBottom: '2px dashed #cbd5e1', padding: '12px 0', marginBottom: 16 }}>
            <table style={{ width: '100%', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '4px 0', color: '#6b7280' }}>Item</th>
                  <th style={{ textAlign: 'center', padding: '4px 0', color: '#6b7280' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '4px 0', color: '#6b7280' }}>Price</th>
                  <th style={{ textAlign: 'right', padding: '4px 0', color: '#6b7280' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {saleData.items?.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: '8px 0' }}>{item.name}</td>
                    <td style={{ textAlign: 'center', padding: '8px 0' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', padding: '8px 0' }}>{item.price}</td>
                    <td style={{ textAlign: 'right', padding: '8px 0', fontWeight: 600 }}>
                      {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: 14, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600 }}>KES {saleData.total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: 700 }}>Total:</span>
              <span style={{ fontWeight: 800, fontSize: 16 }}>KES {saleData.total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#6b7280' }}>Payment Method:</span>
              <span style={{ fontWeight: 600 }}>{saleData.method}</span>
            </div>
            {saleData.change > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Change:</span>
                <span style={{ fontWeight: 600, color: '#059669' }}>KES {saleData.change.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', fontSize: 12, color: '#6b7280', borderTop: '2px dashed #cbd5e1', paddingTop: 16 }}>
            <p style={{ margin: 0, marginBottom: 4 }}>Thank you for your business!</p>
            <p style={{ margin: 0 }}>Visit us again soon</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handlePrint}
            className="btn btn-outline"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Printer size={16} />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="btn btn-primary"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}