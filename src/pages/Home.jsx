import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'
import ProductCard from '../components/product/ProductCard'
import banner1 from '../assets/b1.jpg'
import banner2 from '../assets/b2.jpg'
import banner3 from '../assets/b3.jpg'
import hero1 from '../assets/h1.jpg'
import hero2 from '../assets/h2.jpg'
import c1 from '../assets/c1.jpg'
import c2 from '../assets/c2.jpg'
import c3 from '../assets/c3.webp'
import c5 from '../assets/c5.jpg'
import c6 from '../assets/c6.jpg'

import johnsons   from '../assets/johnsons.jpg'
import pampers    from '../assets/pampers.png'
import babyking   from '../assets/babyking.webp'
import kidlon     from '../assets/kidlon.png'
import fancyfluff from '../assets/fancyfluff.jpg'

const BANNERS = [
  { type: 'three', bg: '#FFB2E6', badge: 'Flat 30% Off', title: 'New launch', desc: 'Strollers, car seats & Much more', imgs: [banner1, banner2, banner3] },
  { type: 'slant', bg: '#FFB2E6', badge: 'Flat 30% Off', title: 'Baby beds & Accessories', desc: 'Premium comfort for your little one', imgLeft: hero1, imgRight: hero2 }
]

// ✅ Fixed: Boys/Girls use gender query param, others use category slug
const CATEGORIES = [
  { name: 'Boys fashion',  to: '/products?gender=boy',              img: c1    },
  { name: 'Girls fashion', to: '/products?gender=girl',             img: c2    },
  { name: 'Footwear',      to: '/category/footwear-accessories',    img: c3    },
  { name: 'Accessories',   to: '/category/footwear-accessories',    img: hero2 },
  { name: 'Toys',          to: '/category/toys',                    img: c5    },
  { name: 'Beds',          to: '/category/furniture-bedding',       img: c6    },
]

const BRANDS = [
  { name: "Johnson's Baby", img: johnsons   },
  { name: 'Pampers',        img: pampers    },
  { name: 'Babyking',       img: babyking   },
  { name: 'Kidlon',         img: kidlon     },
  { name: 'Fancy Fluff',    img: fancyfluff },
]

