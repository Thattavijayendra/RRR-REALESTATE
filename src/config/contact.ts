export const CONTACT = {
  phone: '9989686626', // local format
  whatsapp: '919989686626', // with country code
  email: 'thattavijayendra@gmail.com',
}

export const phoneLink = `tel:${CONTACT.phone}`
export const emailLink = `mailto:${CONTACT.email}`

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${CONTACT.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export default CONTACT
