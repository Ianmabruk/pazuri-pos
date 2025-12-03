import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Download, Calendar, User, CreditCard } from 'lucide-react';
import ExportPDF from '../components/ExportPDF';

export default function Sales() {
  const { sales } = useData();
  const [filter, setFilter] = useState('all');

  const filteredSales = sales.filter(sale => {
    if (filter === 'all') return true;
    return sale.method.toLowerCase() === filter;
  });

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = filteredSales.length;

  const getMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'm-pesa':
        return <span style={{color: '#059669'}}>📱</span>;
      case 'cash':
        return <span style={{color: '#d97706'}}>💵</span>;
      case 'card':
        return <CreditCard size={16} style={{color: '#3b82f6'}} />;
      default:
        return <CreditCard size={16} />;
    }
  };

  const exportData = () => {
    return filteredSales.map(sale => ({
      'Reference': sale.ref,
      'Cashier': sale.cashier,
      'Method': sale.method,
      'Total (KES)': sale.total,
      'Date': sale.date
    }));
  };

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16}}>
        <h1 style={{fontSize:24, fontWeight:800}}>Sales</h1>
        <ExportPDF data={exportData()} filename="sales-report" />
      </div>

      <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24}}>
        <div className="card padded">
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <CreditCard size={24} />
            </div>
            <div>
              <p className="muted" style={{fontSize: 12, margin: 0}}>Total Sales</p>
              <p style={{fontSize: 24, fontWeight: 700, margin: 0}}>KES {totalSales.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card padded">
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Calendar size={24} />
            </div>
            <div>
              <p className="muted" style={{fontSize: 12, margin: 0}}>Transactions</p>
              <p style={{fontSize: 24, fontWeight: 700, margin: 0}}>{totalTransactions}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', gap: 8, marginBottom: 16}}>
        <button 
          className={filter === 'all' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'm-pesa' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={() => setFilter('m-pesa')}
        >
          M-Pesa
        </button>
        <button 
          className={filter === 'cash' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={() => setFilter('cash')}
        >
          Cash
        </button>
        <button 
          className={filter === 'card' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={() => setFilter('card')}
        >
          Card
        </button>
      </div>

      <div className="card padded">
        <table className="table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Cashier</th>
              <th>Method</th>
              <th>Total (KES)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map(sale => (
              <tr key={sale.id}>
                <td style={{fontWeight: 600}}>{sale.ref}</td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <User size={16} className="muted" />
                    {sale.cashier}
                  </div>
                </td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    {getMethodIcon(sale.method)}
                    {sale.method}
                  </div>
                </td>
                <td style={{fontWeight: 600}}>KES {sale.total.toLocaleString()}</td>
                <td className="muted">{sale.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSales.length === 0 && (
          <div style={{textAlign: 'center', padding: 40}}>
            <p className="muted">No sales found for the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
