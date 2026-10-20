// Llamadas del panel a la API del servidor (/api/admin/...)
export type Bucket = 'productos' | 'catalogos'

const MAX_IMAGE = 5 * 1024 * 1024
const MAX_PDF = 50 * 1024 * 1024

export const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

export const useAdminApi = () => {
  // Si la sesión venció, vuelve al login
  const call = async <T>(url: string, opts: Parameters<typeof $fetch>[1] = {}) => {
    try {
      return await $fetch<T>(url, opts as never)
    }
    catch (e) {
      if ((e as { statusCode?: number }).statusCode === 401) {
        useAdminAuth().user.value = null
        await navigateTo('/admin/login')
      }
      throw new Error(apiError(e))
    }
  }

  const list = <T>(resource: 'productos' | 'catalogos') => call<T[]>(`/api/admin/${resource}`)
  const create = <T>(resource: 'productos' | 'catalogos', body: object) =>
    call<T>(`/api/admin/${resource}`, { method: 'POST', body })
  const update = <T>(resource: 'productos' | 'catalogos', id: number, body: object) =>
    call<T>(`/api/admin/${resource}/${id}`, { method: 'PUT', body })
  const remove = (resource: 'productos' | 'catalogos', id: number) =>
    call(`/api/admin/${resource}/${id}`, { method: 'DELETE' })

  const upload = async (file: File, bucket: Bucket, folder = '') => {
    const isPdf = file.type === 'application/pdf'
    if (!isPdf && !file.type.startsWith('image/')) throw new Error(`"${file.name}" no es una imagen ni un PDF.`)
    if (isPdf && file.size > MAX_PDF) throw new Error(`El PDF supera ${formatSize(MAX_PDF)}.`)
    if (!isPdf && file.size > MAX_IMAGE) throw new Error(`La imagen "${file.name}" supera ${formatSize(MAX_IMAGE)}.`)
    const form = new FormData()
    form.append('file', file)
    form.append('bucket', bucket)
    if (folder) form.append('folder', folder)
    return call<{ url: string, size: number }>('/api/admin/upload', { method: 'POST', body: form })
  }

  return { list, create, update, remove, upload }
}
