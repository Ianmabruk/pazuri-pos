import { useState } from 'react';
import { Clock, DollarSign, Smartphone, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function ShiftManagement() {
  const { timeTracking, startShift, endShift } = useData();
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [openingFloat, setOpeningFloat] = useState('');
  const [closingCash, setClosingCash] = useState('');
  const [closingMpesa, setClosingMpesa] = useState('');

  const handleStartShift = (e) => {
    e.preventDefault();
    startShift(parseFloat(openingFloat));
    setOpeningFloat('');
    setShowStartModal(false);
  };

  const handleEndShift = (e) => {
    e.preventDefault();
    endShift(parseFloat(closingCash), parseFloat(closingMpesa));
    setClosingCash('');
    setClosingMpesa('');
    setShowEndModal(false);
  };

  const getShiftDuration = () => {
    if (!timeTracking.currentShift) return '0h 0m';
    const start = new Date(timeTracking.currentShift.startTime);
    const now = new Date();
    const diff = now - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div>
      {timeTracking.currentShift ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          background: '#d1fae5',
          border: '1px solid #a7f3d0',
          borderRadius: 8
        }}>
          <Clock size={20} style={{ color: '#065f46' }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#065f46' }}>
              Shift Active - {getShiftDuration()}
            </p>
            <p style={{ fontSize: 12, color: '#047857', margin: 0 }}>
              Started: {new Date(timeTracking.currentShift.startTime).toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={() => setShowEndModal(true)}
            className="btn btn-outline"
            style={{ fontSize: 12, padding: '6px 12px' }}
          >
            End Shift
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowStartModal(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Clock size={16} />
          Start Shift
        </button>
      )}

      {/* Start Shift Modal */}
      {showStartModal && (
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
            maxWidth: 400
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Start Shift</h2>
              <button
                onClick={() => setShowStartModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleStartShift}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  Opening Float (KES)
                </label>
                <input
                  type="number"
                  value={openingFloat}
                  onChange={(e) => setOpeningFloat(e.target.value)}
                  placeholder="Enter opening cash amount"
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
                <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  Amount of cash in the drawer at shift start
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowStartModal(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Start Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* End Shift Modal */}
      {showEndModal && (
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
            maxWidth: 400
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>End Shift</h2>
              <button
                onClick={() => setShowEndModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEndShift}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  Closing Cash (KES)
                </label>
                <input
                  type="number"
                  value={closingCash}
                  onChange={(e) => setClosingCash(e.target.value)}
                  placeholder="Total cash in drawer"
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

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  M-PESA Total (KES)
                </label>
                <input
                  type="number"
                  value={closingMpesa}
                  onChange={(e) => setClosingMpesa(e.target.value)}
                  placeholder="Total M-PESA collected"
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

              <div style={{
                padding: 16,
                background: '#f8fafc',
                borderRadius: 8,
                marginBottom: 24
              }}>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0, marginBottom: 8 }}>
                  Shift Summary
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: '#6b7280' }}>Duration:</span>
                  <span style={{ fontWeight: 600 }}>{getShiftDuration()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#6b7280' }}>Opening Float:</span>
                  <span style={{ fontWeight: 600 }}>
                    KES {timeTracking.currentShift?.openingFloat?.toLocaleString() || 0}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowEndModal(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  End Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}