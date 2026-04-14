import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white pt-24">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/90 to-slate-100/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-center"
        >
          <div>
            <p className="section-kicker">Search Properties</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Find Your Property
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Browse verified listings, compare prices, and connect with dealers faster.
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
              {['Buy', 'Rent', 'New Projects', 'Commercial'].map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-1.5">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="luxury-card p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="luxury-input" placeholder="Search by city, locality, or project" />
              <select className="luxury-input">
                <option>Property Type</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Land</option>
              </select>
              <select className="luxury-input">
                <option>Budget</option>
                <option>Under ₹5 Lakh</option>
                <option>₹5 Lakh - ₹50 Lakh</option>
                <option>₹50 Lakh - ₹1 Cr</option>
                <option>₹1 Cr+</option>
              </select>
              <Link to="/properties" className="luxury-button-primary flex w-full">
                Get Details
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-md bg-slate-100 px-2.5 py-1">Verified dealers</span>
              <span className="rounded-md bg-slate-100 px-2.5 py-1">Ready to move</span>
              <span className="rounded-md bg-slate-100 px-2.5 py-1">Budget options</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
