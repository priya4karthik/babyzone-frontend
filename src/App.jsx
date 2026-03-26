import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import TrackOrder from './pages/TrackOrder'
import Orders from './pages/Orders'
import Forum from './pages/Forum'
import ForumChat from './pages/ForumChat'
import ParentingClasses from './pages/ParentingClasses'
import About from './pages/About'
import Contact from './pages/Contact'
import Offers from './pages/Offers'
// import { Offers } from './pages/Offers'
import RentalServices from './pages/RentalServices'
import RentalCheckout from './pages/RentalCheckout'
import Account from './pages/Account'
import Wishlist from './pages/Wishlist'
import ProtectedRoute from './components/layout/ProtectedRoute'
import ReturnExchange from './pages/ReturnExchange'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import ShippingPolicy from './pages/ShippingPolicy'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductListing />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="category/:slug" element={<ProductListing />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="offers" element={<Offers />} />
        <Route path="rental-services" element={<RentalServices />} />
        <Route path="forum" element={<Forum />} />
        <Route path="parenting-classes" element={<ParentingClasses />} />

        {/* Policy pages */}
        <Route path="returns" element={<ReturnExchange />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsConditions />} />
        <Route path="shipping" element={<ShippingPolicy />} />

        {/* Protected routes — must be logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="rental-checkout" element={<RentalCheckout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id/track" element={<TrackOrder />} />
          <Route path="account" element={<Account />} />
          <Route path="forum/:groupId/chat" element={<ForumChat />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={
          <div className="container py-5 text-center">
            <div style={{ fontSize: 72 }}>🍼</div>
            <h3 className="fw-700 mt-3">Page not found</h3>
            <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
            <a href="/" className="btn btn-yellow px-5">Go Home</a>
          </div>
        } />
      </Route>
    </Routes>
  )
}