import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import type { Property } from '@/store/usePropertyStore'
import { formatPrice, formatPriceShort } from '@/utils/price'
import { whatsappLink } from '@/config/contact'
import CONTACT from '@/config/contact'

interface PropertyCardProps {
  property: Property
  index: number
}

const statusColors: Record<string, string> = {
  'For Sale': 'bg-emerald-50 text-emerald-700',
  'For Rent': 'bg-blue-50 text-blue-700',
  'Sold': 'bg-slate-200 text-slate-700',
  'Pending': 'bg-amber-50 text-amber-700',
}

const typeColors: Record<string, string> = {
  House: 'bg-slate-100 text-slate-700',
  Apartment: 'bg-slate-100 text-slate-700',
  Penthouse: 'bg-violet-50 text-violet-700',
  Villa: 'bg-cyan-50 text-cyan-700',
  Land: 'bg-slate-100 text-slate-700',
}

export default function PropertyCard({ property, index }: PropertyCardProps) {
  const navigate = useNavigate()
  const locationLabel =
    typeof property.location === 'string'
      ? property.location
      : property.location
      ? `${property.location.address}, ${property.location.city}${property.location.state ? `, ${property.location.state}` : ''}${property.location.zipCode ? ` ${property.location.zipCode}` : ''}`
      : 'Location not available'

  const displayPrice = (price: number) => {
    return formatPriceShort(price)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="group"
    >
      <div className="luxury-card luxury-card-hover overflow-hidden flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.image || (property.images && property.images.length > 0 ? property.images.find(img => img.isPrimary)?.url || property.images[0].url : '/placeholder-property.jpg')}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span
              className={cn(
                'rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
                typeColors[property.type]
              )}
            >
              {property.type}
            </span>
            <span
              className={cn(
                'rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
                statusColors[property.status]
              )}
            >
              {property.status}
            </span>
          </div>

              <div className="absolute bottom-3 left-3 rounded-md bg-white px-3 py-1.5 shadow-sm">
            <span className="text-lg font-bold text-slate-900">
              {displayPrice(property.price)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold leading-tight text-slate-900">
                {property.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{locationLabel}</p>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {property.sqft?.toLocaleString() || 'N/A'} SqFt
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
            {property.description}
          </p>

          {/* Specs */}
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-3">
            <div className="text-center">
              <span className="block text-sm font-semibold text-slate-900">{property.beds}</span>
              <span className="text-[11px] uppercase tracking-wide text-slate-500">Beds</span>
            </div>
            <div className="text-center">
              <span className="block text-sm font-semibold text-slate-900">{property.baths}</span>
              <span className="text-[11px] uppercase tracking-wide text-slate-500">Baths</span>
            </div>
            <div className="text-center">
              <span className="block text-sm font-semibold text-slate-900">{property.sqft?.toLocaleString() || 'N/A'}</span>
              <span className="text-[11px] uppercase tracking-wide text-slate-500">SqFt</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 mt-auto">
            <button
              type="button"
              onClick={() => navigate(`/properties/${property.id}`)}
              className="luxury-button-secondary w-full !rounded-lg !px-3 !py-2.5"
            >
              View Details
            </button>
            <div className="luxury-button-primary w-full !rounded-lg !px-3 !py-2.5">+91 {CONTACT.phone}</div>
            <a href={whatsappLink(`Hello, I'm interested in ${property.title} - ${formatPrice(property.price)} - ${property.location || ''}.`)} target="_blank" rel="noopener noreferrer" className="luxury-button-secondary w-full !rounded-lg !px-3 !py-2.5">WhatsApp Dealer</a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
