// Productos importados de la tienda WooCommerce anterior (data/productos.json).
// Para agregar un producto: suma una entrada al JSON y su imagen en /public/images/productos.
import productosJson from '~/data/productos.json'

export interface Producto {
  id: number
  slug: string
  name: string
  category: string
  images: string[]
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

export const productos: Producto[] = productosJson

export const getCategoria = (slug?: string) => categorias.find(c => c.slug === slug)
export const getProducto = (slug?: string) => productos.find(p => p.slug === slug)
export const productosDe = (slug: string) => productos.filter(p => p.category === slug)

/** Búsqueda sin distinguir tildes ni mayúsculas */
export const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export const imagenDe = (p: Producto) => p.images[0] ?? '/images/icono.png'
