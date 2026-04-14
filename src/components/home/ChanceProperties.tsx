import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import CONTACT from '@/config/contact'
import { useEffect } from 'react'
import { usePropertyApi } from '@/store/usePropertyApi'

import { formatPriceShort } from '@/utils/price'

// Use real properties from API/store. When dealers set `isChanceProperty` on a property,
// the backend supports filtering by `isChanceProperty=true`. We call fetchProperties
// with that filter and render the results.

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
  },
}

export default function ChanceProperties() {
  const navigate = useNavigate()
  // select atoms separately to avoid recreating selector object and infinite update loops
  const properties = usePropertyApi((s) => s.properties)
  const fetchProperties = usePropertyApi((s) => s.fetchProperties)

  const locationLabel = (location: string | any) =>
    typeof location === 'string'
      ? location
      : location
      ? `${location.address}, ${location.city}${location.state ? `, ${location.state}` : ''}${location.zipCode ? ` ${location.zipCode}` : ''}`
      : 'Location not available'

  useEffect(() => {
    // Fetch all properties once; we'll prefer chance properties locally.
    fetchProperties().catch(() => {})
  }, [fetchProperties])

  // Decide which properties to display locally (prioritize chance -> featured -> general)
  const displayedProperties = (() => {
    if (!properties || properties.length === 0) return []

    const chance = properties.filter((p) => p.isChanceProperty)
    if (chance.length > 0) return chance.slice(0, 3)

    const featured = properties.filter((p) => p.featured)
    if (featured.length > 0) return featured.slice(0, 3)

    return properties.slice(0, 3)
  })()

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="mb-8 flex items-end justify-between gap-4"
        >
          <div>
            <p className="section-kicker">Featured Listings</p>
            <h2 className="section-heading mt-2">Popular properties</h2>
            <p className="section-copy mt-2 max-w-2xl">
              Quick picks with clear pricing, location, and contact actions.
            </p>
          </div>
          <Link to="/properties" className="hidden text-sm font-semibold text-blue-600 hover:text-blue-700 sm:inline-flex">
            View all
          </Link>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={displayedProperties && displayedProperties.length > 0 ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {displayedProperties.map((property) => (
            <motion.div
              key={property._id || property.id}
              variants={cardVariants}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <div className="luxury-card luxury-card-hover overflow-hidden">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={property.image || property.images?.[0]?.url}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-transparent to-transparent" />

                  {/* Badge */}
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                      {property.type}
                    </span>
                    {property.badge && (
                      <div
                        className={cn(
                          'rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
                          property.badge === 'Hot Deal'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-900 text-white'
                        )}
                      >
                        {property.badge}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-md bg-white px-3 py-1.5 shadow-sm">
                    <span className="text-lg font-bold text-slate-900">
                      {formatPriceShort(property.price as any)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold leading-tight text-slate-900">
                        {property.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {locationLabel(property.location)}
                      </p>
                    </div>
                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                      {property.status}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-200 pt-3 text-center">
                    <div className="text-center">
                      <span className="block text-sm font-semibold text-slate-900">
                        {property.beds}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-slate-500">
                        Beds
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="block text-sm font-semibold text-slate-900">
                        {property.baths}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-slate-500">
                        Baths
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="block text-sm font-semibold text-slate-900">
                        {property.sqft?.toLocaleString() || 'N/A'}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-slate-500">
                        SqFt
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/properties/${property._id || property.id}`)}
                      className="luxury-button-secondary w-full !rounded-lg !px-3 !py-2.5"
                    >
                      View Details
                    </button>
                    <div onClick={(e) => e.stopPropagation()} className="luxury-button-primary w-full !rounded-lg !px-3 !py-2.5">+91 {CONTACT.phone}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mt-6 text-center sm:hidden"
        >
          <Link
            to="/properties"
            className="luxury-button-primary"
          >
            View All Properties
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
