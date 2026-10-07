import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-layout">
      {/* Moving Text Banner */}
      <div className="marquee-container">
        <div className="marquee-content">
          PREMIUM MEN'S WEAR • ELEVATE YOUR STYLE • NEW ARRIVALS THIS WEEK • EXCLUSIVE COLLECTIONS • PREMIUM MEN'S WEAR • ELEVATE YOUR STYLE • NEW ARRIVALS THIS WEEK • EXCLUSIVE COLLECTIONS
        </div>
      </div>

      {/* Hero Section */}
      <main className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Define Your <br /><span className="highlight">Signature Style.</span>
          </h1>
          <p className="hero-subtitle">
            Discover premium collections crafted for the modern man. Uncompromising quality meets timeless design at MALE.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/login')} className="btn-explore">Login</button>
          </div>
        </div>

        <div className="hero-image-container">
          <img src="/male-logo-new.jpg" className="hero-image" alt="Brand Showcase" />
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <h2 className="footer-brand">MALE</h2>
        <p className="footer-text">Mattammal Jn. Thevara</p>
        <p className="footer-text">97466 00685 | 94951 89519</p>
        <div className="footer-copyright">
          © 2026 MALE. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
