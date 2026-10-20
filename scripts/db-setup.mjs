// Prepara la base de datos: la crea si no existe, aplica db/schema.sql y carga
// los productos y catálogos de data/*.json (solo si las tablas están vacías).
// Uso:  npm run db:setup
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import pg from 'pg'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('Falta DATABASE_URL en el archivo .env')
  process.exit(1)
}

// 1. Crear la base si no existe (conectándose a la base de mantenimiento "postgres")
const target = new URL(url)
const dbName = decodeURIComponent(target.pathname.slice(1))
const admin = new URL(url)
admin.pathname = '/postgres'
const maint = new pg.Client({ connectionString: admin.toString() })
await maint.connect()
const exists = await maint.query('select 1 from pg_database where datname = $1', [dbName])
if (!exists.rowCount) {
  await maint.query(`create database "${dbName.replace(/"/g, '""')}"`)
  console.log(`✓ Base de datos "${dbName}" creada`)
}
await maint.end()

// 2. Aplicar el esquema
const db = new pg.Client({ connectionString: url })
await db.connect()
await db.query(await readFile(join(process.cwd(), 'db/schema.sql'), 'utf8'))
console.log('✓ Tablas listas')

// 3. Cargar los datos iniciales si las tablas están vacías
const read = async f => JSON.parse(await readFile(join(process.cwd(), f), 'utf8'))

const { rows: [p] } = await db.query('select count(*)::int as n from productos')
if (!p.n) {
  const productos = await read('data/productos.json')
  for (const [i, x] of productos.entries()) {
    await db.query(
      'insert into productos (slug, name, category, images, sort) values ($1, $2, $3, $4, $5) on conflict (slug) do nothing',
      [x.slug, x.name, x.category, x.images, i]
    )
  }
  console.log(`✓ ${productos.length} productos cargados`)
}
else console.log(`• Ya hay ${p.n} productos, no se cargan de nuevo`)

const { rows: [c] } = await db.query('select count(*)::int as n from catalogos')
if (!c.n) {
  const catalogos = await read('data/catalogos.json')
  for (const [i, x] of catalogos.entries()) {
    await db.query(
      `insert into catalogos (slug, title, description, img, pdf, size, "group", featured, sort)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9) on conflict (slug) do nothing`,
      [x.slug, x.title, x.description, x.img, x.pdf, x.size, x.group, !!x.featured, i]
    )
  }
  console.log(`✓ ${catalogos.length} catálogos cargados`)
}
else console.log(`• Ya hay ${c.n} catálogos, no se cargan de nuevo`)

const { rows: [a] } = await db.query('select count(*)::int as n from admin_users')
if (!a.n) console.log('\n! Aún no hay administradores. Crea uno con:\n  npm run admin:create -- tu@correo.com TuContraseñaSegura')

await db.end()
console.log('\n¡Base de datos lista!')
