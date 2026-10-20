import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve, sep } from 'node:path'

/** Carpeta donde se guardan los archivos subidos desde el panel */
export const uploadsRoot = () => resolve(process.env.UPLOADS_DIR || useRuntimeConfig().uploadsDir || './storage/uploads')

/** Convierte una ruta pública /uploads/... en ruta de disco, sin permitir salir de la carpeta */
export const uploadPath = (publicPath: string) => {
  const rel = decodeURIComponent(publicPath.replace(/^\/?uploads\//, ''))
  const root = uploadsRoot()
  const full = resolve(join(root, rel))
  if (!full.startsWith(root + sep)) return null
  return full
}

export const saveUpload = async (rel: string, data: Buffer) => {
  const full = uploadPath(rel)
  if (!full) throw createError({ statusCode: 400, statusMessage: 'Ruta de archivo no válida' })
  await mkdir(dirname(full), { recursive: true })
  await writeFile(full, data)
  return `/uploads/${rel}`
}

/** Borra archivos subidos (ignora rutas que no son de /uploads, como las imágenes originales del sitio) */
export const removeUploads = async (urls: (string | undefined | null)[]) => {
  await Promise.all(urls.map(async (url) => {
    if (!url?.startsWith('/uploads/')) return
    const full = uploadPath(url)
    if (full) await rm(full, { force: true })
  }))
}
