import React, { useState, useEffect, useRef, useContext } from 'react'
import logo from '../../assets/logo.png'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiSearch, FiMic, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiChevronRight, FiChevronDown, FiLogOut, FiPackage } from 'react-icons/fi'
import { useAuthStore, useCartStore, useWishlistStore } from '../../store'
import { AuthModalContext } from './Layout'
import toast from 'react-hot-toast'
import c1 from '../../assets/c1.jpg'
import c5 from '../../assets/c5.jpg'
import t1 from '../../assets/t1.jpg'
import c3 from '../../assets/c3.webp'
import f1 from '../../assets/f1.webp'
import m1 from '../../assets/b2.jpg'
import m2 from '../../assets/m2.jpg'
import fur1 from '../../assets/f1.jpg'
import fur2 from '../../assets/h1.jpg'

const OFFERS = [
  '🎁 Get Rs.250 additional off on cart value of Rs.2999 and above',
  '🚚 Free delivery on orders above Rs.499 | Fast shipping across India',
  '👶 New arrivals! Dress your little one in soft breathable fabrics',
  '🔄 Easy 7-day returns on all products | 100% authentic',
]

const ALL_CATS = [
  {
    label: 'Baby Fashion', slug: 'baby-fashion', icon: '👗', promo: 'New Arrivals Starting', promoPrice: '₹299',
    cols: [
      { title: 'Shop by Category', items: ['Sets & Suits','T-Shirts','Shorts','Onesies & Rompers','Nightwear','Shirts','Jeans & Trousers','Party Wear','Ethnic Wear','Inner Wear'] },
      { title: "Don't Miss", items: ['New Born','0-3 Months','3-6 Months','6-12 Months','1-2 Years','2-4 Years','4-6 Years','6-8 Years','8+ Years'] },
      { title: 'Shop by Brand', items: ['Babyhug','Babyoye','Kookie Kids',"Carter's",'Dapper Dudes','Pine Kids','Honeyhap','Primo Gino','Earthy Touch'] },
    ]
  },
  {
    label: 'Toys', slug: 'toys', icon: '🧸', promo: 'Top Toys Starting', promoPrice: '₹199',
    cols: [
      { title: 'Shop by Category', items: ['Action Toys','Arts & Crafts','Bath Toys','Building Blocks','Educational Toys','Musical Toys','Outdoor Toys','Puzzles','Soft Toys','Sports Toys'] },
      { title: 'Shop by Age', items: ['0-6 Months','6-12 Months','1-2 Years','2-3 Years','3-5 Years','5-7 Years','7+ Years'] },
      { title: 'Popular Brands', items: ['Babyhug','Funskool','Hasbro','Hot Wheels','Lego','Mattel','Melissa & Doug','Playgro'] },
    ]
  },
  {
    label: 'Footwear & Accessories', slug: 'footwear-accessories', icon: '👟', promo: 'Footwear Starting', promoPrice: '₹99',
    cols: [
      { title: 'Shop by Category', items: ['Casual Shoes','Sandals','Booties','Flip Flops','Clogs','Sneakers','Ballerinas','Sports Shoes','School Shoes'] },
      { title: "Don't Miss", items: ['Sock Shoes','Socks','Stockings & Tights','Plush Footwear','LED Shoes','Pool Shoes'] },
      { title: 'Shop by Brand', items: ['Cute Walk','Babyhug','Babyoye','Pine Kids','Kookie Kids',"Carter's",'Dapper Dudes'] },
    ]
  },
  {
    label: 'Moms & Baby Care', slug: 'moms-baby-care', icon: '🍼', promo: 'Baby Care Starting', promoPrice: '₹149',
    cols: [
      { title: 'Breast Feeding', items: ['Electric breast pump','Manual breast pump','Feeding shawls','Breast pads','Feeding Pillows','Pregnancy Pillows'] },
      { title: 'Baby Feeding', items: ['Bibs & burp cloths','Feeding bottles','Soothers & pacifiers','Teethers','Baby sippers','Weaning plates','Bottle warmer'] },
      { title: 'Health & Safety', items: ['Baby shampoo','Baby body wash','Baby cream & lotion','Baby wipes','Baby monitors','Thermometers','Grooming kit'] },
    ]
  },
  {
    label: 'Furniture & Bedding', slug: 'furniture-bedding', icon: '🛏️', promo: 'Furniture Starting', promoPrice: '₹999',
    cols: [
      { title: 'Baby Furniture', items: ['Cribs & Cradles','Baby Cots','Wardrobes','Changing Tables','High Chairs','Baby Swings','Baby Walkers'] },
      { title: 'Baby Bedding', items: ['Blankets & Quilts','Crib Sheets','Pillows','Sleeping Bags','Mosquito Nets','Mattresses'] },
      { title: 'Strollers & Gear', items: ['Strollers','Prams','Car Seats','Baby Carriers','Baby Bouncers','Play Gyms'] },
    ]
  },
  {
    label: 'Rental Services', slug: 'rental-services', icon: '🔄', promo: 'Rent from', promoPrice: '₹99/day',
    cols: [
      { title: 'Daily Rentals', items: ['Stroller Rental','Car Seat Rental','Baby Carrier Rental','Play Gym Rental'] },
      { title: 'Weekly Rentals', items: ['Crib Rental','High Chair Rental','Baby Swing Rental','Baby Walker Rental'] },
      { title: 'Monthly Rentals', items: ['Complete Nursery Set','Stroller Monthly','Premium Baby Gear','Furniture Bundle'] },
    ]
  },
]

