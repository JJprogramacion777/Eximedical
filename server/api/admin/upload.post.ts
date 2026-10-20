// Sube una imagen o un PDF desde el panel. Campos: file, bucket ("productos" | "catalogos"), folder (opcional)
const MAX_IMAGE = 5 * 1024 * 1024
const MAX_PDF = 50 * 1024 * 1024

// Se revisa el contenido real del archivo, no solo su extensión
const detect = (b: Buffer) => {
  if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return 'jpg'
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))) return 'png'
  if (b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') return 'webp'
  if (b.subarray(0, 5).toString() === '%PDF-') return 'pdf'
  return null
}

const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'archivo'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const parts = await readMultipartFormData(event)
  const file = parts?.find(p => p.name === 'file' && p.filename)
  const field = (name: string) => parts?.find(p => p.name === name)?.data.toString() ?? ''

  if (!file) throw createError({ statusCode: 400, statusMessage: 'No se recibió ningún archivo.' })
  const bucket = field('bucket')
  if (!['productos', 'catalogos'].includes(bucket)) throw createError({ statusCode: 400, statusMessage: 'Destino no válido.' })
  const folder = slug(field('folder'))

  const ext = detect(file.data)
  if (!ext) throw createError({ statusCode: 415, statusMessage: 'Formato no permitido. Usa JPG, PNG, WEBP o PDF.' })
  if (ext === 'pdf' ? file.data.length > MAX_PDF : file.data.length > MAX_IMAGE) {
    throw createError({ statusCode: 413, statusMessage: ext === 'pdf' ? 'El PDF supera 50 MB.' : 'La imagen supera 5 MB.' })
  }

  const base = slug((file.filename ?? '').replace(/\.[^.]+$/, ''))
  const rel = `${bucket}/${field('folder') ? `${folder}/` : ''}${Date.now()}-${base}.${ext}`
  const url = await saveUpload(rel, file.data)
  return { url, size: file.data.length }
})
