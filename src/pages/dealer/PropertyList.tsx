import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePropertyApi } from '@/store/usePropertyApi'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/price'

const statusColors: Record<string, string> = {
  'For Sale': 'bg-emerald-50 text-emerald-700',
  'For Rent': 'bg-blue-50 text-blue-700',
  Sold: 'bg-slate-200 text-slate-700',
  Pending: 'bg-amber-50 text-amber-700',
}

export default function PropertyList() {
  const { properties, fetchProperties, deleteProperty, toggleStatus, isLoading } = usePropertyApi()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) return

    setDeletingId(id)
    try {
      await deleteProperty(id)
    } catch (err) {
      alert('Failed to delete property')
    }
    setDeletingId(null)
  }

  const handleToggleStatus = async (id: string) => {
    setTogglingId(id)
    try {
      await toggleStatus(id)
    } catch (err) {
      alert('Failed to update status')
    }
    setTogglingId(null)
  }

  const filteredProperties =
    filterStatus === 'all'
      ? properties
      : properties.filter((p) => p.status === filterStatus)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">My Properties</h2>
          <p className="mt-1 text-sm text-slate-600">
            Review inventory, update availability, and keep listings current.
          </p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="luxury-input max-w-[180px]"
        >
          <option value="all">All Status</option>
          <option value="For Sale">For Sale</option>
          <option value="For Rent">For Rent</option>
          <option value="Sold">Sold</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {isLoading && !deletingId ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          Loading properties...
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-14 text-center shadow-sm">
          <p className="mb-4 text-slate-600">No properties yet</p>
          <Link
            to="/dealer/add"
            className="luxury-button-primary"
          >
            Add Your First Property
          </Link>
        </div>
      ) : filteredProperties.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-600 shadow-sm">
          No properties with this status
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px]">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Chance</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr
                    key={property._id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {property.images?.[0]?.url ? (
                          <img
                            src={property.images[0].url}
                            alt=""
                            className="h-14 w-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-14 w-20 rounded-lg bg-slate-100" />
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{property.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{property.location?.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{property.type}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                      {formatPrice(property.price)}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleStatus(property._id)}
                        disabled={togglingId === property._id}
                        className={cn(
                          'rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-opacity disabled:opacity-50',
                          statusColors[property.status] || 'bg-slate-200 text-slate-700'
                        )}
                        title="Click to cycle status"
                      >
                        {togglingId === property._id ? '...' : property.status}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      {property.isChanceProperty ? (
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          Yes
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(property._id)}
                          disabled={togglingId === property._id}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50"
                          title="Cycle status"
                        >
                          {togglingId === property._id ? '...' : 'Update'}
                        </button>
                        <button
                          onClick={() => handleDelete(property._id)}
                          disabled={deletingId === property._id}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === property._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Showing {filteredProperties.length} of {properties.length} properties
          </div>
        </div>
      )}
    </div>
  )
}
