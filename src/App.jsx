import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Personal from './pages/Personal.jsx'
import Business from './pages/Business.jsx'
import Platform from './pages/Platform.jsx'
import Help from './pages/Help.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import SendMoneyCountry from './pages/SendMoneyCountry.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/co/account/" element={<Personal />} />
          <Route path="/co/account" element={<Personal />} />
          <Route path="/co/business/" element={<Business />} />
          <Route path="/co/business" element={<Business />} />
          <Route path="/platform/" element={<Platform />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/help" element={<Help />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/send-money/:segment" element={<SendMoneyCountry />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
