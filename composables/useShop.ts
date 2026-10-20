import type { Producto } from '~/utils/tienda'
import type { Catalogo } from '~/utils/catalogos'

/** Productos y catálogos publicados (cargados por plugins/shop-data.ts) */
export const useShop = () => {
  const productos = useState<Producto[]>('shop-productos', () => [])
  const catalogos = useState<Catalogo[]>('shop-catalogos', () => [])
  const source = useState<'db' | 'local' | null>('shop-source', () => null)

  const getProducto = (slug?: string) => productos.value.find(p => p.slug === slug)
  const productosDe = (category: string) => productos.value.filter(p => p.category === category)

  return { productos, catalogos, source, getProducto, productosDe }
}

/** Carga los datos desde la base de datos (API); si no responde, usa los datos locales */
export const loadShopData = async () => {
  const { productos, catalogos, source } = useShop()
  try {
    const [p, c] = await Promise.all([
      $fetch<Producto[]>('/api/productos'),
      $fetch<Catalogo[]>('/api/catalogos')
    ])
    productos.value = p
    catalogos.value = c
    source.value = 'db'
  }
  catch (e) {
    console.warn('[Eximedical] La base de datos no respondió; se usan los datos locales.', (e as Error).message)
    productos.value = productosLocales
    catalogos.value = catalogosLocales
    source.value = 'local'
  }
}
