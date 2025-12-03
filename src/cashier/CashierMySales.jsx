import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Clock, Package, Download, Calendar } from 'lucide-react';

const COLORS = ['#4f46e5', '#06b6d4', '#f97316', '#ef4444', '#10b981', '#a78bfa'];

export default function CashierMySales() {
  const { sales, products, timeTracking, expenses } = useData();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('today'); // 'today', 'week', 'month'

  // Filter sales by cashier and date
  const mySales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const selected = new Date(selectedDate);
      
      if (viewMode === 'today') {
        return sale.date === selectedDate && sale.cashier === user?.name;
      } else if (viewMode === 'week') {
        const weekAgo = new Date(selected);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return saleDate >= weekAgo && saleDate <= selected && sale.cashier === user?.name;
      } else {
        const monthAgo = new Date(selected);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return saleDate >= monthAgo && saleDate <= selected && sale.cashier === user?.name;
      }
    });
  }, [sales, selectedDate, viewMode, user]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSales = mySales.reduce((sum, s) => sum + s.total, 0);
    const cashSales = mySales.filter(s => s.method === 'Cash').reduce((sum, s) => sum + s.total, 0);
    const mpesaSales = mySales.filter(s => s.method === 'M-Pesa').reduce((sum, s) => sum + s.total, 0);
    const cardSales = mySales.filter(s => s.method === 'Card').reduce((sum, s) => sum + s.total, 0);
    
    return {
      totalSales,
      transactionCount: mySales.length,
      averageTransaction: mySales.length > 0 ? totalSales / mySales.length : 0,
      cashSales,
      mpesaSales,
      cardSales
    };
  }, [mySales]);

  // Payment method distribution
  const paymentMethodData = [
    { name: 'Cash', value: stats.cashSales },
    { name: 'M-PESA', value: stats.mpesaSales },
    { name: 'Card', value: stats.cardSales }
  ].filter(item => item.value > 0);

  // Sales by hour
  const salesByHour = useMemo(() => {
    const hourly = {};
    mySales.forEach(sale => {
      const hour = parseInt(sale.time.split(':')[0]);
      if (!hourly[hour]) {
        hourly[hour] = 0;
      }
      hourly[hour] += sale.total;
    });

    return Object.keys(hourly).map(hour => ({
      name: `${hour}:00`,
      value: hourly[hour]
    })).sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }, [mySales]);

  // Top selling products
  const topProducts = useMemo(() => {
    const productSales = {};
    mySales.forEach(sale => {
      sale.items?.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = 0;
        }
        productSales[item.name] += item.quantity;
      });
    });

    return Object.entries(productSales)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [mySales]);

  // Shift history
  const myShifts = timeTracking.shifts.filter(shift => shift.cashier === user?.name);

  // Today's expenses
  const todayExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.timestamp).toDateString();
    const today = new Date().toDateString();
    return expenseDate === today && e.cashier === user?.name;
  });
  const totalExpenses = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>My Sales Dashboard</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setViewMode('today')}
              className={viewMode === 'today' ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: 12, padding: '6px 12px' }}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={viewMode === 'week' ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: 12, padding: '6px 12px' }}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={viewMode === 'month' ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: 12, padding: '6px 12px' }}
            >
              Month
            </button>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              fontSize: 14
            }}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card padded" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <DollarSign size={24} />
            <p style={{ fontSize: 12, margin: 0, opacity: 0.9 }}>Total Sales</p>
          </div>
          <p style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>
            KES {stats.totalSales.toLocaleString()}
          </p>
          <p style={{ fontSize: 12, margin: 0, marginTop: 4, opacity: 0.8 }}>
            Avg: KES {stats.averageTransaction.toLocaleString()}
          </p>
        </div>

        <div className="card padded" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <TrendingUp size={24} />
            <p style={{ fontSize: 12, margin: 0, opacity: 0.9 }}>Transactions</p>
          </div>
          <p style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>
            {stats.transactionCount}
          </p>
          <p style={{ fontSize: 12, margin: 0, marginTop: 4, opacity: 0.8 }}>
            {viewMode === 'today' ? 'Today' : viewMode === 'week' ? 'This Week' : 'This Month'}
          </p>
        </div>

        <div className="card padded" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Clock size={24} />
            <p style={{ fontSize: 12, margin: 0, opacity: 0.9 }}>Hours Worked</p>
          </div>
          <p style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>
            {myShifts.length > 0 ? `${myShifts.length}` : '0'}
          </p>
          <p style={{ fontSize: 12, margin: 0, marginTop: 4, opacity: 0.8 }}>
            Shifts Completed
          </p>
        </div>

        <div className="card padded" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Package size={24} />
            <p style={{ fontSize: 12, margin: 0, opacity: 0.9 }}>Expenses</p>
          </div>
          <p style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>
            KES {totalExpenses.toLocaleString()}
          </p>
          <p style={{ fontSize: 12, margin: 0, marginTop: 4, opacity: 0.8 }}>
            Net: KES {(stats.totalSales - totalExpenses).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 24 }}>
        {/* Sales by Hour */}
        {salesByHour.length > 0 && (
          <div className="card padded">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Sales by Hour</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesByHour}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Payment Methods */}
        {paymentMethodData.length > 0 && (
          <div className="card padded">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Payment Methods</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.name}: KES ${entry.value.toLocaleString()}`}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="card padded" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Top Selling Products</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  background: '#f8fafc',
                  borderRadius: 8
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: COLORS[index % COLORS.length],
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{product.name}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#059669' }}>
                    {product.quantity} sold
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Table */}
      <div className="card padded">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
            Sales History ({mySales.length})
          </h3>
          <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Download size={14} />
            Export
          </button>
        </div>

        {mySales.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>
            No sales found for the selected period
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280', fontWeight: 600 }}>Reference</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280', fontWeight: 600 }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280', fontWeight: 600 }}>Time</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b7280', fontWeight: 600 }}>Method</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', color: '#6b7280', fontWeight: 600 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {mySales.map(sale => (
                  <tr key={sale.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>{sale.ref}</td>
                    <td style={{ padding: '12px 8px' }}>{sale.date}</td>
                    <td style={{ padding: '12px 8px' }}>{sale.time}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                        background: sale.method === 'Cash' ? '#dbeafe' : sale.method === 'M-Pesa' ? '#d1fae5' : '#fef3c7',
                        color: sale.method === 'Cash' ? '#1e40af' : sale.method === 'M-Pesa' ? '#065f46' : '#92400e'
                      }}>
                        {sale.method}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>
                      KES {sale.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}