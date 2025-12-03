import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Package, CreditCard, Zap, Shield, TrendingUp, Clock } from 'lucide-react';

function Hero() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/cashier');
    } else {
      navigate('/register');
    }
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-left">
            <span className="badge" style={{background: '#dcfce7', color: '#166534'}}>Trusted by local fish vendors</span>
            <h1 className="hero-title">Sell more, waste less — POS built for fish vendors</h1>
            <p className="hero-sub">Fast checkout, inventory by weight (kg), shift management, and credit approvals — all in one simple dashboard.</p>

            <div className="hero-actions" style={{marginTop:20}}>
              <button onClick={handleGetStarted} className="btn btn-primary">Get Started</button>
              <button onClick={() => navigate('/login')} className="btn btn-outline">Login</button>
            </div>

            <div className="hero-stats" style={{display:'flex', gap:12, marginTop:28}}>
              <div className="card padded" style={{padding:'12px 16px', minWidth:120}}>
                <div style={{fontSize:14, color:'#64748b'}}>Today sales</div>
                <div style={{fontWeight:800, fontSize:18}}>KES 42,500</div>
              </div>
              <div className="card padded" style={{padding:'12px 16px', minWidth:120}}>
                <div style={{fontSize:14, color:'#64748b'}}>Products</div>
                <div style={{fontWeight:800, fontSize:18}}>32</div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="mockup card padded" style={{textAlign:'center'}}>
              <img src="/logo.png" alt="Pazuri Fish Logo" style={{width:160, marginBottom:12}} />
              <img src="https://via.placeholder.com/720x420?text=Dashboard+Preview" alt="Dashboard preview" style={{width:'100%', borderRadius:12}} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { title: 'Fast Checkout', desc: 'Barcode scanning, split payments, receipts', icon: CreditCard },
    { title: 'Inventory by kg', desc: 'Track stock weights, combos, and margins', icon: Package },
    { title: 'Shift Management', desc: 'Start/end shifts, floats recorded', icon: Clock },
    { title: 'Credit Requests', desc: 'Cashiers request credit, admins approve', icon: CreditCard },
    { title: 'Analytics', desc: 'Sales by cashier and payment method', icon: BarChart3 },
    { title: 'Staff & Permissions', desc: 'Manage users and roles', icon: Users }
  ];

  return (
    <section id="features" className="section">
      <div className="container text-center">
        <h2 className="section-title">Features that matter</h2>
        <p className="section-sub">Everything a fish vendor needs to run daily operations smoothly.</p>
        <div className="grid-3 mt-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="card padded">
                <Icon size={28} style={{color: 'var(--primary)'}} />
                <h3 style={{fontSize:18, fontWeight:700, marginTop:12}}>{f.title}</h3>
                <p className="muted mt-2">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section" style={{background:'#f8fafc'}}>
      <div className="container text-center">
        <h2 className="section-title">What our vendors say</h2>
        <div className="grid-3 mt-8">
          <div className="card padded">"Pazuri helped reduce our waste and speed up checkout." — Amina</div>
          <div className="card padded">"Shift tracking and reports are exactly what we needed." — Peter</div>
          <div className="card padded">"Inventory by kg makes our pricing accurate." — Mary</div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
    </>
  );
}
