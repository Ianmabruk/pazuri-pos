import React from 'react';

export default function Contact() {
  return (
    <section className="section">
      <div className="container">
        <h1 style={{fontSize:40, fontWeight:800, color:'var(--primary)', margin:'0 0 8px'}}>Contact Us</h1>
        <p className="muted mb-10 max-w-2xl">Have a question? Need help with setup? We're here for you.</p>
        <form className="max-w-md" style={{display:'grid', gap: '12px'}}>
          <input type="text" className="input" placeholder="Your Name" />
          <input type="email" className="input" placeholder="Your Email" />
          <textarea className="input" rows="5" placeholder="Your Message"></textarea>
          <button className="btn btn-primary" type="button">Send Message</button>
        </form>
      </div>
    </section>
  );
}
