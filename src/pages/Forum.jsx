import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store'
import { useContext } from 'react'
import { AuthModalContext } from '../components/layout/Layout'
import forum1 from '../assets/forum1.jpg'
import forum2 from '../assets/forum2.webp'
import forum3 from '../assets/forum3.jpg'
import forum4 from '../assets/forum4.jpg'
import forum5 from '../assets/forum5.jpg'
import forum6 from '../assets/m1.jpg'
import forum7 from '../assets/forum7.jpg'
import forum8 from '../assets/forum8.webp'


const GROUPS = [
  {
    id: 1, name: 'Pregnancy', users: 500,
    img: forum1,
  },
  {
    id: 2, name: 'Parenting', users: 500,
    img: forum2,
  },
  {
    id: 3, name: 'Childcare', users: 500,
    img: forum3,
  },
  {
    id: 4, name: 'Product Reviews', users: 500,
    img: forum4,
  },
]

const BLOGS = [
  {
    id: 1,
    title: 'The Story of My Rainbow Baby',
    text: "What does it mean when I say my daughter is my 'Rainbow Baby'? A 'Rainbow Baby' is a baby that is born following a miscarriage or an infant loss. Just like a beautiful and...",
    img: forum5,
  },
  {
    id: 2,
    title: 'Baby Dry Skin: Symptoms, Causes and Treatment',
    text: "For a parent, their baby's health is of utmost importance. This means taking care of their internal health by ensuring the right kind of nutrition and choosing products that not only secure their well-being but also their comfort...",
    img: forum6,
  },
  {
    id: 3,
    title: 'Raisins for babies- Health benefits and risks',
    text: "Many of us love a good old raisin- they are small, wrinkled packets of energy that have been around since medieval times and are famous for being a natural source of minerals, vitamins, and carbohydrates...",
    img: forum7,
  },
  {
    id: 4,
    title: 'Hernia in Babies – Types, Causes, Signs and Treatment',
    text: "A hernia is a lump that develops under the skin, in the tummy or groin region, and in variable sizes. When the muscles across the tummy area and the pelvic region weaken or develop a gap, it can lead to the protrusion of organs...",
    img: forum8,
  },
]

export default function Forum() {
  const { isAuthenticated } = useAuthStore()
  const { openLogin }       = useContext(AuthModalContext)
  const navigate            = useNavigate()

  const handleJoin = (groupId) => {
    if (!isAuthenticated) { openLogin(); return }
    navigate(`/forum/${groupId}/chat`)
  }

  return (
    <div className="container py-4">

      {/* Join Forum button */}
      <div className="mb-4">
        <button
          onClick={() => isAuthenticated ? null : openLogin()}
          className="btn btn-yellow px-5 py-2 fw-700"
          style={{ fontSize: 16 }}
        >
          Join Forum
        </button>
      </div>

      {/* Group cards — 4 columns */}
      <div className="row g-3 mb-5">
        {GROUPS.map(group => (
          <div key={group.id} className="col-6 col-md-3">
            <div className="forum-group-card">
              <img src={group.img} alt={group.name} />
              <div className="forum-group-overlay">
                <h6>{group.name}</h6>
                <p>Join forum to ask or share something</p>
                <button
                  onClick={() => handleJoin(group.id)}
                  className="btn btn-yellow btn-sm fw-700 px-4"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blogs section */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <button className="btn btn-yellow px-4 py-2 fw-700" style={{ fontSize: 16 }}>
          Blogs
        </button>
        <Link to="/forum" className="fw-600" style={{ color: 'var(--bz-red)', fontSize: 14 }}>
          View more
        </Link>
      </div>

      <div className="row g-3">
        {BLOGS.map(blog => (
          <div key={blog.id} className="col-12 col-md-6">
            <div className="blog-card">
              <img src={blog.img} alt={blog.title} />
              <div className="blog-body">
                <p className="blog-title">{blog.title}</p>
                <p className="blog-text">{blog.text}</p>
                <button className="btn btn-yellow btn-sm fw-700 mt-2">Read more</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}