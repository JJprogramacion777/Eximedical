export interface AdminUser {
  email: string
  name: string
}

/** Mensaje legible de un error de $fetch */
export const apiError = (e: unknown, fallback = 'Ocurrió un error. Intenta nuevamente.') => {
  const err = e as { data?: { statusMessage?: string, message?: string }, statusMessage?: string }
  return err?.data?.statusMessage || err?.data?.message || err?.statusMessage || fallback
}

/** Sesión del administrador (cookie segura gestionada por el servidor) */
export const useAdminAuth = () => {
  const user = useState<AdminUser | null>('admin-user', () => null)
  const ready = useState('admin-auth-ready', () => false)

  const init = async () => {
    if (ready.value) return
    try {
      user.value = await $fetch<AdminUser | null>('/api/admin/me')
    }
    catch {
      user.value = null
    }
    ready.value = true
  }

  const login = async (email: string, password: string) => {
    try {
      user.value = await $fetch<AdminUser>('/api/admin/login', { method: 'POST', body: { email, password } })
    }
    catch (e) {
      throw new Error(apiError(e, 'No se pudo iniciar sesión.'))
    }
  }

  const logout = async () => {
    await $fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
    user.value = null
    await navigateTo('/admin/login')
  }

  return { user, ready, init, login, logout }
}
