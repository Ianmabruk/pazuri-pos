import React from 'react';

export default function About() {
  return (
    <section className="section">
      <div className="container">
        <h1 style={{fontSize:40, fontWeight:800, color:'var(--primary)', margin:'0 0 16px'}}>About Us</h1>
        <p className="max-w-3xl muted" style={{fontSize:18}}>
          Pazuri Fish POS is a modern, intelligent point-of-sale platform for vendors and retailers.
          We help you run billing, inventory, staff, and reporting from any device. Fast, secure, and scalable.
        </p>
      </div>
    </section>
  );
}
