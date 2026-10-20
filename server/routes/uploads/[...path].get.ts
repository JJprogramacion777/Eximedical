import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname } from 'node:path'

// Sirve los archivos subidos desde el panel: /uploads/productos/... y /uploads/catalogos/...
const TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf'
}

export default defineEventHandler(async (event) => {
  const full = uploadPath(getRouterParam(event, 'path') ?? '')
  const type = full && TYPES[extname(full).toLowerCase()]
  if (!full || !type) throw createError({ statusCode: 404, statusMessage: 'Archivo no encontrado' })

  const info = await stat(full).catch(() => null)
  if (!info?.isFile()) throw createError({ statusCode: 404, statusMessage: 'Archivo no encontrado' })

  setResponseHeaders(event, {
    'Content-Type': type,
    'Content-Length': String(info.size),
    // Los nombres llevan fecha, así que nunca cambian: se pueden guardar en caché
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff'
  })
  return sendStream(event, createReadStream(full))
})
