import CONTACT, { phoneLink, emailLink } from '@/config/contact'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white/90 text-sm text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <span className="font-semibold text-slate-900">RRR REAL</span>
            <span className="text-blue-600"> ESTATE</span>
            <div className="mt-1">Find your perfect place, faster.</div>
          </div>

          <div className="flex flex-col items-center gap-2 sm:items-end">
            <div>Call us: <a href={phoneLink} className="text-blue-600">+91 {CONTACT.phone}</a></div>
            <div>Email: <a href={emailLink} className="text-blue-600">{CONTACT.email}</a></div>
            <div className="text-xs text-slate-500">© {new Date().getFullYear()} RRR REAL ESTATE. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
