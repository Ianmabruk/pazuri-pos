import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function NotificationBell() {
  const { notifications, markNotificationRead, clearNotifications } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} style={{ color: '#059669' }} />;
      case 'warning':
        return <AlertTriangle size={20} style={{ color: '#d97706' }} />;
      default:
        return <Info size={20} style={{ color: '#2563eb' }} />;
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 8,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Bell size={20} style={{ color: '#475569' }} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            background: '#dc2626',
            color: '#fff',
            borderRadius: '50%',
            width: 18,
            height: 18,
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: 8,
          width: 360,
          maxHeight: 480,
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          boxShadow: '0 10px 25px -10px rgba(2, 6, 23, 0.25)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
              Notifications ({unreadCount})
            </h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 12,
                    color: '#6b7280',
                    textDecoration: 'underline'
                  }}
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
                <Bell size={48} style={{ marginBottom: 16, color: '#d1d5db' }} />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    padding: 16,
                    borderBottom: '1px solid #f1f5f9',
                    background: notification.read ? '#fff' : '#eff6ff',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = notification.read ? '#fff' : '#eff6ff'}
                >
                  <div style={{ display: 'flex', gap: 12 }}>
                    {getNotificationIcon(notification.type)}
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: 14,
                        fontWeight: notification.read ? 400 : 600,
                        margin: 0,
                        marginBottom: 4
                      }}>
                        {notification.message}
                      </p>
                      <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}