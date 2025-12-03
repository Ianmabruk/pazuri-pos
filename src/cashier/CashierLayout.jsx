import { Outlet, NavLink } from 'react-router-dom';
import { ShoppingCart, BarChart3, Settings, LogOut, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './components/NotificationBell';

export default function CashierLayout() {
  const { user, logout } = useAuth();
  const { cashierProfile } = useData();
  const navigate = useNavigate();
  
  const link = ({ isActive }) => `sidelink${isActive ? ' active' : ''}`;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout-grid">
      <aside className="sidebar">
        <div style={{ padding: '24px 16px', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              {cashierProfile?.profilePicture ? (
                <img
                  src={cashierProfile.profilePicture}
                  alt="Profile"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #3b82f6'
                  }}
                />
              ) : (
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: '#64748b'
                }}>
                  {cashierProfile?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Portal</h2>
            </div>
            <NotificationBell />
          </div>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0, marginLeft: 52 }}>{cashierProfile?.name || 'Cashier'}</p>
        </div>
        <nav className="side-nav">
          <NavLink to="/cashier" end className={link}>
            <ShoppingCart size={18} />
            Point of Sale
          </NavLink>
          <NavLink to="/cashier/my-sales" className={link}>
            <BarChart3 size={18} />
            My Sales
          </NavLink>
          <NavLink to="/cashier/settings" className={link}>
            <Settings size={18} />
            Settings
          </NavLink>
        </nav>
        <div style={{ padding: 16, marginTop: 'auto', borderTop: '1px solid #e2e8f0' }}>
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
