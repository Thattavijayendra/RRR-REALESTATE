import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePropertyApi, type PropertyData } from '@/store/usePropertyApi'
import { formatPrice } from '@/utils/price'

const propertyTypes = ['House', 'Apartment', 'Penthouse', 'Villa', 'Land']
const statuses = ['For Sale', 'For Rent', 'Sold', 'Pending']

const fieldClassName =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-colors duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'

const sectionClassName = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'

export default function AddPropertyForm() {
  const navigate = useNavigate()
  const { createProperty, uploadImages, uploadVideo, isLoading, error, success, clearError, clearSuccess } = usePropertyApi()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<PropertyData>({
    title: '',
    description: '',
    type: 'House',
    price: 0,
    area: 0,
    status: 'For Sale',
    beds: 0,
    baths: 0,
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
    images: [],
    video: undefined,
    amenities: [] as string[],
    isChanceProperty: false,
    featured: false,
    yearBuilt: undefined,
    parkingSpaces: undefined,
    hasGarage: false,
    hasPool: false,
    hasGarden: false,
    hasElevator: false,
    isFurnished: false,
    petFriendly: false,
  })

  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoUploadedUrl, setVideoUploadedUrl] = useState<string>('')
  const [videoError, setVideoError] = useState<string | null>(null)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [amenityInput, setAmenityInput] = useState('')

  const MAX_IMAGE_COUNT = 10
  const MAX_IMAGE_SIZE_MB = 10
  const MAX_VIDEO_SIZE_MB = 50

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setImageUploadError(null)

    if (files.length === 0) return

    if (files.length + imageUrls.length > MAX_IMAGE_COUNT) {
      setImageUploadError(`You can upload up to ${MAX_IMAGE_COUNT} images total.`)
      return
    }

    const invalidFile = files.find((file) => !file.type.startsWith('image/'))
    if (invalidFile) {
      setImageUploadError('Only image files are allowed')
      return
    }

    const oversize = files.find((file) => file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024)
    if (oversize) {
      setImageUploadError(`Each image must be smaller than ${MAX_IMAGE_SIZE_MB} MB`)
      return
    }

    const previews = files.map((file) => URL.createObjectURL(file))
    setSelectedImages(files)
    setImagePreviews(previews)
  }

  const clearSelectedImages = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url))
    setSelectedImages([])
    setImagePreviews([])
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const uploadSelectedImages = async () => {
    if (selectedImages.length === 0) return

    setImageUploadError(null)
    setIsUploadingImages(true)

    try {
      const uploadedUrls = await uploadImages(selectedImages)
      setImageUrls((prev) => [...prev, ...uploadedUrls])
      clearSelectedImages()
    } catch (error) {
      setImageUploadError(error instanceof Error ? error.message : 'Failed to upload images')
    } finally {
      setIsUploadingImages(false)
    }
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setVideoError(null)
    setVideoUploadedUrl('')
    setVideoUrl('')

    if (!file) return

    if (!file.type.startsWith('video/')) {
      setVideoError('Please select a valid video file')
      return
    }

    const maxSize = MAX_VIDEO_SIZE_MB * 1024 * 1024
    if (file.size > maxSize) {
      setVideoError(`Video file must be less than ${MAX_VIDEO_SIZE_MB}MB`)
      return
    }

    setVideoFile(file)
    const previewUrl = URL.createObjectURL(file)
    setVideoPreview(previewUrl)
  }

  const uploadSelectedVideo = async () => {
    if (!videoFile) return

    setVideoError(null)
    setIsUploadingVideo(true)

    try {
      const uploadedUrl = await uploadVideo(videoFile)
      setVideoUploadedUrl(uploadedUrl)
      setVideoFile(null)
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview)
      }
      setVideoPreview(null)
      if (videoInputRef.current) {
        videoInputRef.current.value = ''
      }
    } catch (error) {
      setVideoError(error instanceof Error ? error.message : 'Failed to upload video')
    } finally {
      setIsUploadingVideo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    clearSuccess()

    if (imageUrls.length === 0) {
      setImageUploadError('Please upload at least one image')
      return
    }

    if (videoFile && !videoUploadedUrl) {
      setVideoError('Please upload the selected video before submitting')
      return
    }

    const finalVideoUrl = videoUploadedUrl || videoUrl

    const submitData: PropertyData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      price: formData.price,
      area: formData.area,
      status: formData.status,
      beds: formData.beds,
      baths: formData.baths,
      location: {
        address: formData.location.address.trim(),
        city: formData.location.city.trim(),
        state: formData.location.state?.trim(),
        zipCode: formData.location.zipCode?.trim(),
      },
      images: imageUrls.map((url, i) => ({
        url,
        isPrimary: i === 0,
      })),
      video: finalVideoUrl && !finalVideoUrl.startsWith('blob:')
        ? {
            url: finalVideoUrl,
            provider: getVideoProvider(finalVideoUrl),
          }
        : undefined,
      amenities: formData.amenities,
      isChanceProperty: formData.isChanceProperty,
      featured: formData.featured,
      hasGarage: formData.hasGarage,
      hasPool: formData.hasPool,
      hasGarden: formData.hasGarden,
      hasElevator: formData.hasElevator,
      isFurnished: formData.isFurnished,
      petFriendly: formData.petFriendly,
    }

    try {
      await createProperty(submitData)
      // Success is handled in store - redirect after short delay
      setTimeout(() => {
        navigate('/dealer')
      }, 1000)
    } catch (err) {
      // Error handled in store
    }
  }

  const getVideoProvider = (url: string): 'youtube' | 'vimeo' | 'direct' => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('vimeo.com')) return 'vimeo'
    return 'direct'
  }

  const clearVideoFile = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }
    setVideoFile(null)
    setVideoPreview(null)
    setVideoUploadedUrl('')
    setVideoUrl('')
    setVideoError(null)
    if (videoInputRef.current) {
      videoInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData({
        ...formData,
        amenities: [...(formData.amenities || []), amenityInput.trim()],
      })
      setAmenityInput('')
    }
  }

  const removeAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: (formData.amenities || []).filter((_, i) => i !== index),
    })
  }

  const updateLocation = (field: string, value: string) => {
    setFormData({
      ...formData,
      location: { ...formData.location, [field]: value },
    })
  }

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  // Dynamic fields based on type
  const showBedsBaths = formData.type !== 'Land'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-600">
          {success}
        </div>
      )}

      {/* Basic Info */}
      <section className={sectionClassName}>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={fieldClassName}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              className={`${fieldClassName} resize-none`}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => updateField('type', e.target.value)}
                className={fieldClassName}
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => updateField('status', e.target.value)}
                className={fieldClassName}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Price (₹) *</label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => updateField('price', Number(e.target.value))}
                className={fieldClassName}
                required
                min="0"
              />
              {formData.price ? (
                <p className="mt-2 text-sm text-slate-500">Preview: {formatPrice(Number(formData.price))}</p>
              ) : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Area (sqft) *</label>
              <input
                type="number"
                value={formData.area || ''}
                onChange={(e) => updateField('area', Number(e.target.value))}
                className={fieldClassName}
                required
                min="0"
              />
            </div>
          </div>

          {showBedsBaths && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Bedrooms</label>
                <input
                  type="number"
                  value={formData.beds || ''}
                  onChange={(e) => updateField('beds', Number(e.target.value))}
                  className={fieldClassName}
                  min="0"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Bathrooms</label>
                <input
                  type="number"
                  value={formData.baths || ''}
                  onChange={(e) => updateField('baths', Number(e.target.value))}
                  className={fieldClassName}
                  min="0"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Location */}
      <section className={sectionClassName}>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Location</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Address *</label>
            <input
              type="text"
              value={formData.location.address}
              onChange={(e) => updateLocation('address', e.target.value)}
              className={fieldClassName}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">City *</label>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) => updateLocation('city', e.target.value)}
                className={fieldClassName}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">State</label>
              <input
                type="text"
                value={formData.location.state}
                onChange={(e) => updateLocation('state', e.target.value)}
                className={fieldClassName}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">ZIP Code</label>
            <input
              type="text"
              value={formData.location.zipCode}
              onChange={(e) => updateLocation('zipCode', e.target.value)}
              className={fieldClassName}
            />
          </div>
        </div>
      </section>

      {/* Images */}
      <section className={sectionClassName}>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Images (max 10, first is primary)
        </h3>
        <div className="mb-4 flex flex-col gap-3">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageFilesChange}
            className="text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={uploadSelectedImages}
              disabled={selectedImages.length === 0 || isUploadingImages}
              className="luxury-button-primary disabled:opacity-50"
            >
              {isUploadingImages ? 'Uploading...' : 'Upload Selected Images'}
            </button>
            {selectedImages.length > 0 && (
              <span className="self-center text-sm text-slate-500">
                {selectedImages.length} file(s) selected
              </span>
            )}
          </div>
          {imageUploadError && (
            <p className="text-sm text-red-500">{imageUploadError}</p>
          )}
        </div>

        {imagePreviews.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm text-slate-500">Preview before upload:</p>
            <div className="grid grid-cols-4 gap-2">
              {imagePreviews.map((url, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                  <img src={url} alt={`preview-${index}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {imageUrls.length > 0 && (
          <div>
            <p className="mb-2 text-sm text-slate-500">Uploaded images:</p>
            <div className="grid grid-cols-4 gap-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                  <img src={url} alt={`uploaded-${index}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-red-500 text-xs text-white"
                  >
                    ×
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-blue-600 py-1 text-center text-xs text-white">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Video */}
      <section className={sectionClassName}>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Video (optional)</h3>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Upload Video (MP4, max {MAX_VIDEO_SIZE_MB}MB)
          </label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/*"
                onChange={handleVideoFileChange}
                className="flex-1 text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
              />
              {videoFile && (
                <button
                  type="button"
                  onClick={uploadSelectedVideo}
                  disabled={isUploadingVideo}
                  className="luxury-button-primary disabled:opacity-50"
                >
                  {isUploadingVideo ? 'Uploading...' : 'Upload Video'}
                </button>
              )}
            </div>
            {videoFile && (
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <p>
                  Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
                <button
                  type="button"
                  onClick={clearVideoFile}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  Cancel
                </button>
              </div>
            )}
            {videoUploadedUrl && (
              <p className="text-sm text-green-600">Video uploaded successfully.</p>
            )}
            {videoError && (
              <p className="text-sm text-red-500">{videoError}</p>
            )}
          </div>
        </div>

        {videoPreview && (
          <div className="mb-4">
            <p className="mb-2 text-sm text-slate-500">Preview:</p>
            <video
              src={videoPreview}
              controls
              className="w-full max-w-md rounded-xl bg-slate-900"
            />
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-slate-500">or paste URL</span>
          </div>
        </div>

        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="YouTube, Vimeo, or direct video URL"
          disabled={!!videoFile || !!videoUploadedUrl}
          className={`${fieldClassName} disabled:bg-slate-100 disabled:text-slate-400`}
        />
      </section>

      {/* Amenities */}
      <section className={sectionClassName}>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Amenities</h3>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            placeholder="Add amenity"
            className={fieldClassName}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
          />
          <button
            type="button"
            onClick={addAmenity}
            className="luxury-button-primary"
          >
            Add
          </button>
        </div>

        {(formData.amenities || []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(formData.amenities || []).map((amenity, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
              >
                {amenity}
                <button
                  type="button"
                  onClick={() => removeAmenity(index)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className={sectionClassName}>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Features</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <input
              type="checkbox"
              checked={formData.hasGarage}
              onChange={(e) => updateField('hasGarage', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Garage</span>
          </label>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <input
              type="checkbox"
              checked={formData.hasPool}
              onChange={(e) => updateField('hasPool', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Pool</span>
          </label>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <input
              type="checkbox"
              checked={formData.hasGarden}
              onChange={(e) => updateField('hasGarden', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Garden</span>
          </label>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <input
              type="checkbox"
              checked={formData.hasElevator}
              onChange={(e) => updateField('hasElevator', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Elevator</span>
          </label>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <input
              type="checkbox"
              checked={formData.isFurnished}
              onChange={(e) => updateField('isFurnished', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Furnished</span>
          </label>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <input
              type="checkbox"
              checked={formData.petFriendly}
              onChange={(e) => updateField('petFriendly', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Pet Friendly</span>
          </label>
        </div>
      </section>

      {/* Special Options */}
      <section className={sectionClassName}>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Special Options</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <input
              type="checkbox"
              checked={formData.isChanceProperty}
              onChange={(e) => updateField('isChanceProperty', e.target.checked)}
              className="w-5 h-5"
            />
            <div>
              <span className="font-medium text-slate-900">Mark as Chance Property</span>
              <p className="text-sm text-slate-600">
                Featured on homepage in the Chance Properties section
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => updateField('featured', e.target.checked)}
              className="w-5 h-5"
            />
            <div>
              <span className="font-medium text-slate-900">Featured Property</span>
              <p className="text-sm text-slate-600">
                Highlighted in property listings
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-4 border-t border-slate-200 pt-2">
        <button
          type="button"
          onClick={() => navigate('/dealer')}
          className="luxury-button-secondary flex-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="luxury-button-primary flex-1 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Property'}
        </button>
      </div>
    </form>
  )
}
