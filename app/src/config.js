// Configuración del negocio. Todo sale de app/.env (lo genera el asistente /instalar).
const env = import.meta.env

export const BRAND = {
  appName: env.VITE_APP_NAME || 'Agentes IA 3D',
  company: env.VITE_COMPANY_NAME || 'Mi empresa',
  color: env.VITE_BRAND_COLOR || '#4700E0',
  // Acento para el tema oscuro (opcional): p. ej. un dorado si el color principal es oscuro
  colorDark: env.VITE_BRAND_COLOR_DARK || env.VITE_BRAND_COLOR || '#4700E0',
  logo: env.VITE_LOGO_URL || '/logo.svg',
  logoDark: env.VITE_LOGO_DARK_URL || env.VITE_LOGO_URL || '/logo.svg',
  url: env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
}

// Dueño de la cuenta: acceso total y oficina principal en la Oficina 3D
export const SUPER_ADMIN_EMAIL = (env.VITE_SUPER_ADMIN_EMAIL || '').toLowerCase()

export const FIREBASE_CONFIG = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

function hexToRgb(color) {
  const hex = String(color || '').replace('#', '')
  const n = parseInt(hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex, 16)
  if (Number.isNaN(n)) return null
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Aplica el color de marca a toda la interfaz (variables CSS --purple*).
// En el tema oscuro usa BRAND.colorDark como acento. Llamarla de nuevo al cambiar de tema.
export function applyBrand(theme = document.documentElement.getAttribute('data-theme') || 'dark') {
  const main = hexToRgb(BRAND.color)
  const accent = hexToRgb(theme === 'dark' ? BRAND.colorDark : BRAND.color) || main
  if (!main || !accent) return
  const root = document.documentElement.style
  const [r, g, b] = accent
  root.setProperty('--purple', `rgb(${r}, ${g}, ${b})`)
  root.setProperty('--purple-hover', `rgb(${Math.min(255, r + 19)}, ${Math.min(255, g + 26)}, ${Math.min(255, b + 15)})`)
  root.setProperty('--purple-light', `rgba(${r}, ${g}, ${b}, 0.12)`)
  root.setProperty('--purple-mid', `rgba(${r}, ${g}, ${b}, 0.25)`)
  root.setProperty('--brand-rgb', `${r}, ${g}, ${b}`)
  // Texto sobre el acento: oscuro si el acento es claro (p. ej. dorado), blanco si es oscuro
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  root.setProperty('--on-brand', lum > 0.6 ? 'hsl(var(--brand-h) 8% 11%)' : '#fff')
  // Color principal en ambos temas, para superficies grandes con texto blanco (aviso de tarea activa)
  const [mr, mg, mb] = main
  root.setProperty('--brand-deep', `rgb(${mr}, ${mg}, ${mb})`)
  root.setProperty('--brand-deep-hover', `rgb(${Math.min(255, mr + 19)}, ${Math.min(255, mg + 26)}, ${Math.min(255, mb + 15)})`)
  // Matiz de la marca (0-360), del color principal: tiñe los grises de fondo y los textos
  const max = Math.max(mr, mg, mb), min = Math.min(mr, mg, mb), d = max - min
  if (d > 0) {
    let h = max === mr ? ((mg - mb) / d) % 6 : max === mg ? (mb - mr) / d + 2 : (mr - mg) / d + 4
    h = Math.round(h * 60); if (h < 0) h += 360
    root.setProperty('--brand-h', String(h))
  }
  document.title = BRAND.appName
}
