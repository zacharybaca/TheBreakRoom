import './footer.css';
import { Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer>
      {/* Top Section */}
      <div className="footer-top">
        <p className="tagline">From the breakroom, to the world....we speak.</p>
        <nav className="footer-links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms</a>
        </nav>
        <img src="/assets/footer-logo.png" className="footer-img" alt="footer logo" />
      </div>
      <br />
      {/* Bottom Section */}
      <div className="footer-bottom">
        <p className="copyright">
          ©️ {new Date().getFullYear()} Nine2Five. All rights reserved.
        </p>
        <div className="social-icons">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Github size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
