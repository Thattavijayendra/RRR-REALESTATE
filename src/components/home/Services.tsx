import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'

interface Service {
  id: string
  title: string
  description: string
  details: string[]
  icon: React.ReactNode
}

const services: Service[] = [
  {
    id: '1',
    title: 'Property Sales',
    description: 'Expert guidance through every step of buying or selling luxury properties.',
    details: [
      'Market analysis and pricing strategy',
      'Professional photography and staging',
      'Negotiation and contract management',
      'Closing coordination',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: '2',
    title: 'Property Rentals',
    description: 'Curated rental solutions for short-term stays and long-term residences.',
    details: [
      'Tenant screening and placement',
      'Lease agreement management',
      'Property maintenance coordination',
      'Rent collection and reporting',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: '3',
    title: 'Property Management',
    description: 'Comprehensive management services to protect and maximize your investment.',
    details: [
      '24/7 maintenance support',
      'Financial reporting and analytics',
      'Vendor management',
      'Regular property inspections',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: '4',
    title: 'Investment Consulting',
    description: 'Strategic advice to maximize returns on your real estate portfolio.',
    details: [
      'Market research and forecasting',
      'Portfolio diversification strategies',
      'ROI analysis and projections',
      'Risk assessment and mitigation',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
]

export default function Services() {
  const [expandedService, setExpandedService] = useState<string | null>(null)

  return (
    <section id="services" className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="mb-6 max-w-3xl"
        >
          <p className="section-kicker">Why choose us</p>
          <h2 className="section-heading mt-2">
            Dealer services that help you close faster
          </h2>
          <p className="section-copy mt-2 max-w-2xl">
            Short, practical support across buying, renting, management, and investment decisions.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className={cn(
                'luxury-card cursor-pointer p-4',
                expandedService === service.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'luxury-card-hover bg-white'
              )}
              onClick={() =>
                setExpandedService(expandedService === service.id ? null : service.id)
              }
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    'rounded-lg p-3 transition-all duration-200',
                    expandedService === service.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  )}
                >
                  {service.icon}
                </div>
                <motion.div
                  animate={{ rotate: expandedService === service.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
                    expandedService === service.id
                      ? 'border-blue-200 text-blue-700'
                      : 'border-slate-200 text-slate-500'
                  )}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>

              <h3
                className={cn(
                  'mt-4 text-lg font-semibold leading-tight transition-colors',
                  expandedService === service.id ? 'text-slate-900' : 'text-slate-900'
                )}
              >
                {service.title}
              </h3>
              <p
                className={cn(
                  'mt-2 text-sm leading-6 transition-colors',
                  expandedService === service.id ? 'text-slate-600' : 'text-slate-600'
                )}
              >
                {service.description}
              </p>

              <AnimatePresence>
                {expandedService === service.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <ul className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                      {service.details.map((detail, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          <span className="text-sm text-slate-600">{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
