import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Users, FileText, Settings, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const link = ({ isActive }) => `sidelink${isActive ? ' active' : ''}`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { to: '/admin', label: 'Dashboard', icon: BarChart3, end: true },
    { to: '/admin/inventory', label: 'Inventory', icon: Package },
    { to: '/admin/sales', label: 'Sales', icon: ShoppingCart },
    { to: '/admin/staff', label: 'Staff', icon: Users },
    { to: '/admin/expenses', label: 'Expenses', icon: DollarSign },
    { to: '/admin/activity', label: 'Activity Logs', icon: FileText },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="layout-grid">
      <aside className="sidebar">
        <div style={{ padding: '24px 16px', borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Admin</h2>
          <p style={{ fontSize: 12, color: '#6b7280', margin: '8px 0 0 0' }}>{user?.name || 'Administrator'}</p>
        </div>
        <nav className="side-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={link}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div style={{ padding: '16px', marginTop: 'auto', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
