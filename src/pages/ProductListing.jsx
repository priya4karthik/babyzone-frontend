import { useState, useCallback, useEffect } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { FiFilter, FiX } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'
import ProductCard from '../components/product/ProductCard'
import FilterSidebar from '../components/product/FilterSidebar'
import { DEFAULT_FILTERS } from '../utils/filterDefaults'

const PRICE_MAP = {
  '₹ 0-250':     { min: 0,    max: 250  },
  '₹ 250-1000':  { min: 250,  max: 1000 },
  '₹ 1000-3000': { min: 1000, max: 3000 },
  '₹ 3000-5000': { min: 3000, max: 5000 },
}

const DISCOUNT_MAP = {
  'Upto 10%': { min: 1,  max: 10 },
  '10%-20%':  { min: 10, max: 20 },
  '20%-30%':  { min: 20, max: 30 },
  '30%-40%':  { min: 30, max: 40 },
}

export default function ProductListing() {
  const [searchParams] = useSearchParams()
  const { slug }       = useParams()
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters]       = useState(DEFAULT_FILTERS)
  const [sort, setSort]             = useState('-created_at')
  const [page, setPage]             = useState(1)

  const search      = searchParams.get('search') || ''
  // ✅ Read gender from URL: /products?gender=boy or /products?gender=girl
  const genderParam = searchParams.get('gender') || ''

  // ✅ Reset filters when category, gender or search changes
  useEffect(() => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }, [slug, search, genderParam])

  // Lock body scroll when mobile filter drawer open
  useEffect(() => {
    document.body.style.overflow = showFilter ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showFilter])

  const buildParams = useCallback(() => {
    const p = { page, ordering: sort }

    if (slug)        p.category = slug
    if (search)      p.search   = search
    // ✅ gender from URL param takes priority over sidebar filter
    if (genderParam) p.gender   = genderParam
    else if (filters.gender?.length) p.gender = filters.gender[0]

    if (filters.age?.length)   p.age_group  = filters.age[0]
    if (filters.brand?.length) p.brand      = filters.brand[0]
    if (filters.premium)       p.is_premium = true

    if (filters.curated?.includes('trending')) p.is_trending    = true
    if (filters.curated?.includes('fast'))     p.is_top_selling = true

    if (filters.color?.length) p.color = filters.color[0]

    if (filters.price) {
      const range = PRICE_MAP[filters.price]
      if (range) { p.min_price = range.min; p.max_price = range.max }
    }

    if (filters.discount) {
      const range = DISCOUNT_MAP[filters.discount]
      if (range) { p.min_discount = range.min; p.max_discount = range.max }
    }

    return p
  }, [slug, search, genderParam, filters, sort, page])

  const { data, isLoading } = useQuery({
    queryKey: ['products', slug, search, genderParam, filters, sort, page],
    queryFn:  () => api.get('/products/', { params: buildParams() }).then(r => r.data),
  })

  // ✅ Page title shows Boys/Girls fashion correctly
  const title = genderParam
    ? genderParam === 'boy' ? 'Boys Fashion' : 'Girls Fashion'
    : slug
      ? slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
      : search ? `Search: "${search}"` : 'All Products'

  const totalPages = data ? Math.ceil(data.count / 9) : 1

  const activeCount = [
    ...(filters.gender   || []),
    ...(filters.age      || []),
    ...(filters.brand    || []),
    ...(filters.color    || []),
    ...(filters.curated  || []),
    filters.discount,
    filters.price,
    filters.premium ? 'premium' : '',
  ].filter(Boolean).length

  return (
    <div className="container-fluid px-3 px-md-4 py-3">
      <div className="row g-4">
        {/* Sidebar — desktop */}
        <div className="col-md-3 d-none d-md-block">
          <FilterSidebar filters={filters} setFilters={f => { setFilters(f); setPage(1) }} />
        </div>

        {/* Main content */}
        <div className="col-12 col-md-9">
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <h4 className="fw-700 mb-0">{title}</h4>
            <div className="d-flex align-items-center gap-2">
              {/* Mobile filter button */}
              <button
                className="btn btn-outline-secondary btn-sm d-md-none d-flex align-items-center gap-1"
                onClick={() => setShowFilter(true)}
              >
                <FiFilter size={14} /> Filters
                {activeCount > 0 && (
                  <span className="badge bg-warning text-dark ms-1">{activeCount}</span>
                )}
              </button>

              {/* Sort */}
              <div className="d-flex align-items-center gap-2">
                <span className="fw-600" style={{ fontSize: 14 }}>Sort by</span>
                <select
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1) }}
                  className="form-select form-select-sm"
                  style={{ width: 'auto', fontFamily: 'Quicksand' }}
                >
                  <option value="-created_at">New arrivals</option>
                  <option value="mrp">Price: Low to High</option>
                  <option value="-mrp">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="row g-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="col-6 col-sm-4">
                  <div className="product-card placeholder-glow">
                    <div className="card-img-wrap" style={{ aspectRatio: 1 }}>
                      <span className="placeholder w-100 h-100" />
                    </div>
                    <div className="card-body">
                      <span className="placeholder w-75 d-block mb-2" />
                      <span className="placeholder w-50 d-block" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="row g-3">
                {(data?.results || []).map(p => (
                  <div key={p.id} className="col-6 col-sm-4">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>

              {!data?.results?.length && (
                <div className="text-center py-5 text-muted">
                  <div style={{ fontSize: 48 }}>🔍</div>
                  <p className="fw-600 mt-3">No products found</p>
                  <p style={{ fontSize: 13 }}>Try adjusting your filters</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="d-flex align-items-center justify-content-end gap-2 mt-4">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >← Prev</button>
                  <span className="fw-600" style={{ fontSize: 14 }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilter && (
        <div className="position-fixed d-flex"
          style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
          <div
            style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setShowFilter(false)}
          />
          <div className="bg-white h-100 overflow-y-auto p-3" style={{ width: 280 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-700">Filters</h5>
              <button className="btn btn-link p-0" onClick={() => setShowFilter(false)}>
                <FiX size={22} />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              setFilters={f => { setFilters(f); setPage(1); setShowFilter(false) }}
            />
          </div>
        </div>
      )}
    </div>
  )
}