import React from 'react';

export default function Staff() {
  const rows = [
    { id: 1, name: 'John Doe', role: 'Cashier' },
    { id: 2, name: 'Jane Smith', role: 'Manager' },
  ];
  return (
    <div>
      <h1 style={{fontSize:24, fontWeight:800, marginBottom:16}}>Staff</h1>
      <div className="card padded">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
