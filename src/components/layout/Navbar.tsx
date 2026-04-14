import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/properties', label: 'Properties' },
  { path: '/#services', label: 'Services' },
  // { path: '/#services', label: 'Services' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const handleNavClick = (e: any, path: string) => {
    // Intercept hash links so they navigate to the correct route and scroll to the section
    if (path.includes('#')) {
      e.preventDefault()
      const [pathname, hash] = path.split('#')
      if (location.pathname !== pathname) {
        navigate(pathname)
        // small delay to allow the target route to mount, then scroll
        setTimeout(() => {
          const el = document.getElementById(hash)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 120)
      } else {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const isActive = (path: string) => {
    if (path.includes('#')) {
      const [pathname, hash] = path.split('#')
      return location.pathname === pathname && location.hash === `#${hash}`
    }
    return location.pathname === path
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
          isScrolled
            ? 'border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur'
            : 'border-b border-transparent bg-white/90 backdrop-blur'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                RRR REAL <span className="text-blue-600">ESTATE</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={cn(
                    'relative text-sm font-medium text-slate-600 transition-colors duration-200',
                    isActive(link.path) ? 'text-blue-600' : 'hover:text-slate-900'
                  )}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-blue-600"
                      transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Contact Button */}
            <div className="hidden md:block">
              <a href="#contact" className="luxury-button-primary">CONTACT US</a>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="p-2 text-slate-700 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={cn(
                    'block h-px bg-current transition-all duration-300',
                    isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  )}
                />
                <span
                  className={cn(
                    'block h-px transition-all duration-300',
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  )}
                  style={{ height: '1px' }}
                />
                <span
                  className={cn(
                    'block h-px bg-current transition-all duration-300',
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  )}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 right-0 top-16 z-40 overflow-hidden border-b border-slate-200 bg-white shadow-lg md:hidden"
          >
            <div className="space-y-4 px-4 py-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={link.path}
                    onClick={(e) => handleNavClick(e, link.path)}
                    className={cn(
                      'block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                      isActive(link.path)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    {link.label}
                  </a>
                </motion.div>
              ))}
                <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="border-t border-slate-200 pt-4"
              >
                <a href="#contact" className="luxury-button-primary flex w-full justify-center">CONTACT US</a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