const REVIEWS = [
  { name: 'Bosky',  rating: 5, text: 'Very fast service and products are genuine..Definitely I am satisfied !', likes: 0, dislikes: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bosky&backgroundColor=b6e3f4' },
  { name: 'Tulip',  rating: 5, text: 'Amazing products. Reasonable prices. Gr8 customer service. Cheers !!!!!!', likes: 0, dislikes: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tulip&backgroundColor=c0aede' },
  { name: 'Deepa',  rating: 5, text: 'Great range of products right from new-born essentials … Excellent product quality and delivery', likes: 0, dislikes: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deepa&backgroundColor=ffd5dc' },
  { name: 'Moshin', rating: 5, text: 'Great site for baby product, i m shopping here since 2012. The quality of product and services is never changed. Keep it up', likes: 0, dislikes: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Moshin&backgroundColor=d1f4cc' },
]

export default function Home() {
  const [bannerIdx, setBannerIdx] = useState(0)
  const banner = BANNERS[bannerIdx]

  const { data: newArrivals = [] } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => api.get('/products/new_arrivals/').then(r => r.data)
  })
  const { data: topSelling = [] } = useQuery({
    queryKey: ['top-selling'],
    queryFn: () => api.get('/products/top_selling/').then(r => r.data)
  })

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div>
      {/* ── Hero Banner ── */}
      {banner.type === 'three' ? (
        <section className="hero-banner position-relative" style={{ background: banner.bg }}>
          <div className="container-fluid px-4 py-4">
            <div className="row align-items-center">
              <div className="col-8">
                <div className="banner-images">
                  {banner.imgs.map((img, i) => (
                    <div key={i} className={`banner-img ${i === 1 ? 'center' : ''}`}>
                      <img src={img} alt="" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-4 text-start ps-3">
                <div className="hero-title-badge">{banner.badge}</div>
                <h2 className="fw-700 mb-2" style={{ fontSize: 'clamp(18px,3vw,36px)' }}>{banner.title}</h2>
                <p className="text-muted mb-3" style={{ fontSize: 14 }}>{banner.desc}</p>
                <Link to="/products" className="btn btn-yellow px-4 py-2" >Shop Now</Link>
              </div>
            </div>
          </div>
          <button className="banner-nav-btn prev" onClick={() => setBannerIdx(i => (i - 1 + BANNERS.length) % BANNERS.length)}><FiChevronLeft size={18} /></button>
          <button className="banner-nav-btn next" onClick={() => setBannerIdx(i => (i + 1) % BANNERS.length)}><FiChevronRight size={18} /></button>
          <div className="banner-dots">{BANNERS.map((_, i) => <button key={i} onClick={() => setBannerIdx(i)} className={`banner-dot ${i === bannerIdx ? 'active' : ''}`} />)}</div>
        </section>
      ) : (
        <section className="hero-banner-slant position-relative" style={{ minHeight: 300 }}>
          <div className="slant-img-left"><img src={banner.imgLeft} alt="" /></div>
          <div className="slant-img-right"><img src={banner.imgRight} alt="" /></div>
          <div className="slant-center">
            <div className="text-center" style={{ maxWidth: 160 }}>
              <div className="slant-badge mb-3"><span>{banner.badge}</span></div>
              <h2 className="fw-700 mb-2" style={{ fontSize: 'clamp(16px,2.5vw,28px)' }}>{banner.title}</h2>
              <p className="text-muted mb-3" style={{ fontSize: 13 }}>{banner.desc}</p>
              <Link to="/products"><div className="slant-btn"><span>Shop Now</span></div></Link>
            </div>
          </div>
          <button className="banner-nav-btn prev" onClick={() => setBannerIdx(i => (i - 1 + BANNERS.length) % BANILERS.length)}><FiChevronLeft size={18} /></button>
          <button className="banner-nav-btn next" onClick={() => setBannerIdx(i => (i + 1) % BANNERS.length)}><FiChevronRight size={18} /></button>
          <div className="banner-dots">{BANNERS.map((_, i) => <button key={i} onClick={() => setBannerIdx(i)} className={`banner-dot ${i === bannerIdx ? 'active' : ''}`} />)}</div>
        </section>
      )}

      {/* ── Categories ── */}
      <section className="py-5">
        <div className="container-fluid px-5">
          <h2 className="section-title">Categories</h2>
          <div className="d-flex justify-content-between flex-nowrap overflow-auto gap-4">
            {/* ✅ Fixed: use `to` directly instead of building from slug */}
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={cat.to}
                className="text-decoration-none text-center d-flex flex-column align-items-center"
                style={{ minWidth: 90 }}
              >
                <div style={{
                  width: 150, height: 180,
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  overflow: 'hidden',
                  border: '3px solid var(--bz-pink)',
                  boxShadow: '0 2px 12px rgba(255,178,230,0.3)'
                }}>
                  <img src={cat.img} alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p className="fw-600 mb-0 mt-2" style={{ fontSize: 13, color: '#1a1a2e' }}>{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="py-4">
        <div className="container">
          <h2 className="section-title text-start">New Arrivals</h2>
          {newArrivals.length > 0 ? (
            <div className="row g-3">
              {newArrivals.map(p => (
                <div key={p.id} className="col-6 col-sm-4 col-lg-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="col-6 col-sm-4 col-lg-3">
                  <div className="product-card placeholder-glow">
                    <div className="card-img-wrap"><span className="placeholder w-100 h-100" /></div>
                    <div className="card-body">
                      <span className="placeholder w-75 d-block mb-2" />
                      <span className="placeholder w-50 d-block" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Top Selling ── */}
      <section className="top-selling-section">
        <div className="container">
          <h2 className="section-title text-start">Top selling</h2>
          {topSelling.length > 0 ? (
            <div className="row g-3">
              {topSelling.map(p => (
                <div key={p.id} className="col-6 col-sm-3">
                  <ProductCard product={p} showBookNow={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="col-6 col-sm-3">
                  <div className="product-card placeholder-glow">
                    <div className="card-img-wrap"><span className="placeholder w-100 h-100" /></div>
                    <div className="card-body"><span className="placeholder w-75 d-block mb-2" /></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Top Brands marquee ── */}
      <section className="py-5">
        <div className="container"><h2 className="section-title">Top Brands</h2></div>
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <div style={{ display: 'flex', gap: 20, animation: 'marquee 20s linear infinite', width: 'max-content' }}>
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <div key={i} style={{
                background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12,
                padding: '10px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minWidth: 140, height: 70, flexShrink: 0,
              }}>
                <img src={b.img} alt={b.name}
                  style={{ height: 84, width: 'auto', maxWidth: 130, objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-4 pb-5">
        <div className="container">
          <h2 className="section-title">Our happy customer</h2>
          <div className="row g-4 mb-4" style={{ paddingTop: 40 }}>
            {REVIEWS.map(r => (
              <div key={r.name} className="col-6 col-md-3">
                <div style={{ position: 'relative', paddingTop: 48 }}>
                  <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: 80, height: 80, borderRadius: '50%',
                    border: '3px solid #2d2d2d', boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                    overflow: 'hidden', zIndex: 2, background: '#f0f0f0',
                  }}>
                    <img src={r.avatar} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{
                    border: '2px solid #171717', borderRadius: 12,
                    padding: '48px 16px 16px', textAlign: 'center',
                    background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  }}>
                    <h6 className="fw-700 mb-1">{r.name}</h6>
                    <div className="mb-2" style={{ color: '#FFD83B', fontSize: 18, letterSpacing: 2 }}>
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </div>
                    <p style={{ fontSize: 13, color: '#464646', lineHeight: 1.6, minHeight: 72 }}>{r.text}</p>
                    <div className="d-flex justify-content-center gap-4 mt-2" style={{ fontSize: 13, color: '#888' }}>
                      <span className="d-flex align-items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3z"/>
                          <rect x="16" y="2" width="4" height="13" rx="1"/>
                        </svg>{r.dislikes}
                      </span>
                      <span className="d-flex align-items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/>
                          <rect x="2" y="13" width="4" height="9" rx="1"/>
                        </svg>{r.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-end">
            <button className="btn btn-yellow px-5">View More</button>
          </div>
        </div>
      </section>
    </div>
  )
}