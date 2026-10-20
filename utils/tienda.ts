// Categorías de la tienda y tipos de producto.
// Los productos se administran desde /admin (PostgreSQL). data/productos.json queda como respaldo y carga inicial.
import productosJson from '~/data/productos.json'

export interface Producto {
  id?: number
  slug: string
  name: string
  category: string
  images: string[]
  description?: string
  active?: boolean
  featured?: boolean
  sort?: number
}

export interface Categoria {
  slug: string
  name: string
  description: string
  icon: string
  cover: string
}

export const categorias: Categoria[] = [
  {
    slug: 'equipos-medicos',
    name: 'Equipos médicos',
    description: 'Monitoreo, diagnóstico, esterilización y terapia respiratoria.',
    icon: '/images/cat/equipos-medicos.png',
    cover: '/images/catalogo/equipos-medicos.jpg'
  },
  {
    slug: 'mobiliario',
    name: 'Mobiliario',
    description: 'Camillas, mesas, coches de paro y mobiliario hospitalario.',
    icon: '/images/cat/mobiliarios.png',
    cover: '/images/catalogo/mobiliario-medicos.jpg'
  },
  {
    slug: 'instrumental-quirurgico',
    name: 'Instrumental quirúrgico',
    description: 'Pinzas, tijeras, separadores e instrumental de precisión.',
    icon: '/images/cat/instrumental.png',
    cover: '/images/catalogo/instrumental-quirurgico.jpg'
  },
  {
    slug: 'descartables',
    name: 'Descartables',
    description: 'Batas, gorros, zapatones y ropa descartable.',
    icon: '/images/cat/descartables.png',
    cover: '/images/catalogo/descartables.jpg'
  },
  {
    slug: 'anatomicos',
    name: 'Anatómicos',
    description: 'Modelos y simuladores para docencia y práctica clínica.',
    icon: '/images/cat/anatomicos.png',
    cover: '/images/catalogo/modelos-anatomicos.jpg'
  }
]

/** Datos locales de respaldo (se usan si la base de datos no responde) */
export const productosLocales: Producto[] = productosJson

export const getCategoria = (slug?: string) => categorias.find(c => c.slug === slug)

/** Búsqueda sin distinguir tildes ni mayúsculas */
export const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** "Camilla Hidráulica 2" → "camilla-hidraulica-2" */
export const slugify = (s: string) =>
  normalizar(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)

export const imagenDe =(p: Producto) => p.images[0] ?? '/images/icono.png'
