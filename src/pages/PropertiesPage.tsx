import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FilterPanel from '@/components/properties/FilterPanel'
import PropertyCard from '@/components/properties/PropertyCard'
import { usePropertyApi } from '@/store/usePropertyApi'
import { useFilterStore } from '@/store/useFilterStore'

export default function PropertiesPage() {
  const { fetchProperties, properties, isLoading } = usePropertyApi()
  const { getQueryParams, hasActiveFilters } = useFilterStore()
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleApplyFilters = () => {
    const params = getQueryParams()
    fetchProperties(params)
  }

  return (
    <div className="min-h-screen bg-slate-100 pt-16">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="section-kicker">Property Listings</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Browse available properties
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="luxury-button-secondary flex w-full justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex gap-4 lg:gap-5">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-20">
              <FilterPanel onApplyFilters={handleApplyFilters} />
            </div>
          </aside>

          {/* Mobile Filters */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden w-full"
              >
                <FilterPanel onApplyFilters={() => {
                  handleApplyFilters()
                  setIsFilterOpen(false)
                }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{properties.length}</span> properties found
                {hasActiveFilters() && <span className="ml-2 text-xs text-blue-600">(filtered)</span>}
              </p>
              {hasActiveFilters() && (
                <button
                  onClick={() => {
                    useFilterStore.getState().resetFilters()
                    fetchProperties()
                  }}
                  className="text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-20">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <p className="mt-3 text-sm text-slate-600">Loading properties...</p>
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {properties.map((property, index) => (
                  <PropertyCard key={property._id || property.id} property={property} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="luxury-card py-16 text-center"
              >
                <p className="text-base text-slate-600">
                  No properties match your criteria.
                </p>
                <button
                  onClick={() => {
                    useFilterStore.getState().resetFilters()
                    fetchProperties()
                  }}
                  className="luxury-button-primary mt-4"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
