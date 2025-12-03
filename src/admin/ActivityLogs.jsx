import React from 'react';

export default function ActivityLogs() {
  const rows = [
    { id: 1, title: 'Login', user: 'Jane', time: '10:21' },
    { id: 2, title: 'Added stock', user: 'John', time: '10:45' },
    { id: 3, title: 'Sale INV-1421', user: 'Jane', time: '11:02' },
  ];
  return (
    <div>
      <h1 style={{fontSize:24, fontWeight:800, marginBottom:16}}>Activity Logs</h1>
      <div className="card padded">
        <ul style={{display:'grid', gap: '8px', fontSize:14}}>
          {rows.map(r => (
            <li key={r.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom: '1px solid var(--border)', padding:'8px 0'}}>
              <span>{r.title}</span>
              <span className="footer-muted">{r.user} • {r.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
