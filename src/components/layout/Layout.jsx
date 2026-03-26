import React, { useState, createContext } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import AuthModal from '../ui/AuthModal'
import LiveChat from '../ui/LiveChat'
import Breadcrumb from '../ui/Breadcrumb'

export const AuthModalContext = createContext()

export default function Layout() {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const openLogin = () => { setAuthMode('login'); setShowAuth(true) }
  const openRegister = () => { setAuthMode('register'); setShowAuth(true) }

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister }}>
      <div className="d-flex flex-column min-vh-100">
        <Navbar onLoginClick={openLogin} />
        <Breadcrumb />
        <main className="flex-grow-1">
          <Outlet />
        </main>
        <Footer />
        <LiveChat />
        {showAuth && (
          <AuthModal
            mode={authMode}
            onClose={() => setShowAuth(false)}
            onSwitchMode={(m) => setAuthMode(m)}
          />
        )}
      </div>
    </AuthModalContext.Provider>
  )
}