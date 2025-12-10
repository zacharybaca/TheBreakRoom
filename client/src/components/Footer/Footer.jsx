import './footer.css';
import { Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="footer-container">
      <div id="footer-content">
        {/* LEFT — Navigation Links */}
        <nav className="footer-section footer-left">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>

        {/* CENTER — Logo & Tagline */}
        <div className="footer-section footer-center">
          <img
            src="/assets/footer-logo.png"
            className="footer-logo"
            alt="footer logo"
          />
          <p className="tagline">
            From the breakroom, to the world....we speak.
          </p>
        </div>

        {/* RIGHT — Socials & Copyright */}
        <div className="footer-section footer-right">
          <div className="social-icons">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
          </div>
          <p className="copyright">©️ {new Date().getFullYear()} Nine2Five</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
