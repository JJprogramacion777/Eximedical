// Validación de los datos que llegan desde el panel
const CATEGORIAS = ['equipos-medicos', 'mobiliario', 'instrumental-quirurgico', 'descartables', 'anatomicos']
const GRUPOS = ['Equipamiento', 'Insumos', 'Especialidades']
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/

const bad = (msg: string): never => {
  throw createError({ statusCode: 400, statusMessage: msg })
}

const str = (v: unknown, max = 5000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const bool = (v: unknown, def: boolean) => (typeof v === 'boolean' ? v : def)
const int = (v: unknown) => (Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : 0)
const fileUrl = (v: unknown) => {
  const s = str(v, 500)
  return s === '' || s.startsWith('/') ? s : bad('Ruta de archivo no válida.')
}

export const parseProducto = (body: Record<string, unknown>) => {
  const name = str(body.name, 200)
  const slug = str(body.slug, 80)
  const category = str(body.category, 50)
  if (name.length < 2) bad('El nombre es obligatorio.')
  if (!SLUG.test(slug)) bad('El slug solo puede tener minúsculas, números y guiones.')
  if (!CATEGORIAS.includes(category)) bad('Categoría no válida.')
  const images = Array.isArray(body.images) ? body.images.slice(0, 12).map(fileUrl).filter(Boolean) : []
  return {
    name,
    slug,
    category,
    description: str(body.description),
    images,
    active: bool(body.active, true),
    featured: bool(body.featured, false),
    sort: int(body.sort)
  }
}

export const parseCatalogo = (body: Record<string, unknown>) => {
  const title = str(body.title, 200)
  const slug = str(body.slug, 80)
  const group = str(body.group, 30)
  if (title.length < 2) bad('El título es obligatorio.')
  if (!SLUG.test(slug)) bad('El slug solo puede tener minúsculas, números y guiones.')
  if (!GRUPOS.includes(group)) bad('Grupo no válido.')
  const pdf = fileUrl(body.pdf)
  if (!pdf) bad('El archivo PDF es obligatorio.')
  return {
    title,
    slug,
    group,
    description: str(body.description, 1000),
    img: fileUrl(body.img),
    pdf,
    size: str(body.size, 20),
    active: bool(body.active, true),
    featured: bool(body.featured, false),
    sort: int(body.sort)
  }
}

/** Id numérico de la URL (/api/admin/productos/12) */
export const routeId = (v: string | undefined) => {
  const id = Number(v)
  return Number.isInteger(id) && id > 0 ? id : bad('Id no válido.')
}
