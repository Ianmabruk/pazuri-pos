import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../admin/AdminLayout';
import CashierLayout from '../cashier/CashierLayout';

import Home from '../pages/Home';
import About from '../pages/About';
import Services from '../pages/Services';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyCode from '../pages/VerifyCode';

import Dashboard from '../admin/Dashboard';
import Inventory from '../admin/Inventory';
import Sales from '../admin/Sales';
import Staff from '../admin/Staff';
import ActivityLogs from '../admin/ActivityLogs';
import CreditApproval from '../admin/CreditApproval';
import Settings from '../admin/Settings';
import Expenses from '../admin/Expenses';

import CashierPOS from '../cashier/CashierPOS';
import CashierMySales from '../cashier/CashierMySales';
import CashierSettings from '../cashier/CashierSettings';
import ShiftManagement from '../cashier/components/ShiftManagement';
import ExpenseTracker from '../cashier/components/ExpenseTracker';

// Route guards
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/cashier'} replace />;
  }
  return children;
};

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/cashier'} replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/cashier'} replace /> : <Register />} />
        <Route path="/verify-code" element={<VerifyCode />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="sales" element={<Sales />} />
        <Route path="staff" element={<Staff />} />
        <Route path="activity" element={<ActivityLogs />} />
        <Route path="credit-approval" element={<CreditApproval />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Cashier routes */}
      <Route path="/cashier" element={
        <ProtectedRoute requiredRole="cashier">
          <CashierLayout />
        </ProtectedRoute>
      }>
        <Route index element={<CashierPOS />} />
        <Route path="my-sales" element={<CashierMySales />} />
        <Route path="settings" element={<CashierSettings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
