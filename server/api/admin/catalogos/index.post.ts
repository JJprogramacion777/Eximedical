export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const c = parseCatalogo(await readBody(event))
  const db = useDb()
  try {
    // Solo un catálogo puede ser el destacado
    if (c.featured) await db.query('update catalogos set featured = false where featured')
    const { rows } = await db.query(
      `insert into catalogos (title, slug, "group", description, img, pdf, size, active, featured, sort)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *`,
      [c.title, c.slug, c.group, c.description, c.img, c.pdf, c.size, c.active, c.featured, c.sort]
    )
    return rows[0]
  }
  catch (e) {
    return dbError(e)
  }
})
