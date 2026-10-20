export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = routeId(getRouterParam(event, 'id'))
  const body = await readBody<Record<string, unknown>>(event)
  const db = useDb()

  let current: Record<string, unknown> | undefined
  try {
    current = (await db.query('select * from catalogos where id = $1', [id])).rows[0]
  }
  catch (e) {
    return dbError(e)
  }
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Catálogo no encontrado.' })

  const c = parseCatalogo({ ...current, ...body })
  try {
    if (c.featured) await db.query('update catalogos set featured = false where featured and id <> $1', [id])
    const { rows } = await db.query(
      `update catalogos set title = $1, slug = $2, "group" = $3, description = $4, img = $5, pdf = $6,
       size = $7, active = $8, featured = $9, sort = $10 where id = $11 returning *`,
      [c.title, c.slug, c.group, c.description, c.img, c.pdf, c.size, c.active, c.featured, c.sort, id]
    )
    // Borra del disco los archivos reemplazados
    await removeUploads([
      current.img !== c.img ? (current.img as string) : null,
      current.pdf !== c.pdf ? (current.pdf as string) : null
    ])
    return rows[0]
  }
  catch (e) {
    return dbError(e)
  }
})
