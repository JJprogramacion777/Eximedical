// Crea un administrador del panel o cambia su contraseña si ya existe.
// Uso:  npm run admin:create -- correo@ejemplo.com "Contraseña segura" "Nombre opcional"
import pg from 'pg'
import { hashPassword } from '../server/utils/password.mjs'

const [email, password, name = ''] = process.argv.slice(2)
if (!email || !password) {
  console.error('Uso: npm run admin:create -- correo@ejemplo.com "Contraseña" ["Nombre"]')
  process.exit(1)
}
if (password.length < 8) {
  console.error('La contraseña debe tener al menos 8 caracteres.')
  process.exit(1)
}

const db = new pg.Client({ connectionString: process.env.DATABASE_URL })
await db.connect()
const hash = await hashPassword(password)
const { rows } = await db.query(
  `insert into admin_users (email, name, password_hash) values (lower($1), $2, $3)
   on conflict (email) do update set password_hash = excluded.password_hash, name = coalesce(nullif(excluded.name, ''), admin_users.name)
   returning (xmax = 0) as created`,
  [email.trim(), name, hash]
)
await db.end()
console.log(rows[0].created ? `✓ Administrador ${email} creado` : `✓ Contraseña de ${email} actualizada`)
