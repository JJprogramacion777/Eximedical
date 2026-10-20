// Lista de cotización (funciona como carrito: los productos no tienen precio publicado).
// Se guarda en el navegador para no perderla al recargar.
import type { Producto } from '~/utils/tienda'

export interface QuoteItem {
  slug: string
  qty: number
}

const STORAGE_KEY = 'eximedical-cotizacion'

export const useQuote = () => {
  const items = useState<QuoteItem[]>('quote-items', () => [])
  const open = useState('quote-open', () => false)
  const bump = useState('quote-bump', () => 0)
  const { getProducto } = useShop()

  const count = computed(() => items.value.reduce((n, i) => n + i.qty, 0))

  const detailed = computed(() =>
    items.value
      .map(i => ({ ...i, product: getProducto(i.slug) }))
      .filter((i): i is QuoteItem & { product: Producto } => !!i.product)
  )

  const has = (slug: string) => items.value.some(i => i.slug === slug)

  const add = (slug: string, qty = 1) => {
    const found = items.value.find(i => i.slug === slug)
    if (found) found.qty += qty
    else items.value.push({ slug, qty })
    bump.value++
  }

  const setQty = (slug: string, qty: number) => {
    const found = items.value.find(i => i.slug === slug)
    if (!found) return
    if (qty <= 0) remove(slug)
    else found.qty = Math.min(qty, 999)
  }

  const remove = (slug: string) => {
    items.value = items.value.filter(i => i.slug !== slug)
  }

  const clear = () => (items.value = [])

  /** Texto listo para enviar por WhatsApp o correo */
  const message = (extra?: { name?: string, note?: string }) => {
    const lines = ['Hola Eximedical, quisiera cotizar los siguientes productos:', '']
    detailed.value.forEach((i, n) => {
      const cat = getCategoria(i.product.category)?.name
      lines.push(`${n + 1}. ${i.product.name} — Cantidad: ${i.qty}${cat ? ` (${cat})` : ''}`)
    })
    if (extra?.name) lines.push('', `Nombre: ${extra.name}`)
    if (extra?.note) lines.push('', extra.note)
    return lines.join('\n')
  }

  return { items, open, bump, count, detailed, has, add, setQty, remove, clear, message }
}

/** Carga y guarda la lista en localStorage (solo en el navegador) */
export const persistQuote = () => {
  const { items } = useQuote()
  const { getProducto } = useShop()
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (Array.isArray(saved)) items.value = saved.filter(i => getProducto(i?.slug) && i.qty > 0)
  }
  catch { /* almacenamiento no disponible */ }
  watch(items, (v) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
    }
    catch { /* almacenamiento no disponible */ }
  }, { deep: true })
}
