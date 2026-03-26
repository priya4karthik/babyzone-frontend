import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { FiChevronRight, FiHome } from 'react-icons/fi'

const SLUG_LABELS = {
  'baby-fashion':        'Baby Fashion',
  'toys':                'Toys',
  'footwear-accessories':'Footwear & Accessories',
  'moms-baby-care':      'Moms & Baby Care',
  'furniture-bedding':   'Furniture & Bedding',
  'rental-services':     'Rental Services',
  'offers':              'Offers',
  'products':            'Products',
  'cart':                'Cart',
  'wishlist':            'Wishlist',
  'account':             'My Account',
  'orders':              'My Orders',
  'about':               'About Us',
  'contact':             'Contact',
  'forum':               'Forum',
  'parenting-classes':   'Parenting Classes',
  'checkout':            'Checkout',
  'rental-checkout':     'Rental Checkout',
}

function toLabel(segment) {
  return SLUG_LABELS[segment] ||
    segment.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function Breadcrumb({ items, productName, categoryLabel }) {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')

  if (location.pathname === '/') return null

  // Legacy mode — items array passed manually (backward compat)
  if (items && Array.isArray(items) && items.length > 0) {
    return (
      <nav aria-label="breadcrumb"
        style={{ background:'#fff', borderBottom:'1px solid #f0e6f0', padding:'10px 0', zIndex:10 }}>
        <div className="container-fluid px-3 px-md-4">
          <div className="bz-breadcrumb">
            {items.map((item, i) => (
              <span key={i}>
                {i > 0 && <span className="separator"> / </span>}
                {item.to
                  ? <Link to={item.to}>{item.label}</Link>
                  : <span className="current">{item.label}</span>
                }
              </span>
            ))}
          </div>
        </div>
      </nav>
    )
  }

  // Auto mode — build crumbs from current URL
  const segments = location.pathname.split('/').filter(Boolean)
  const crumbs = [{ label: 'Home', to: '/' }]

  // Skip generic path segments like 'category' and 'products' — show the slug directly
  const SKIP_SEGMENTS = new Set(['category', 'products'])

  segments.forEach((seg, idx) => {
    // Skip segments like 'category' — just show the slug label after it
    if (SKIP_SEGMENTS.has(seg)) return

    const to    = '/' + segments.slice(0, idx + 1).join('/')
    const isLast = idx === segments.length - 1
    const label  = isLast && productName   ? productName
                 : idx === 1 && categoryLabel ? categoryLabel
                 : toLabel(seg)
    crumbs.push({ label, to: isLast ? null : to })
  })

  if (searchQuery && !productName) {
    crumbs.push({ label: `"${searchQuery}"`, to: null })
  }

  const lastCrumb = crumbs[crumbs.length - 1]

  return (
    <nav aria-label="breadcrumb"
      style={{ background:'#fff', borderBottom:'1px solid #f0e6f0', padding:'10px 0', zIndex:10 }}>
      <div className="container-fluid px-3 px-md-4">
        <ol className="d-flex align-items-center flex-wrap mb-0 p-0 list-unstyled gap-1"
          style={{ fontSize: 13 }}>

          {/* Home — always visible */}
          <li className="d-flex align-items-center">
            <Link to="/" className="d-flex align-items-center text-decoration-none"
              style={{ color:'#e91e8c', fontWeight:500 }}>
              <FiHome size={14} className="me-1" />Home
            </Link>
          </li>

          {/* Middle crumbs — desktop only */}
          {crumbs.slice(1, -1).map((crumb, idx) => (
            <li key={idx} className="d-none d-md-flex align-items-center">
              <FiChevronRight size={13} style={{ color:'#bbb', margin:'0 4px' }} />
              {crumb.to
                ? <Link to={crumb.to} className="text-decoration-none"
                    style={{ color:'#e91e8c', fontWeight:500 }}>{crumb.label}</Link>
                : <span style={{ color:'#555', fontWeight:600 }}>{crumb.label}</span>
              }
            </li>
          ))}

          {/* Last crumb — always visible */}
          {crumbs.length > 1 && (
            <li className="d-flex align-items-center">
              <FiChevronRight size={13} style={{ color:'#bbb', margin:'0 4px' }} />
              <span style={{
                color:'#555', fontWeight:600,
                maxWidth:200, overflow:'hidden',
                textOverflow:'ellipsis', whiteSpace:'nowrap', display:'inline-block',
              }} title={lastCrumb.label}>
                {lastCrumb.label}
              </span>
            </li>
          )}
        </ol>
      </div>
    </nav>
  )
}