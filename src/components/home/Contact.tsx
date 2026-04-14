import { useState } from 'react'
import CONTACT, { phoneLink, whatsappLink, emailLink } from '@/config/contact'
import { motion } from 'framer-motion'

interface ContactMethod {
  id: string
  type: 'whatsapp' | 'phone' | 'email'
  label: string
  value: string
  href: string
  icon: React.ReactNode
}

const contactMethods: ContactMethod[] = [
  {
    id: '1',
    type: 'whatsapp',
    label: 'WhatsApp',
    value: `+91 ${CONTACT.phone}`,
    href: whatsappLink("Hello, I'm interested in this property"),
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    id: '2',
    type: 'phone',
    label: 'Phone',
    value: `+91 ${CONTACT.phone}`,
    href: phoneLink,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    id: '3',
    type: 'email',
    label: 'Email',
    value: CONTACT.email,
    href: emailLink,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Please fill in all required fields')
      return
    }
    
    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address')
      return
    }
    
    // Log for now - TODO: integrate with backend email service
    console.log('Contact form submitted:', formData)
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.')
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    })
  }

  return (
    <section id="contact" className="border-t border-slate-200 bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="mb-6 max-w-3xl"
        >
          <p className="section-kicker">Talk to a dealer</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
            Contact options that help users act quickly
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Offer direct calling, WhatsApp, and quick enquiry options without making the page feel heavy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <div className="luxury-card p-4 sm:p-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Quick actions
              </h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                Keep enquiry channels visible so users can call or message a dealer immediately.
              </p>

              <div className="mt-4 grid gap-3">
                {contactMethods.map((method) => {
                  // Render phone as plain text (non-clickable) per request
                  if (method.type === 'phone') {
                    return (
                      <div key={method.id} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                        <div className={'flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white'}>
                          {method.icon}
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{method.label}</p>
                          <p className="mt-1 text-sm font-medium text-slate-900 sm:text-base">+91 {CONTACT.phone}</p>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <a
                      key={method.id}
                      href={method.href}
                      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50"
                      target={method.type === 'whatsapp' ? '_blank' : undefined}
                      rel={method.type === 'whatsapp' ? 'noopener noreferrer' : undefined}
                    >
                      <div className={method.type === 'whatsapp'
                        ? 'flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600 text-white'
                        : 'flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700'
                      }>
                        {method.icon}
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{method.label}</p>
                        <p className="mt-1 text-sm font-medium text-slate-900 sm:text-base">{method.value}</p>
                      </div>
                    </a>
                  )
                })}
              </div>

              {/* Social Links */}
              <div className="mt-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Follow Us
                </p>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <div className="luxury-card p-4 sm:p-5">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Get details
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                    Keep the form short so buyers can enquire quickly.
                  </p>
                </div>
                <span className="rounded-md bg-blue-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                  Fast response
                </span>
              </div>

                <div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="luxury-input"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="luxury-input"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="luxury-input"
                        />
                      </div>
                    </div>
                    <div>
                      <textarea
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={5}
                        className="luxury-input resize-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="luxury-button-primary flex w-full"
                    >
                      Get Details
                    </button>
                  </form>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="luxury-button-primary flex w-full justify-center">+91 {CONTACT.phone}</div>
                        <a href={whatsappLink("Hello, I'm interested in this property")} target="_blank" rel="noopener noreferrer" className="luxury-button-secondary flex w-full">WhatsApp Dealer</a>
                      </div>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
