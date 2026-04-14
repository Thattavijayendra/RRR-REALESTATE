import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDealerStore } from '@/store/useDealerStore'
import { cn } from '@/utils/cn'

export default function DealerLogin() {
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
  })

  const { login, register, isLoading, error, clearError } = useDealerStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      if (isRegister) {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          company: { name: formData.companyName },
        })
      } else {
        await login(formData.email, formData.password)
      }
      navigate('/dealer')
    } catch (err) {
      // Error already in store
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    clearError()
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Dealer Panel
          </p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-slate-900">
            Manage listings with a faster, cleaner dealer workspace.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Sign in to publish properties, update status, and manage your inventory from one dashboard.
          </p>
          <div className="mt-6 grid max-w-xl grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Property management</p>
              <p className="mt-1 text-sm text-slate-600">Add, update, and organize active listings.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Status control</p>
              <p className="mt-1 text-sm text-slate-600">Track sale, rent, sold, and pending inventory.</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md lg:ml-auto">
          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-2xl font-semibold text-slate-900">
              RRR REAL <span className="text-blue-600">ESTATE</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600">Dealer dashboard access</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setIsRegister(false)}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
                  !isRegister
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                Login
              </button>
              <button
                onClick={() => setIsRegister(true)}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
                  isRegister
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="luxury-input"
                      required={isRegister}
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="luxury-input"
                      required={isRegister}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Company Name (Optional)"
                      className="luxury-input"
                    />
                  </div>
                </>
              )}

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="luxury-input"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="luxury-input"
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="luxury-button-primary flex w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
