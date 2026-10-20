// Productos vistos recientemente (guardados en el navegador)
const KEY = 'eximedical-vistos'

export const useRecentlyViewed = () => {
  const slugs = useState<string[]>('recently-viewed', () => [])

  const load = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? '[]')
      if (Array.isArray(saved)) slugs.value = saved.filter(s => getProducto(s))
    }
    catch { /* almacenamiento no disponible */ }
  }

  const track = (slug: string) => {
    load()
    slugs.value = [slug, ...slugs.value.filter(s => s !== slug)].slice(0, 12)
    try {
      localStorage.setItem(KEY, JSON.stringify(slugs.value))
    }
    catch { /* almacenamiento no disponible */ }
  }

  return { slugs, track }
}
