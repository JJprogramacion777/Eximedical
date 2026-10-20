import { verifyPassword } from '../../utils/password.mjs'

// Límite simple de intentos por IP para frenar ataques de fuerza bruta
const attempts = new Map<string, { count: number, until: number }>()
const MAX_ATTEMPTS = 5
const LOCK_MS = 10 * 60 * 1000

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'local'
  const record = attempts.get(ip)
  if (record && record.count >= MAX_ATTEMPTS && record.until > Date.now()) {
    throw createError({ statusCode: 429, statusMessage: 'Demasiados intentos. Espera 10 minutos e intenta de nuevo.' })
  }

  const body = await readBody<{ email?: string, password?: string }>(event)
  const email = String(body?.email ?? '').trim().toLowerCase()
  const password = String(body?.password ?? '')
  if (!email || !password) throw createError({ statusCode: 400, statusMessage: 'Ingresa tu correo y contraseña.' })

  let user: { id: number, email: string, name: string, password_hash: string } | undefined
  try {
    const { rows } = await useDb().query('select id, email, name, password_hash from admin_users where email = $1', [email])
    user = rows[0]
  }
  catch (e) {
    return dbError(e)
  }

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    const count = (record && record.until > Date.now() ? record.count : 0) + 1
    attempts.set(ip, { count, until: Date.now() + LOCK_MS })
    throw createError({ statusCode: 401, statusMessage: 'Correo o contraseña incorrectos.' })
  }

  attempts.delete(ip)
  const session = await useAdminSession(event)
  await session.update({ userId: user.id, email: user.email, name: user.name })
  await useDb().query('update admin_users set last_login_at = now() where id = $1', [user.id])
  return { email: user.email, name: user.name }
})
