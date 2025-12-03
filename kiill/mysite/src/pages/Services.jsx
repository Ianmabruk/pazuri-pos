import React from 'react';

export default function Services() {
  const services = [
    { title: 'Point of Sale', desc: 'High-performance POS with receipts and taxes.' },
    { title: 'Inventory', desc: 'Stock updates, low stock alerts, and purchases.' },
    { title: 'Analytics', desc: 'Sales, profit, products, and staff performance.' },
    { title: 'Staff', desc: 'Roles, permissions, and logs.' },
  ];
  return (
    <section className="section">
      <div className="container">
        <h1 style={{fontSize:40, fontWeight:800, color:'var(--primary)', margin:'0 0 24px'}}>Our Services</h1>
        <div className="grid-2">
          {services.map((s, i) => (
            <div key={i} className="card padded">
              <h3 style={{fontSize:20, fontWeight:700}}>{s.title}</h3>
              <p className="muted mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
