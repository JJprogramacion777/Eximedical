import pg from 'pg'

// Los "bigint" de PostgreSQL llegan como texto por defecto: se convierten a número
pg.types.setTypeParser(20, v => Number(v))

let pool: pg.Pool | undefined

/** Conexión compartida a PostgreSQL (DATABASE_URL en .env) */
export const useDb = () => {
  if (!pool) {
    const url = useRuntimeConfig().databaseUrl || process.env.DATABASE_URL
    if (!url) throw createError({ statusCode: 500, statusMessage: 'DATABASE_URL no está configurada' })
    pool = new pg.Pool({ connectionString: url, max: 5 })
    pool.on('error', err => console.error('[db] Error en la conexión:', err.message))
  }
  return pool
}

/** Traduce errores comunes de PostgreSQL a mensajes claros */
export const dbError = (err: unknown): never => {
  const e = err as { code?: string, message?: string }
  if (e.code === '23505') throw createError({ statusCode: 409, statusMessage: 'Ya existe un registro con ese identificador (slug).' })
  if (e.code === '23514') throw createError({ statusCode: 400, statusMessage: 'Algún valor no es válido (categoría o grupo).' })
  if (e.code === 'ECONNREFUSED' || e.code === '28P01' || e.code === '3D000') {
    throw createError({ statusCode: 503, statusMessage: 'No hay conexión con la base de datos.' })
  }
  console.error('[db]', e.message)
  throw createError({ statusCode: 500, statusMessage: 'Error en la base de datos.' })
}
