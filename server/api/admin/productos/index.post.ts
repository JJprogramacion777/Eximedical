export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const p = parseProducto(await readBody(event))
  try {
    const { rows } = await useDb().query(
      `insert into productos (name, slug, category, description, images, active, featured, sort)
       values ($1, $2, $3, $4, $5, $6, $7, $8) returning *`,
      [p.name, p.slug, p.category, p.description, p.images, p.active, p.featured, p.sort]
    )
    return rows[0]
  }
  catch (e) {
    return dbError(e)
  }
})
