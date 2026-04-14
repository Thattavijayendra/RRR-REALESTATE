import { cn } from '@/utils/cn'
import { useFilterStore } from '@/store/useFilterStore'

const propertyTypes = ['Any', 'House', 'Apartment', 'Penthouse', 'Villa', 'Land'] as const
const statuses = ['Any', 'For Sale', 'For Rent', 'Sold', 'Pending'] as const

interface FilterPanelProps {
  onApplyFilters?: () => void
}

export default function FilterPanel({ onApplyFilters }: FilterPanelProps) {
  const {
    type,
    status,
    priceMin,
    priceMax,
    setType,
    setStatus,
    setPriceMin,
    setPriceMax,
    resetFilters,
    hasActiveFilters,
  } = useFilterStore()

  const handleChange = () => {
    onApplyFilters?.()
  }

  return (
    <div className="luxury-card p-4 lg:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Filters</h3>
        {hasActiveFilters() && (
          <button
            onClick={resetFilters}
            className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            Reset All
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Property Type */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Property Type
          </label>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t as any)
                  handleChange()
                }}
                className={cn(
                  'rounded-md px-3 py-2 text-xs font-medium transition-colors duration-200',
                  type === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s as any)
                  handleChange()
                }}
                className={cn(
                  'rounded-md px-3 py-2 text-xs font-medium transition-colors duration-200',
                  status === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Min Price (₹)
          </label>
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            onBlur={handleChange}
            placeholder="0"
            className="luxury-input"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Max Price (₹)
          </label>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            onBlur={handleChange}
            placeholder="10000000"
            className="luxury-input"
          />
        </div>
      </div>
    </div>
  )
}
