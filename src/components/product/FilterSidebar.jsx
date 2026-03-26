import { useQuery } from '@tanstack/react-query'
import api from '../../utils/api'
import { DEFAULT_FILTERS } from '../../utils/filterDefaults'

export default function FilterSidebar({ filters, setFilters }) {
  // ✅ Brands from API instead of hardcoded
  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: () => api.get('/brands/').then(r => r.data),
  })

  const toggleArr = (key, val) =>
    setFilters(f => ({
      ...f,
      [key]: f[key]?.includes(val)
        ? f[key].filter(x => x !== val)
        : [...(f[key] || []), val],
    }))

  const setRadio = (key, val) =>
    setFilters(f => ({ ...f, [key]: f[key] === val ? '' : val }))

  return (
    <div className="filter-sidebar">
      <h5>Filters</h5>

      {/* Gender */}
      <div className="mb-3">
        <h6>Gender</h6>
        {['Boy', 'Girl'].map(g => (
          <div key={g} className="form-check">
            <input
              className="form-check-input" type="checkbox" id={`g-${g}`}
              checked={filters.gender?.includes(g.toLowerCase())}
              onChange={() => toggleArr('gender', g.toLowerCase())}
            />
            <label className="form-check-label" htmlFor={`g-${g}`}>{g}</label>
          </div>
        ))}
      </div>

      {/* Age group */}
      <div className="mb-3">
        <h6>Age group</h6>
        {[
          ['0-6m',  '0-6 months'],
          ['7-12m', '7-12 months'],
          ['kids',  'Kids'],
          ['adults','Adults'],
        ].map(([val, label]) => (
          <div key={val} className="form-check">
            <input
              className="form-check-input" type="checkbox" id={`a-${val}`}
              checked={filters.age?.includes(val)}
              onChange={() => toggleArr('age', val)}
            />
            <label className="form-check-label" htmlFor={`a-${val}`}>{label}</label>
          </div>
        ))}
      </div>

      {/* ✅ Brands from API */}
      <div className="mb-3">
        <h6>Brands</h6>
        {(brands || []).map(b => (
          <div key={b.id} className="form-check">
            <input
              className="form-check-input" type="checkbox" id={`b-${b.id}`}
              checked={filters.brand?.includes(b.name)}
              onChange={() => toggleArr('brand', b.name)}
            />
            <label className="form-check-label" htmlFor={`b-${b.id}`}>{b.name}</label>
          </div>
        ))}
      </div>

      {/* ✅ Color — now properly wired (sent to backend via ProductListing) */}
      <div className="mb-3">
        <h6>Color</h6>
        {[
          { name: 'Blue',       hex: '#1a56db' },
          { name: 'White',      hex: '#ffffff' },
          { name: 'Red',        hex: '#EE0606' },
          { name: 'Multicolor', hex: '#ccc'    },
          { name: 'Yellow',     hex: '#FFD83B' },
        ].map(c => (
          <div key={c.name} className="form-check d-flex align-items-center gap-2">
            <input
              className="form-check-input" type="checkbox" id={`c-${c.name}`}
              checked={filters.color?.includes(c.name.toLowerCase())}
              onChange={() => toggleArr('color', c.name.toLowerCase())}
            />
            <span style={{
              width: 14, height: 14, borderRadius: '50%',
              background: c.hex, border: '1px solid #ddd',
              display: 'inline-block', flexShrink: 0,
            }} />
            <label className="form-check-label" htmlFor={`c-${c.name}`}>{c.name}</label>
          </div>
        ))}
      </div>

      {/* ✅ Discount — labels now match correct min/max semantics */}
      <div className="mb-3">
        <h6>Discount</h6>
        {['Upto 10%', '10%-20%', '20%-30%', '30%-40%'].map(d => (
          <div key={d} className="form-check">
            <input
              className="form-check-input" type="radio" name="discount" id={`d-${d}`}
              checked={filters.discount === d}
              onChange={() => setRadio('discount', d)}
            />
            <label className="form-check-label" htmlFor={`d-${d}`}>{d}</label>
          </div>
        ))}
      </div>

      {/* Price */}
      <div className="mb-3">
        <h6>Price</h6>
        {['₹ 0-250', '₹ 250-1000', '₹ 1000-3000', '₹ 3000-5000'].map(p => (
          <div key={p} className="form-check">
            <input
              className="form-check-input" type="radio" name="price" id={`p-${p}`}
              checked={filters.price === p}
              onChange={() => setRadio('price', p)}
            />
            <label className="form-check-label" htmlFor={`p-${p}`}>{p}</label>
          </div>
        ))}
      </div>

      {/* Curated collection */}
      <div className="mb-3">
        <h6>Curated collection</h6>
        {[
          ['trending', 'Trending now'],
          ['fast',     'Fast moving'],  // maps to is_top_selling on backend
        ].map(([val, label]) => (
          <div key={val} className="form-check">
            <input
              className="form-check-input" type="checkbox" id={`cc-${val}`}
              checked={filters.curated?.includes(val)}
              onChange={() => toggleArr('curated', val)}
            />
            <label className="form-check-label" htmlFor={`cc-${val}`}>{label}</label>
          </div>
        ))}
      </div>

      {/* Premium */}
      <div className="mb-3">
        <h6>Premium</h6>
        <div className="form-check">
          <input
            className="form-check-input" type="checkbox" id="premium"
            checked={filters.premium}
            onChange={() => setFilters(f => ({ ...f, premium: !f.premium }))}
          />
          <label className="form-check-label" htmlFor="premium">Show premium products</label>
        </div>
      </div>

      {/* ✅ Clear All uses shared DEFAULT_FILTERS constant */}
      <button
        onClick={() => setFilters(DEFAULT_FILTERS)}
        className="btn btn-outline-yellow w-100 btn-sm"
      >
        Clear All
      </button>
    </div>
  )
}