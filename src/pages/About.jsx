import aboutimage from '../assets/about.jpg'

export default function About() {
  return (
    <div className="container-fluid px-0">
      <div className="container py-4">

        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>
          <span>Home/</span> <span style={{ color: '#333' }}>About</span>
        </nav>

        {/* Title */}
        <h2 className="fw-700 text-center mb-4">About Us</h2>

        {/* Mission / Vision + Image row */}
        <div style={{ position: 'relative' }}>

          {/* ✅ Large pink circle bleeding off right edge — matches screenshot */}
          <div style={{
            position: 'absolute',
            right: -120,
            top: -30,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'var(--bz-pink, #ffb2e6)',
            opacity: 0.35,
            zIndex: 0,
            pointerEvents: 'none',
          }} />

          <div className="row g-4 align-items-start mb-5" style={{ position: 'relative', zIndex: 1 }}>
            {/* Left: Mission & Vision */}
            <div className="col-12 col-md-7">
              <div className="mb-4">
                <h4 className="fw-700 mb-2">Our Mision</h4>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: '#444' }}>
                  "To empower parents by providing thoughtfully designed, safe, and sustainable baby essentials
                  that make childcare easier and more enjoyable for every family". "To be the go-to online store
                  for parents seeking reliable, expertly curated baby products, ensuring peace of mind with every
                  purchase". "To offer innovative, high-quality baby gear and apparel that promote infant comfort,
                  safety, and healthy development from day one"
                </p>
              </div>

              <div className="mb-4">
                <h4 className="fw-700 mb-2">Our Vision</h4>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: '#444' }}>
                  "To create a world where every new parent has access to the best resources and products,
                  fostering a generation of healthy, happy, and thriving children". "To become the most beloved
                  and trusted global community for parents, known for our commitment to quality, innovation, and
                  family well-being". "To revolutionize the way families shop for baby products, setting the
                  standard for sustainability, transparency, and personalized support in the industry".
                </p>
              </div>
            </div>

            {/* Right: circular photo */}
            <div className="col-12 col-md-5 d-flex justify-content-center align-items-center" style={{ paddingTop: 20 }}>
              <div style={{
                width: 260,
                height: 260,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid var(--bz-pink, #ff9fe1)',
                boxShadow: '0 4px 24px rgba(255,178,230,0.4)',
              }}>
                <img
                  src={aboutimage}
                  alt="Mother and baby"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Map section */}
        <div style={{ borderRadius: 16, overflow: 'hidden', height: 360, marginBottom: 8 }}>
          <iframe
            title="BabyZone Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4!2d78.1194!3d9.9252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwNTUnMzAuNyJOIDc4wrAwNycwOS44IkU!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="360"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </div>
  )
}