import React from 'react';

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col" style={{display:'flex', gap:12, alignItems:'center'}}>
          <img src="/logo.png" alt="Pazuri Fish" style={{width:56, height:56, objectFit:'cover', borderRadius:8}} />
          <div>
            <h3 className="brand" style={{fontSize: 18, margin:0}}>Pazuri Fish POS</h3>
            <p className="footer-muted" style={{margin:0}}>Modern POS solutions for smart fish & retail businesses.</p>
          </div>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          <ul className="footer-links">
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </div>
        <div className="footer-muted" style={{gridColumn: '1/-1'}}>© {new Date().getFullYear()} Pazuri Technologies — All Rights Reserved.</div>
      </div>
    </footer>
  );
}
