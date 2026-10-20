import type { H3Event } from 'h3'

interface AdminSession {
  userId?: number
  email?: string
  name?: string
}

const sessionConfig = () => {
  const password = useRuntimeConfig().sessionPassword || process.env.NUXT_SESSION_PASSWORD || ''
  if (password.length < 32) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_SESSION_PASSWORD debe tener al menos 32 caracteres' })
  }
  return {
    password,
    name: 'exi-admin',
    maxAge: 60 * 60 * 12, // 12 horas
    cookie: { httpOnly: true, sameSite: 'lax' as const, secure: !import.meta.dev, path: '/' }
  }
}

/** Sesión cifrada en cookie (h3) */
export const useAdminSession = (event: H3Event) => useSession<AdminSession>(event, sessionConfig())

export const getAdmin = async (event: H3Event) => {
  const session = await useAdminSession(event)
  return session.data.userId ? session.data : null
}

/** Corta la petición con 401 si no hay un administrador con sesión */
export const requireAdmin = async (event: H3Event) => {
  const admin = await getAdmin(event)
  if (!admin) throw createError({ statusCode: 401, statusMessage: 'Debes iniciar sesión.' })
  return admin
}
