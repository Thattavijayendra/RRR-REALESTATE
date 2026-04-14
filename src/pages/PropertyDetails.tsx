import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { usePropertyStore, type Property } from '@/store/usePropertyStore'
import { formatPrice } from '@/utils/price'
import { emailLink, whatsappLink } from '@/config/contact'
import CONTACT from '@/config/contact'

const API_URL = import.meta.env.VITE_API_URL

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { properties } = usePropertyStore()

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const locationLabel = (location: string | any) =>
    typeof location === 'string'
      ? location
      : location
      ? `${location.address}, ${location.city}${location.state ? `, ${location.state}` : ''}${location.zipCode ? ` ${location.zipCode}` : ''}`
      : 'Location not available'

  useEffect(() => {
    if (!id) return

    // First try to find in local store
    const localProperty = properties.find((p) => p.id === id || p._id === id)
    if (localProperty) {
      setProperty(localProperty as unknown as Property)
      setLoading(false)
      return
    }

    // Fetch from API
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${API_URL}/properties/${id}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Property not found')
        }

        setProperty(data.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id, properties])

  // price formatting is handled inline via `formatPrice(...)`

  const getYoutubeId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
    return match ? match[1] : ''
  }

  const getVimeoId = (url: string): string => {
    const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:\w+\/)?|album\/(?:\w+\/)?|video\/)?(\d+)/)
    return match ? match[1] : ''
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-8">
            <div className="h-96 rounded-xl bg-slate-200" />
            <div className="h-8 w-3/4 rounded bg-slate-200" />
            <div className="h-4 w-1/2 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 pt-16">
        <div className="text-center">
          <h2 className="mb-3 text-2xl font-semibold text-slate-900">
            Property Not Found
          </h2>
          <p className="mb-6 text-slate-600">
            {error || "The property you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate('/properties')}
            className="luxury-button-primary"
          >
            Back to Properties
          </button>
        </div>
      </div>
    )
  }

  // Handle both API and local store image formats
  const propertyImages = property.images || (property.image ? [{ url: property.image }] : [])
  const allImages = Array.isArray(propertyImages) ? propertyImages : []
  const hasVideo = !!property.video?.url
  const mainMedia = allImages[selectedImageIndex]?.url || allImages[0]?.url

  return (
    <div className="min-h-screen bg-slate-100 pt-16">
      {/* Media Gallery */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {/* Main Image */}
            <div className="lg:col-span-2 aspect-video overflow-hidden rounded-xl bg-slate-200">
              {mainMedia ? (
                <img
                  src={mainMedia}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-500">
                  No Image Available
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 gap-2">
              {allImages.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={cn(
                    'aspect-video overflow-hidden rounded-lg border-2 transition-colors',
                    selectedImageIndex === idx ? 'border-blue-600' : 'border-transparent'
                  )}
                >
                  <img
                    src={img.url}
                    alt={img.caption || property.title}
                    className="h-full w-full object-cover transition-transform hover:scale-[1.02]"
                  />
                </button>
              ))}
              {allImages.length > 4 && (
                <div className="flex aspect-video items-center justify-center rounded-lg bg-slate-900 text-lg font-medium text-white">
                  +{allImages.length - 4}
                </div>
              )}
              {allImages.length === 0 && (
                <div className="col-span-4 flex aspect-video items-center justify-center rounded-lg bg-slate-200 text-slate-500">
                  No images available
                </div>
              )}
            </div>
          </div>

          {/* Video Section */}
          {hasVideo && property.video && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5"
            >
              <h3 className="mb-3 text-lg font-semibold text-slate-900">Property Video</h3>
              <div className="aspect-video overflow-hidden rounded-xl bg-slate-900">
                {property.video?.provider === 'youtube' ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(property.video.url)}`}
                    title="Property Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : property.video?.provider === 'vimeo' ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${getVimeoId(property.video.url)}`}
                    title="Property Video"
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    controls
                    className="w-full h-full"
                    poster={allImages[0]?.url}
                  >
                    <source src={property.video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Property Info */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title & Price */}
            <div className="luxury-card p-4 sm:p-5">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                    {property.title}
                  </h1>
                  <p className="mt-2 text-sm text-slate-600 sm:text-base">
                    {locationLabel(property.location)}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3 text-right">
                    <div className="text-2xl font-bold text-slate-900">{formatPrice(property.price)}</div>
                    <div className="mt-1 text-sm text-slate-500">{property.status}</div>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
              {property.beds !== undefined && (
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <span className="block text-xl font-semibold text-slate-900">
                    {property.beds}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-slate-500">
                    Beds
                  </span>
                </div>
              )}
              {property.baths !== undefined && (
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <span className="block text-xl font-semibold text-slate-900">
                    {property.baths}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-slate-500">
                    Baths
                  </span>
                </div>
              )}
              <div className="rounded-lg bg-slate-50 p-3 text-center">
                <span className="block text-xl font-semibold text-slate-900">
                  {property.sqft?.toLocaleString() || property.area?.toLocaleString()}
                </span>
                <span className="text-[11px] uppercase tracking-wide text-slate-500">
                  SqFt
                </span>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-center">
                <span className="block text-xl font-semibold text-slate-900">
                  {property.type}
                </span>
                <span className="text-[11px] uppercase tracking-wide text-slate-500">
                  Type
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="luxury-card p-4 sm:p-5">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                About This Property
              </h2>
              <p className="text-sm leading-7 text-slate-600 sm:text-base">
                {property.description || 'No description available.'}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="luxury-card p-4 sm:p-5">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {property.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Interested in this property?
              </h3>
              <p className="mb-4 text-sm leading-6 text-slate-600">
                Connect with the dealer for pricing, site visits, and availability.
              </p>
              <div className="grid gap-2">
                <a href={`${emailLink}?subject=${encodeURIComponent(`Inquiry about ${property.title}`)}`} className="luxury-button-secondary flex w-full">Get Details</a>
                <div className="luxury-button-primary flex w-full justify-center">+91 {CONTACT.phone}</div>
                <a href={whatsappLink(`Hello, I'm interested in ${property.title} - ${formatPrice(property.price)} - ${locationLabel(property.location)}. Property link: ${window.location.origin}/properties/${property.id}`)} target="_blank" rel="noopener noreferrer" className="luxury-button-secondary flex w-full">WhatsApp Dealer</a>
              </div>
              {property.isChanceProperty && (
                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-center text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Chance Property
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
