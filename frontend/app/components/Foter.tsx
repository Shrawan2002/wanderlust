import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        <div className="footer-section">
          <h3>Explore</h3>
          <ul>
            <li><a href="/listings">All Listings</a></li>
            <li><a href="/become-a-host">Become a Host</a></li>
            <li><a href="/destinations">Popular Destinations</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 explorer. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
