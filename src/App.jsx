import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingQR from './components/FloatingQR.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { ViewAsProvider, useViewer } from './context/ViewAsContext.jsx'
import IdleTimeout from './components/IdleTimeout.jsx'
import Home from './pages/Home.jsx'
import Personal from './pages/Personal.jsx'
import Business from './pages/Business.jsx'
import Platform from './pages/Platform.jsx'
import Help from './pages/Help.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import SendMoneyCountry from './pages/SendMoneyCountry.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Cards from './pages/Cards.jsx'
import CardDetail from './pages/CardDetail.jsx'
import Transactions from './pages/Transactions.jsx'
import Recipients from './pages/Recipients.jsx'
import Insights from './pages/Insights.jsx'
import Scheduled from './pages/Scheduled.jsx'
import Recurring from './pages/Recurring.jsx'
import PaymentRequests from './pages/PaymentRequests.jsx'
import BillSplits from './pages/BillSplits.jsx'
import DirectDebits from './pages/DirectDebits.jsx'
import YourAccount from './pages/YourAccount.jsx'
import Inbox from './pages/Inbox.jsx'
import Pricing from './pages/Pricing.jsx'
import AccountDetails from './pages/AccountDetails.jsx'
import DoMore from './pages/DoMore.jsx'
import AddMoney from './pages/AddMoney.jsx'
import PlaidConnect from './pages/PlaidConnect.jsx'
import ContactForm from './pages/ContactForm.jsx'
import Admin from './pages/Admin.jsx'
import BalanceDetail from './pages/BalanceDetail.jsx'
import NotFound from './pages/NotFound.jsx'

// Prefijos de rutas de app/auth: sin barra ni pie de marketing
const APP_PREFIXES = ['/login', '/register', '/admin', '/home', '/cards', '/transactions', '/recipients', '/insights', '/payments', '/your-account', '/flows', '/external-callback', '/contact-form', '/balances']

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Ruta protegida: requiere sesión activa Y contraseña creada.
// Excepción: en modo "ver como usuario" (preview del admin) se permite (acceso vía adminClient).
function Protected({ children }) {
  const { session, user, loading } = useAuth()
  const { viewAs } = useViewer()
  if (viewAs) return children
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-content-tertiary">Cargando…</div>
  }
  if (!session) return <Navigate to="/login" replace />
  if (!user?.user_metadata?.password_set) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { pathname } = useLocation()
  // Rutas sin la barra/pie de marketing (auth y app logueada)
  const bare = APP_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))

  return (
    <ViewAsProvider>
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <IdleTimeout />
      {!bare && <Navbar />}
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
          <Route path="/home" element={<Protected><Dashboard /></Protected>} />
          <Route path="/balances/:currency" element={<Protected><BalanceDetail /></Protected>} />
          <Route path="/cards" element={<Protected><Cards /></Protected>} />
          <Route path="/cards/detail" element={<Protected><CardDetail /></Protected>} />
          <Route path="/your-account" element={<Protected><YourAccount /></Protected>} />
          <Route path="/your-account/inbox" element={<Protected><Inbox /></Protected>} />
          <Route path="/your-account/pricing" element={<Protected><Pricing /></Protected>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/transactions" element={<Protected><Transactions /></Protected>} />
          <Route path="/recipients" element={<Protected><Recipients /></Protected>} />
          <Route path="/insights" element={<Protected><Insights /></Protected>} />
          <Route path="/payments/account-details" element={<Protected><AccountDetails /></Protected>} />
          <Route path="/flows/account/open" element={<Protected><DoMore /></Protected>} />
          <Route path="/flows/balances/add" element={<Protected><AddMoney /></Protected>} />
          <Route path="/external-callback/na-iav" element={<PlaidConnect />} />
          <Route path="/contact-form" element={<ContactForm />} />
          <Route path="/payments/scheduled" element={<Protected><Scheduled /></Protected>} />
          <Route path="/payments/direct-debits" element={<Protected><DirectDebits /></Protected>} />
          <Route path="/payments/recurring" element={<Protected><Recurring /></Protected>} />
          <Route path="/payments/requests" element={<Protected><PaymentRequests /></Protected>} />
          <Route path="/payments/bill-splits" element={<Protected><BillSplits /></Protected>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!bare && <Footer />}
      {!bare && <FloatingQR />}
    </div>
    </ViewAsProvider>
  )
}
