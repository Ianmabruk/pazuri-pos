import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { CheckCircle, XCircle, Clock, User, DollarSign, Calendar, Key, History } from 'lucide-react';

export default function CreditApproval() {
  const { creditRequests, approveCreditRequest, rejectCreditRequest, getCustomerHistory } = useData();
  const [filter, setFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerHistory, setCustomerHistory] = useState([]);

  const filteredRequests = creditRequests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' },
      approved: { background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' },
      rejected: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }
    };
    return (
      <span style={{
        ...styles[status],
        padding: '4px 12px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        textTransform: 'capitalize'
      }}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16}}>
        <h1 style={{fontSize:24, fontWeight:800}}>Credit Approval</h1>
        <div style={{display: 'flex', gap: 8}}>
          <button 
            className={filter === 'all' ? 'btn btn-primary' : 'btn btn-outline'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'pending' ? 'btn btn-primary' : 'btn btn-outline'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={filter === 'approved' ? 'btn btn-primary' : 'btn btn-outline'}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={filter === 'rejected' ? 'btn btn-primary' : 'btn btn-outline'}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="grid" style={{gap: 16}}>
        {filteredRequests.length === 0 ? (
          <div className="card padded" style={{textAlign: 'center', padding: 40}}>
            <Clock size={48} style={{margin: '0 auto', color: 'var(--muted)'}} />
            <p className="muted" style={{marginTop: 16}}>No credit requests found</p>
          </div>
        ) : (
          filteredRequests.map(req => (
            <div key={req.id} className="card padded">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}>
                      <User size={24} />
                    </div>
                    <div>
                      <h3 style={{fontSize: 18, fontWeight: 700, margin: 0}}>{req.customer}</h3>
                      <p className="muted" style={{fontSize: 14, margin: 0}}>Submitted by {req.cashier}</p>
                    </div>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 16}}>
                    <div>
                      <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4}}>
                        <DollarSign size={16} className="muted" />
                        <p className="muted" style={{fontSize: 12, margin: 0}}>Amount</p>
                      </div>
                      <p style={{fontSize: 20, fontWeight: 700, margin: 0}}>KES {req.amount.toLocaleString()}</p>
                    </div>

                    <div>
                      <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4}}>
                        <Calendar size={16} className="muted" />
                        <p className="muted" style={{fontSize: 12, margin: 0}}>Date & Time</p>
                      </div>
                      <p style={{fontSize: 14, fontWeight: 600, margin: 0}}>{req.date} {req.time}</p>
                    </div>

                    <div>
                      <p className="muted" style={{fontSize: 12, marginBottom: 4}}>Status</p>
                      {getStatusBadge(req.status)}
                    </div>

                    {req.status === 'approved' && req.verificationCode && (
                      <div>
                        <p className="muted" style={{fontSize: 12, marginBottom: 4}}>Verification Code</p>
                        <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                          <Key size={16} className="muted" />
                          <span style={{fontSize: 16, fontWeight: 600, fontFamily: 'monospace'}}>{req.verificationCode}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{marginTop: 16, padding: 12, background: 'var(--bg-soft)', borderRadius: 8}}>
                    <p className="muted" style={{fontSize: 12, marginBottom: 4}}>Reason</p>
                    <p style={{fontSize: 14, margin: 0}}>{req.reason}</p>
                  </div>

                  <div style={{marginTop: 12}}>
                    <button
                      className="btn btn-outline"
                      style={{display: 'flex', alignItems: 'center', gap: 6}}
                      onClick={() => setSelectedCustomer(selectedCustomer === req.customer ? null : req.customer)}
                    >
                      <History size={16} />
                      {selectedCustomer === req.customer ? 'Hide History' : 'View History'}
                    </button>
                  </div>

                  {selectedCustomer === req.customer && (
                    <div style={{marginTop: 16, padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0'}}>
                      <h4 style={{fontSize: 16, fontWeight: 600, marginBottom: 8}}>Credit History for {req.customer}</h4>
                      {customerHistory.length === 0 ? (
                        <p className="muted" style={{fontSize: 14}}>No previous credit history</p>
                      ) : (
                        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                          {customerHistory.map((history, index) => (
                            <div key={index} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, background: '#fff', borderRadius: 4}}>
                              <div>
                                <p style={{fontSize: 14, fontWeight: 600, margin: 0}}>KES {history.amount.toLocaleString()}</p>
                                <p className="muted" style={{fontSize: 12, margin: 0}}>{history.date}</p>
                              </div>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: 12,
                                fontSize: 12,
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                background: history.status === 'approved' ? '#d1fae5' : history.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                                color: history.status === 'approved' ? '#065f46' : history.status === 'rejected' ? '#991b1b' : '#92400e'
                              }}>
                                {history.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {req.status === 'pending' && (
                  <div style={{display: 'flex', gap: 8, marginLeft: 16}}>
                    <button 
                      className="btn"
                      style={{
                        background: '#16a34a',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                      onClick={() => approveCreditRequest(req.id)}
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                    <button 
                      className="btn"
                      style={{
                        background: '#dc2626',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                      onClick={() => rejectCreditRequest(req.id)}
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}