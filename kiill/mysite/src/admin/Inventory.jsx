import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export default function Inventory() {
  const { products, combos = [] } = useData();
  const [expandedCombo, setExpandedCombo] = useState(null);

  const findComboForProduct = (productId) => combos.find(c => c.productId === productId);

  const renderComboBreakdown = (combo) => {
    if (!combo) return null;
    const rows = combo.components.map((comp) => {
      const base = products.find(p => p.id === comp.productId) || { name: 'Unknown', cost: 0 };
      const componentCost = (base.cost || 0) * (comp.qty || 1);
      return (
        <tr key={comp.productId}>
          <td style={{paddingLeft:24}}>{base.name} x {comp.qty}</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>{componentCost}</td>
          <td>-</td>
        </tr>
      );
    });
    return (
      <>
        <tr>
          <td colSpan={6} style={{paddingTop:8}}>
            <div style={{fontWeight:700}}>Combo breakdown for {combo.name}</div>
          </td>
        </tr>
        {rows}
      </>
    );
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Inventory</h1>

      <div className="card padded">
        <table className="table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price (KES)</th>
              <th>Cost (KES)</th>
              <th>Profit Margin</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const isLowStock = p.stock < 25;

              // If product is a combo and we have a combo definition, compute component cost
              const combo = findComboForProduct(p.id);
              let computedCost = p.cost || 0;
              if (combo) {
                computedCost = combo.components.reduce((sum, comp) => {
                  const base = products.find(x => x.id === comp.productId) || { cost: 0 };
                  return sum + ((base.cost || 0) * (comp.qty || 1));
                }, 0);
              }

              const profitMargin = p.price ? (((p.price - computedCost) / p.price) * 100).toFixed(1) : '0.0';

              return (
                <React.Fragment key={p.id}>
                  <tr style={{ backgroundColor: isLowStock ? '#fff3cd' : 'transparent' }}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      {combo && (
                        <button
                          onClick={() => setExpandedCombo(expandedCombo === p.id ? null : p.id)}
                          className="btn small"
                        >
                          {expandedCombo === p.id ? 'Hide breakdown' : 'View breakdown'}
                        </button>
                      )}
                    </td>
                    <td>{p.category}</td>
                    <td style={{ color: isLowStock ? '#dc3545' : 'inherit', fontWeight: isLowStock ? 'bold' : 'normal' }}>{p.stock}</td>
                    <td>{p.price}</td>
                    <td>{computedCost}</td>
                    <td>{profitMargin}%</td>
                  </tr>
                  {expandedCombo === p.id && combo && renderComboBreakdown(combo)}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <p className="muted" style={{ fontSize: 14 }}>
          <span style={{ color: '#dc3545' }}>Red highlighted rows</span> indicate low stock (less than 25 units)
        </p>
      </div>
    </div>
  );
}
