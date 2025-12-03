import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, BarChart3, ShoppingCart, Menu, X } from 'lucide-react';

export default function SiteNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const linkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleDashboardNav = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'cashier') {
      navigate('/cashier');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar" style={{boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
      <nav className="container navbar-inner">
        <Link to="/" className="brand" style={{display:'flex', alignItems:'center', gap:8, fontWeight:800}}>
          <img src="/logo.png" alt="Pazuri Fish" style={{width:40, height:40, objectFit:'contain', borderRadius:8}} />
          <span style={{display:'inline-block', verticalAlign:'middle'}}>Pazuri</span>
        </Link>

        {/* Mobile menu toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{display:'none', background:'none', border:'none', cursor:'pointer', marginLeft:'auto'}}
          className="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink to="/" className={linkClass} end onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setMobileMenuOpen(false)}>About</NavLink>
          <NavLink to="/services" className={linkClass} onClick={() => setMobileMenuOpen(false)}>Services</NavLink>
          <NavLink to="/contact" className={linkClass} onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
        </div>

        <div className="nav-ctas" style={{display:'flex', gap:12, alignItems:'center'}}>
          {user ? (
            <>
              <div style={{display:'flex', alignItems:'center', gap:12, paddingRight:12, borderRight:'1px solid #e2e8f0'}}>
                <span style={{fontSize:12, color: '#6b7280', fontWeight:600}}>
                  {user.role === 'admin' ? '👑 Admin' : '💼 Cashier'}
                </span>
                <span style={{fontSize:14, fontWeight:600, color: '#1f2937'}}>{user.name}</span>
              </div>
              <button 
                onClick={handleDashboardNav}
                className="btn btn-primary"
                style={{display:'flex', alignItems:'center', gap:6, whiteSpace:'nowrap'}}
              >
                {user.role === 'admin' ? <BarChart3 size={16} /> : <ShoppingCart size={16} />}
                {user.role === 'admin' ? 'Dashboard' : 'POS'}
              </button>
              <button 
                onClick={handleLogout}
                className="btn btn-outline"
                style={{display:'flex', alignItems:'center', gap:6}}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
