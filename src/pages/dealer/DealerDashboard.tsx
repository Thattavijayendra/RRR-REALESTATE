import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { useDealerStore } from '@/store/useDealerStore'
import DealerLogin from './DealerLogin'
import AddPropertyForm from './AddPropertyForm'
import PropertyList from './PropertyList'

function DealerLayout() {
  const location = useLocation()
  const { dealer, logout } = useDealerStore()

  const navItems = [
    { path: '/dealer', label: 'Properties', exact: true },
    { path: '/dealer/add', label: 'Add Property', exact: true },
  ]

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      {/* Sidebar */}
      <aside className="border-b border-slate-200 bg-slate-900 text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="p-5">
          <h1 className="text-lg font-semibold tracking-tight">
            RRR REAL <span className="text-blue-400">ESTATE</span>
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">Dealer Dashboard</p>
        </div>

        <nav className="grid gap-1 px-3 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive(item.path, item.exact)
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-5 lg:mt-auto">
          <div className="mb-4">
            <p className="text-sm font-medium text-white">{dealer?.name}</p>
            <p className="text-xs text-slate-400">{dealer?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full rounded-xl border border-slate-700 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Welcome back
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Dealer workspace</h2>
              <p className="mt-1 text-sm text-slate-600">
                Manage listings, update status, and publish new properties.
              </p>
            </div>
            <Link
              to="/dealer/add"
              className="luxury-button-primary"
            >
              Add Property
            </Link>
          </div>
        </div>
        {/* <Routes>
         

          <Route index element={<PropertyList />} />
          <Route path="add" element={<AddPropertyForm />} />
          <Route path="*" element={<Navigate to="/dealer" replace />} />
        </Routes> */}

        <Routes>
          <Route index element={<PropertyList />} />
          <Route path="add" element={<AddPropertyForm />} />
          <Route path="*" element={<Navigate to="/dealer" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function DealerDashboard() {
  const { isAuthenticated } = useDealerStore()

  if (!isAuthenticated) {
    return <DealerLogin />
  }

  return <DealerLayout />
}
