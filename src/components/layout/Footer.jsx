import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bz-footer">
      <div className="container">
        <div className="row g-4">

          {/* Brand */}
          <div className="col-12 col-md-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
                <img src={logo} alt="BabyZone" style={{ height: 75, width: 'auto', objectFit: 'contain' }} />
              </Link>
            </div>
            <p style={{ fontSize: 13, color: '#555' }}>
              4th street, pallavaram,<br />
              Near bus stand<br />
              Madurai-234567
            </p>
          </div>

          {/* Top Categories */}
          <div className="col-6 col-md-2">
            <h6>Top categories</h6>
            <Link to="/category/baby-fashion">Baby Fashion</Link>
            <Link to="/category/toys">Toys</Link>
            <Link to="/category/footwear-accessories">Footwear & Accessories</Link>
            <Link to="/category/moms-baby-care">Moms & Baby care</Link>
            <Link to="/category/furniture-bedding">Furniture & Bedding</Link>
            <Link to="/rental-services">Rental services</Link>
          </div>

          {/* Customer Support */}
          <div className="col-6 col-md-2">
            <h6>Customer support</h6>
            <Link to="/contact">Help & contact us</Link>
            <Link to="/shipping">Delivery information</Link>
            <Link to="/orders">Track your order</Link>
            <Link to="/returns">Returns & exchange</Link>
            <Link to="/terms">Promotion Terms & conditions</Link>
            <Link to="/terms">Terms & conditions</Link>
          </div>

          {/* Useful Links */}
          <div className="col-6 col-md-2">
            <h6>Useful Links</h6>
            <Link to="/about">Store finder</Link>
            <Link to="/about">Sitemap</Link>
            <Link to="/shipping">Fees and payments policy</Link>
            <Link to="/offers">Offers</Link>
            <Link to="/forum">Forum</Link>
            <Link to="/parenting-classes">Parenting Classes</Link>
          </div>

          {/* About + Social */}
          <div className="col-6 col-md-3">
            <h6>About BabyZone</h6>
            <Link to="/about">About Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & conditions</Link>
            <Link to="/returns">Returns & Exchange</Link>
            <Link to="/contact">Contact Us</Link>

            <h6 className="mt-3">Social Media</h6>
            <div className="d-flex gap-2">
              <a href="https://facebook.com"  target="_blank" rel="noreferrer" className="social-icon"><FaFacebook  size={14} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon"><FaInstagram size={14} /></a>
              <a href="https://twitter.com"   target="_blank" rel="noreferrer" className="social-icon"><FaTwitter  size={14} /></a>
              <a href="https://youtube.com"   target="_blank" rel="noreferrer" className="social-icon"><FaYoutube  size={14} /></a>
            </div>
          </div>

        </div>

        <div className="text-center mt-4 pt-3 border-top" style={{ fontSize: 12, color: '#888' }}>
          © 2025 BabyZone. All rights reserved.
        </div>
      </div>
    </footer>
  )
}