import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { X, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export default function CreditRequestModal({ isOpen, onClose, customerName }) {
  const { addCreditRequest, verifyCreditCode } = useData();
  const [step, setStep] = useState('request'); // 'request' or 'verify'
  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
    cashier: 'John Doe' // In real app, get from auth context
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addCreditRequest({
        ...formData,
        customer: customerName,
        amount: parseInt(formData.amount)
      });
      setStep('verify');
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await verifyCreditCode(verificationCode, customerName);
      setVerificationResult(result);
      if (result.valid) {
        // Credit approved, close modal after a delay
        setTimeout(() => {
          onClose();
          // Reset form
          setStep('request');
          setFormData({ amount: '', reason: '', cashier: 'John Doe' });
          setVerificationCode('');
          setVerificationResult(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setVerificationResult({ valid: false });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('request');
    setFormData({ amount: '', reason: '', cashier: 'John Doe' });
    setVerificationCode('');
    setVerificationResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        width: '90%',
        maxWidth: 500,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
          <h2 style={{fontSize: 20, fontWeight: 700, margin: 0}}>
            {step === 'request' ? 'Request Credit' : 'Verify Credit Code'}
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 4
            }}
          >
            <X size={20} />
          </button>
        </div>

        {step === 'request' ? (
          <form onSubmit={handleSubmitRequest}>
            <div style={{marginBottom: 16}}>
              <label style={{display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4}}>
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                disabled
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 14,
                  background: '#f8fafc'
                }}
              />
            </div>

            <div style={{marginBottom: 16}}>
              <label style={{display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4}}>
                Amount (KES)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>

            <div style={{marginBottom: 24}}>
              <label style={{display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4}}>
                Reason
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                required
                rows={3}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 14,
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{display: 'flex', gap: 12}}>
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-outline"
                style={{flex: 1}}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{flex: 1}}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{
              padding: 16,
              background: '#fef3c7',
              borderRadius: 8,
              marginBottom: 24,
              border: '1px solid #fde68a'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <AlertCircle size={20} style={{color: '#92400e'}} />
                <p style={{fontSize: 14, margin: 0, color: '#92400e'}}>
                  Credit request submitted. Please get the verification code from admin to proceed.
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyCode}>
              <div style={{marginBottom: 24}}>
                <label style={{display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4}}>
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character code"
                  maxLength={6}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                      textAlign: 'center',
                      fontFamily: 'monospace',
                      fontSize: 18,
                    letterSpacing: 2
                  }}
                />
              </div>

              {verificationResult && (
                <div style={{
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 16,
                  background: verificationResult.valid ? '#d1fae5' : '#fee2e2',
                  border: `1px solid ${verificationResult.valid ? '#a7f3d0' : '#fecaca'}`
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    {verificationResult.valid ? (
                      <CheckCircle size={20} style={{color: '#065f46'}} />
                    ) : (
                      <X size={20} style={{color: '#991b1b'}} />
                    )}
                    <p style={{
                      fontSize: 14,
                      margin: 0,
                      color: verificationResult.valid ? '#065f46' : '#991b1b'
                    }}>
                      {verificationResult.valid ? 'Credit approved! Processing...' : 'Invalid verification code'}
                    </p>
                  </div>
                </div>
              )}

              <div style={{display: 'flex', gap: 12}}>
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="btn btn-outline"
                  style={{flex: 1}}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{flex: 1}}
                  disabled={loading || verificationCode.length !== 6}
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
