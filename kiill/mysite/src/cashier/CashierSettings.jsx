import { useState } from 'react';
import { useData } from '../context/DataContext';
import { User, Mail, Lock, Image, Moon, Sun } from 'lucide-react';

export default function CashierSettings() {
  const { cashierProfile, updateCashierProfile } = useData();
  const [formData, setFormData] = useState({
    name: cashierProfile.name,
    username: cashierProfile.username,
    email: cashierProfile.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateCashierProfile({
      name: formData.name,
      username: formData.username,
      email: formData.email
    });
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }
    // In real app, this would call an API to change password
    setMessage({ type: 'success', text: 'Password changed successfully!' });
    setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleThemeToggle = () => {
    const newTheme = cashierProfile.theme === 'light' ? 'dark' : 'light';
    updateCashierProfile({ theme: newTheme });
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCashierProfile({ profilePicture: reader.result });
        setMessage({ type: 'success', text: 'Profile picture updated!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Settings</h1>

      {message.text && (
        <div style={{
          padding: 12,
          borderRadius: 8,
          marginBottom: 24,
          background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`
        }}>
          {message.text}
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        {/* Profile Settings */}
        <div className="card padded">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Profile Information</h2>

          {/* Profile Picture */}
          <div style={{ marginBottom: 24, textAlign: 'center' }}>
            <div style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: cashierProfile.profilePicture ? `url(${cashierProfile.profilePicture})` : '#e2e8f0',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {!cashierProfile.profilePicture && (
                <User size={48} style={{ color: '#94a3b8' }} />
              )}
            </div>
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: '#fff',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}>
              <Image size={16} />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <form onSubmit={handleProfileUpdate}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Save Changes
            </button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="card padded">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Security</h2>

          <form onSubmit={handlePasswordChange}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                Current Password
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Change Password
            </button>
          </form>
        </div>

        {/* Appearance Settings */}
        <div className="card padded">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Appearance</h2>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            background: '#f8fafc',
            borderRadius: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {cashierProfile.theme === 'light' ? (
                <Sun size={24} style={{ color: '#f59e0b' }} />
              ) : (
                <Moon size={24} style={{ color: '#6366f1' }} />
              )}
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Theme</p>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
                  {cashierProfile.theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </p>
              </div>
            </div>
            <button
              onClick={handleThemeToggle}
              className="btn btn-outline"
              style={{ fontSize: 12, padding: '6px 12px' }}
            >
              Toggle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}