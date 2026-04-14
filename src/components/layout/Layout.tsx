import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const showNavbar = !location.pathname.startsWith('/dealer')

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      {showNavbar && <Navbar />}
      <main>{children}</main>
      <Footer />
    </div>
  )
}