const CAT_IMAGES = {
  'baby-fashion':        { left: c1, right: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&q=80' },
  'toys':                { left: c5, right: t1 },
  'footwear-accessories':{ left: c3, right: f1 },
  'moms-baby-care':      { left: m1, right: m2 },
  'furniture-bedding':   { left: fur1, right: fur2 },
}

const NAV_CATS = [
  {
    label: 'Baby fashion', slug: 'baby-fashion',
    cols: [
      { title: 'Shop by Category', items: ['Sets & Suits','T-Shirts','Shorts','Onesies & Rompers','Nightwear','Shirts','Jeans & Trousers','Party Wear','Ethnic Wear','Inner Wear'] },
      { title: "Don't Miss", items: ['New Born','0-3 Months','3-6 Months','6-12 Months','1-2 Years','2-4 Years','4-6 Years','6-8 Years','8+ Years'] },
      { title: 'Shop by Brand', items: ['Babyhug','Babyoye','Kookie Kids',"Carter's",'Dapper Dudes','Pine Kids','Honeyhap','Earthy Touch'] },
    ]
  },
  { label: 'Toys', slug: 'toys', cols: [
    { title: 'By Type', items: ['Action Toys','Arts & Crafts','Bath Toys','Building Blocks','Educational Toys','Musical Toys','Outdoor Toys','Puzzles','Soft Toys'] },
    { title: 'By Age', items: ['0-6 Months','6-12 Months','1-2 Years','2-3 Years','3-5 Years','5-7 Years','7+ Years'] },
    { title: 'Popular Brands', items: ['Babyhug','Funskool','Hasbro','Lego','Mattel','Playgro'] },
  ]},
  { label: 'Footwear & Accessories', slug: 'footwear-accessories', cols: [
    { title: 'Baby Footwear', items: ['Booties','Sandals','Casual Shoes','Sports Shoes','Slippers','School Shoes','Clogs','Boots'] },
    { title: 'Fashion Accessories', items: ['Caps & Hats','Sunglasses','Bags','Belts','Hair Accessories','Scarves','Watches'] },
    { title: 'Brands', items: ['Babyhug','Babyoye','Cute Walk','Kookie Kids',"Carter's",'Dapper Dudes'] },
  ]},
  { label: 'Moms & Baby care', slug: 'moms-baby-care', cols: [
    { title: 'Breast Feeding', items: ['Electric pump','Manual pump','Feeding shawls','Breast pads','Feeding Pillows','Pregnancy Pillows'] },
    { title: 'Maternity', items: ['Stretch mark cream','Maternity pads','Maternity panties','Maternity bed mats','Maternity lingerie','Maternity tops'] },
    { title: 'Baby Feeding & Nursery', items: ['Bibs & burp cloths','Feeding bottles','Muslins','Soothers','Teethers','Baby sippers','Weaning plates','Bottle warmer'] },
    { title: 'Baby Hair & Skin', items: ['Baby shampoo','Baby conditioner','Baby hair oil','Baby body oil','Baby body wash','Baby cream','Baby wipes'] },
    { title: 'Baby Grooming', items: ['Baby toothbrush','Baby brush & comb','Baby nail cutter','Cotton buds','Diaper training'] },
    { title: 'Health & Safety', items: ['Baby care equipments','Detergent','Humidifiers','Baby monitors','Safety gates','Thermometers'] },
  ]},
  { label: 'Furniture & Bedding', slug: 'furniture-bedding', cols: [
    { title: 'Baby Bedding', items: ['Blankets & Quilts','Crib Sheets','Pillows','Sleeping Bags','Mosquito Nets','Mattresses'] },
    { title: 'Baby Furniture', items: ['Cribs & Cradles','Baby Cots','Wardrobes','Changing Tables','High Chairs','Baby Swings'] },
    { title: 'Storage', items: ['Storage Boxes','Toy Organisers','Drawer Units','Shelves & Racks'] },
    { title: 'Strollers & Gear', items: ['Strollers','Prams','Car Seats','Baby Carriers','Baby Bouncers','Play Gyms'] },
  ]},
  { label: 'Rental Services', slug: 'rental-services', cols: [] },
  { label: 'Offers', slug: 'offers', cols: [] },
]

export default function Navbar() {
  const [offerIdx, setOfferIdx] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [listening, setListening] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMega, setActiveMega] = useState(null)
  const [showAllCat, setShowAllCat] = useState(false)
  const [hoveredAllCat, setHoveredAllCat] = useState('baby-fashion')
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { count } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const { openLogin } = useContext(AuthModalContext)
  const timerRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => setOfferIdx(i => (i + 1) % OFFERS.length), 3000)
    return () => clearInterval(t)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
  }

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { toast.error('Voice search not supported'); return }
    const r = new SR()
    r.lang = 'en-IN'
    r.onstart = () => setListening(true)
    r.onresult = (e) => {
      const t = e.results[0][0].transcript
      setSearchQuery(t)
      navigate(`/products?search=${encodeURIComponent(t)}`)
    }
    r.onend = () => setListening(false)
    r.onerror = () => setListening(false)
    r.start()
  }

  const handleMegaEnter = (slug) => {
    clearTimeout(timerRef.current)
    setActiveMega(slug)
  }
  const handleMegaLeave = () => {
    timerRef.current = setTimeout(() => setActiveMega(null), 150)
  }

  const activeCat = ALL_CATS.find(c => c.slug === hoveredAllCat)

  return (
    <header className="sticky-top" style={{ zIndex: 999, position: 'relative' }}>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        {OFFERS.map((offer, i) => (
          <span key={i} className={`offer-item ${i === offerIdx ? 'active' : 'hidden'}`}>{offer}</span>
        ))}
      </div>

      {/* Main Navbar */}
      <nav className="main-navbar py-2">
        <div className="container-fluid px-3 px-md-4">
          <div className="d-flex align-items-center gap-3">
            {/* Logo */}
            <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
              <img src={logo} alt="BabyZone" style={{ height: 75, width: 'auto', objectFit: 'contain' }} />
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-grow-1" style={{ maxWidth: 480 }}>
              <div className="search-bar">
                <FiSearch color="#888" size={16} />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search here" />
                <button type="button" onClick={startVoice} className={`voice-btn border-0 bg-transparent p-0 ${listening ? 'listening' : ''}`}>
                  <FiMic size={16} />
                </button>
              </div>
            </form>

            {/* Nav links desktop */}
            <div className="d-none d-lg-flex align-items-center gap-3">
              {[['/', 'Home'], ['/about', 'About'], ['/contact', 'Contact'], ['/forum', 'Forum'], ['/parenting-classes', 'Parenting classes']].map(([to, label]) => (
                <Link key={to} to={to} className="nav-link px-0">{label}</Link>
              ))}
              {isAuthenticated ? (
                <div className="dropdown">
                  <button className="btn btn-link nav-link px-0 dropdown-toggle" data-bs-toggle="dropdown">Account</button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/account"><FiUser size={14} className="me-2" />Profile</Link></li>
                    <li><Link className="dropdown-item" to="/orders"><FiPackage size={14} className="me-2" />My Orders</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={logout}><FiLogOut size={14} className="me-2" />Logout</button></li>
                  </ul>
                </div>
              ) : (
                <button onClick={openLogin} className="btn btn-link nav-link px-0 d-flex align-items-center gap-1">
                  <FiUser size={16} /> Login
                </button>
              )}
              <Link to="/wishlist" className="position-relative" title="Wishlist">
                <FiHeart size={22} color="#1a1a2e" />
                {wishlistItems?.length > 0 && <span className="cart-badge">{wishlistItems.length}</span>}
              </Link>
              <Link to="/cart" className="position-relative">
                <FiShoppingCart size={22} color="#1a1a2e" />
                {count > 0 && <span className="cart-badge">{count}</span>}
              </Link>
            </div>

            {/* Mobile icons */}
            <div className="d-flex d-lg-none align-items-center gap-2">
              <Link to="/wishlist" className="position-relative" title="Wishlist">
                <FiHeart size={22} color="#1a1a2e" />
                {wishlistItems?.length > 0 && <span className="cart-badge">{wishlistItems.length}</span>}
              </Link>
              <Link to="/cart" className="position-relative">
                <FiShoppingCart size={22} />
                {count > 0 && <span className="cart-badge">{count}</span>}
              </Link>
              <button className="btn btn-link p-0" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Category Nav Bar */}
      <div className="category-navbar">
        <div className="container-fluid px-3 px-md-4">
          <div className="d-flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {/* All Categories */}
            <div
              onMouseEnter={() => { clearTimeout(timerRef.current); setShowAllCat(true) }}
              onMouseLeave={() => { timerRef.current = setTimeout(() => setShowAllCat(false), 150) }}>
              <button className="nav-link border-0 bg-transparent d-flex align-items-center gap-1 px-3" style={{ whiteSpace: 'nowrap', height: '100%' }}>
                All categories <FiChevronDown size={13} />
              </button>
            </div>

            {/* Other categories */}
            {NAV_CATS.map(cat => (
              <div key={cat.slug}
                onMouseEnter={() => cat.cols.length && handleMegaEnter(cat.slug)}
                onMouseLeave={handleMegaLeave}>
                <Link
                  to={cat.slug === 'offers' ? '/offers' : cat.slug === 'rental-services' ? '/rental-services' : `/category/${cat.slug}`}
                  className={`nav-link d-flex align-items-center gap-1 px-3 ${location.pathname.includes(cat.slug) ? 'active-cat' : ''}`}
                  style={{ whiteSpace: 'nowrap' }}>
                  {cat.label}
                  {cat.cols.length > 0 && <FiChevronDown size={13} />}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Categories Mega Menu — outside scroll container */}
      {showAllCat && (
        <div
          className="mega-menu show"
          onMouseEnter={() => { clearTimeout(timerRef.current); setShowAllCat(true) }}
          onMouseLeave={() => { timerRef.current = setTimeout(() => setShowAllCat(false), 150) }}
        >
          <div className="mega-menu-inner p-0">
            <div className="all-cat-panel">
              <div className="all-cat-list">
                {ALL_CATS.map(cat => (
                  <div key={cat.slug}
                    className={`cat-item ${hoveredAllCat === cat.slug ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredAllCat(cat.slug)}>
                    {cat.label} <FiChevronRight size={12} />
                  </div>
                ))}
              </div>
              {activeCat && (
                <div className="all-cat-content d-flex gap-5">
                  {activeCat.cols.map(col => (
                    <div key={col.title} style={{ minWidth: 140 }}>
                      <h6>{col.title}</h6>
                      {col.items.map(item => (
                        <Link key={item} to={`/products?search=${encodeURIComponent(item)}`}
                          onClick={() => setShowAllCat(false)}>{item}</Link>
                      ))}
                    </div>
                  ))}
                  <div className="mega-menu promo-card ms-auto" style={{ minWidth: 160 }}>
                    <div style={{ fontSize: 40 }}>{activeCat.icon}</div>
                    <p className="fw-700 mt-2 mb-1" style={{ fontSize: 14 }}>{activeCat.promo}</p>
                    <div className="promo-price">{activeCat.promoPrice}</div>
                    <Link to={`/category/${activeCat.slug}`} className="btn btn-yellow btn-sm mt-2"
                      onClick={() => setShowAllCat(false)}>Shop Now</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAV_CATS Mega Menu — rendered outside scroll container, full width */}
      {activeMega && (() => {
        const cat = NAV_CATS.find(c => c.slug === activeMega)
        if (!cat || !cat.cols.length) return null
        return (
          <div
            className="mega-menu show"
            onMouseEnter={() => handleMegaEnter(activeMega)}
            onMouseLeave={handleMegaLeave}
          >
            <div className="mega-menu-inner">
              <div className="d-flex gap-4 align-items-stretch">
                {/* Left image */}
                {CAT_IMAGES[cat.slug] && (
                  <div className="mega-menu-img-left d-none d-xl-block">
                    <img src={CAT_IMAGES[cat.slug].left} alt="" />
                  </div>
                )}
                {/* Columns */}
                <div className="d-flex gap-5 flex-grow-1 flex-wrap">
                  {cat.cols.map(col => (
                    <div key={col.title} style={{ minWidth: 140 }}>
                      <h6>{col.title}</h6>
                      {col.items.map(item => (
                        <Link key={item} to={`/products?search=${encodeURIComponent(item)}`}
                          onClick={() => setActiveMega(null)}>{item}</Link>
                      ))}
                    </div>
                  ))}
                </div>
                {/* Right image */}
                {CAT_IMAGES[cat.slug] && (
                  <div className="mega-menu-img-right d-none d-xl-block">
                    <img src={CAT_IMAGES[cat.slug].right} alt="" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="bg-white border-top shadow p-3 d-lg-none" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {[['/', 'Home'], ['/about', 'About'], ['/contact', 'Contact'], ['/forum', 'Forum'], ['/parenting-classes', 'Parenting Classes'], ['/offers', 'Offers'], ['/rental-services', 'Rental Services']].map(([to, label]) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)} className="d-block py-2 fw-600 border-bottom text-decoration-none text-dark">{label}</Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/account" onClick={() => setMobileOpen(false)} className="d-block py-2 fw-600 border-bottom text-decoration-none text-dark">My Account</Link>
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="d-block py-2 fw-600 border-bottom text-decoration-none text-dark">My Orders</Link>
              <button onClick={() => { logout(); setMobileOpen(false) }} className="btn btn-link text-danger p-0 py-2 fw-600">Logout</button>
            </>
          ) : (
            <button onClick={() => { openLogin(); setMobileOpen(false) }} className="btn btn-yellow w-100 mt-2">Login / Register</button>
          )}
        </div>
      )}
    </header>
  )
}