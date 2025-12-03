import React from 'react';

export default function Settings() {
  return (
    <div>
      <h1 style={{fontSize:24, fontWeight:800, marginBottom:16}}>Settings</h1>
      <div className="card padded" style={{maxWidth:720}}>
        <div className="mb-4">
          <label className="muted" style={{fontSize:14}}>Business Name</label>
          <input className="input mt-2" defaultValue="Pazuri Fish POS" />
        </div>
        <div className="mb-4">
          <label className="muted" style={{fontSize:14}}>Currency</label>
          <input className="input mt-2" defaultValue="KES" />
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </div>
    </div>
  );
}
