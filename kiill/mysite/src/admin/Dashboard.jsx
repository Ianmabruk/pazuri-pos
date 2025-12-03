import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Charts from '../components/Charts';
import { TrendingUp, Package, AlertTriangle, DollarSign, PlusCircle, MinusCircle, Copy, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const { sales, products, activityLogs, creditRequests, adjustProductStock, generateVerificationCode, verificationCodes, revokeVerificationCode } = useData();

  // Calculate today's metrics
  const todaySales = sales.filter(s => s.date === '2023-10-01').reduce((sum, s) => sum + s.total, 0);
  const todayOrders = sales.filter(s => s.date === '2023-10-01').length;
  const lowStock = products.filter(p => p.stock < 25).length;
  const pendingCredits = creditRequests.filter(r => r.status === 'pending').length;

  // Sales by payment method
  const salesByMethod = sales.reduce((acc, s) => {
    acc[s.method] = (acc[s.method] || 0) + s.total;
    return acc;
  }, {});
  const paymentMethodData = Object.entries(salesByMethod).map(([name, value]) => ({ name, value }));

  // Sales by cashier
  const salesByCashier = sales.reduce((acc, s) => {
    acc[s.cashier] = (acc[s.cashier] || 0) + s.total;
    return acc;
  }, {});
  const cashierSalesData = Object.entries(salesByCashier).map(([name, value]) => ({ name, value }));

  // Cashier activity summary
  const cashierActivity = sales.reduce((acc, s) => {
    if (!acc[s.cashier]) {
      acc[s.cashier] = { name: s.cashier, orders: 0, total: 0, methods: {} };
    }
    acc[s.cashier].orders += 1;
    acc[s.cashier].total += s.total;
    acc[s.cashier].methods[s.method] = (acc[s.cashier].methods[s.method] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 style={{fontSize:24, fontWeight:800, marginBottom:16}}>Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid-3">
        <div className="card padded" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{fontSize:14, opacity: 0.9}}>Today Sales</p>
              <p style={{fontSize:28, fontWeight:800, marginTop:4}}>KES {todaySales.toLocaleString()}</p>
            </div>
            <DollarSign size={40} style={{opacity: 0.3}} />
          </div>
        </div>
        <div className="card padded" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{fontSize:14, opacity: 0.9}}>Orders</p>
              <p style={{fontSize:28, fontWeight:800, marginTop:4}}>{todayOrders}</p>
            </div>
            <TrendingUp size={40} style={{opacity: 0.3}} />
          </div>
        </div>
        <div className="card padded" style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fff'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{fontSize:14, opacity: 0.9}}>Low Stock Items</p>
              <p style={{fontSize:28, fontWeight:800, marginTop:4}}>{lowStock}</p>
            </div>
            <AlertTriangle size={40} style={{opacity: 0.3}} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2 mt-6">
        <Charts data={paymentMethodData} title="Sales by Payment Method" type="pie" />
        <Charts data={cashierSalesData} title="Sales by Cashier" type="bar" />
      </div>

      {/* Cashier Activity Monitoring */}
      <div className="mt-6">
        <h2 style={{fontSize:20, fontWeight:700, marginBottom:16}}>Cashier Activity Monitoring</h2>
        <div className="card padded">
          <table className="table">
            <thead>
              <tr>
                <th>Cashier</th>
                <th>Orders</th>
                <th>Total Sales</th>
                <th>Payment Methods</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(cashierActivity).map((cashier, idx) => (
                <tr key={idx}>
                  <td style={{fontWeight: 600}}>{cashier.name}</td>
                  <td>{cashier.orders}</td>
                  <td>KES {cashier.total.toLocaleString()}</td>
                  <td>
                    {Object.entries(cashier.methods).map(([method, count]) => (
                      <span key={method} className="badge" style={{marginRight: 6}}>
                        {method}: {count}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity and Pending Credits */}
      <div className="grid-2 mt-6">
        <div className="card padded">
          <h3 style={{fontWeight:700, marginBottom: 12}}>Recent Activity</h3>
          <div style={{maxHeight: 300, overflowY: 'auto'}}>
            {activityLogs.slice().reverse().slice(0, 10).map(log => (
              <div key={log.id} style={{padding: '8px 0', borderBottom: '1px solid var(--border)'}}>
                <p style={{fontSize: 14, fontWeight: 600}}>{log.action}</p>
                <p className="muted" style={{fontSize: 12}}>
                  {log.cashier || log.user} • {log.timestamp}
                  {log.amount && ` • KES ${log.amount.toLocaleString()}`}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card padded">
          <h3 style={{fontWeight:700, marginBottom: 12}}>
            Pending Credit Approvals 
            {pendingCredits > 0 && (
              <span style={{
                marginLeft: 8,
                background: '#dc2626',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 700
              }}>
                {pendingCredits}
              </span>
            )}
          </h3>
          <div style={{maxHeight: 300, overflowY: 'auto'}}>
            {creditRequests.filter(r => r.status === 'pending').map(req => (
              <div key={req.id} style={{padding: '8px 0', borderBottom: '1px solid var(--border)'}}>
                <p style={{fontSize: 14, fontWeight: 600}}>KES {req.amount.toLocaleString()}</p>
                <p className="muted" style={{fontSize: 12}}>
                  {req.customer} • {req.cashier} • {req.date} {req.time}
                </p>
              </div>
            ))}
            {pendingCredits === 0 && (
              <p className="muted" style={{fontSize: 14, textAlign: 'center', padding: 20}}>
                No pending credit requests
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Admin Stock Manager and Verification Codes */}
      <div className="grid-2 mt-6">
        <div className="card padded">
          <h3 style={{fontWeight:700, marginBottom: 12}}>Stock Manager (Kilograms)</h3>
          <p className="muted" style={{fontSize:13}}>Adjust product stock in kilograms.</p>
          <table className="table" style={{marginTop:12}}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Per Unit (kg)</th>
                <th>Total Stock (kg)</th>
                <th style={{width:160}}>Adjust</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const totalKg = (p.stock * (p.weight || 1)).toFixed(2);
                return (
                  <tr key={p.id}>
                    <td style={{fontWeight:600}}>{p.name}</td>
                    <td>{(p.weight || 1).toFixed(2)} kg</td>
                    <td>{totalKg} kg</td>
                    <td>
                      <div style={{display:'flex', gap:8}}>
                        <button
                          className="btn btn-outline"
                          onClick={() => {
                            const unitQty = Math.ceil((p.weight || 1));
                            adjustProductStock(p.id, unitQty);
                          }}
                          title={`Add 1 unit (${(p.weight || 1).toFixed(2)} kg)`}
                        ><PlusCircle size={16} /></button>
                        <button
                          className="btn btn-outline"
                          onClick={() => {
                            const unitQty = Math.ceil((p.weight || 1));
                            adjustProductStock(p.id, -unitQty);
                          }}
                          title={`Remove 1 unit (${(p.weight || 1).toFixed(2)} kg)`}
                        ><MinusCircle size={16} /></button>
                        <button
                          className="btn"
                          onClick={() => {
                            const kg = parseFloat(prompt('Enter kilograms to add (use negative to remove):', '5'));
                            if (!Number.isNaN(kg)) {
                              const units = Math.round(kg / (p.weight || 1));
                              adjustProductStock(p.id, units);
                            }
                          }}
                          title="Adjust by kg"
                        >Adjust (kg)</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card padded">
          <h3 style={{fontWeight:700, marginBottom: 12}}>Verification Codes</h3>
          <p className="muted" style={{fontSize:13}}>Generate time-limited codes cashiers can use to access/verify actions.</p>
          <div style={{display:'flex', gap:8, marginTop:12, marginBottom:12}}>
            <input id="vcashier" placeholder="Cashier name (optional)" style={{flex:1, padding:8, borderRadius:6, border:'1px solid #e5e7eb'}} />
            <button
              className="btn btn-primary"
              onClick={() => {
                const nameInput = document.getElementById('vcashier');
                const cashier = (nameInput && nameInput.value) ? nameInput.value : 'Any';
                const rec = generateVerificationCode(cashier);
                // simple visual feedback: copy to clipboard
                try { navigator.clipboard.writeText(rec.code); } catch (e) {}
                alert(`Code ${rec.code} generated and copied to clipboard.`);
                if (nameInput) nameInput.value = '';
              }}
            >Generate</button>
          </div>

          <div style={{maxHeight: 260, overflowY: 'auto'}}>
            {verificationCodes.length === 0 && (
              <p className="muted" style={{textAlign:'center'}}>No active codes</p>
            )}
            {verificationCodes.map(vc => (
              <div key={vc.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)'}}>
                <div>
                  <div style={{fontWeight:700}}>{vc.code} {vc.cashier && <span style={{fontWeight:500, color:'#6b7280', marginLeft:8}}>{vc.cashier}</span>}</div>
                  <div className="muted" style={{fontSize:12}}>
                    Expires: {new Date(vc.expiresAt).toLocaleString()} {vc.used && '• used'}
                  </div>
                </div>
                <div style={{display:'flex', gap:8}}>
                  <button className="btn btn-outline" onClick={() => { try { navigator.clipboard.writeText(vc.code); alert('Copied'); } catch(e){}}}><Copy size={14} /></button>
                  <button className="btn btn-danger" onClick={() => { if (confirm('Revoke this code?')) revokeVerificationCode(vc.id); }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}