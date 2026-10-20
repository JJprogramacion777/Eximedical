// Actualiza un producto. Acepta el producto completo o solo { active } / { featured } para cambios rápidos.
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = routeId(getRouterParam(event, 'id'))
  const body = await readBody<Record<string, unknown>>(event)
  const db = useDb()

  let current: Record<string, unknown> | undefined
  try {
    current = (await db.query('select * from productos where id = $1', [id])).rows[0]
  }
  catch (e) {
    return dbError(e)
  }
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado.' })

  const p = parseProducto({ ...current, ...body })
  try {
    const { rows } = await db.query(
      `update productos set name = $1, slug = $2, category = $3, description = $4, images = $5,
       active = $6, featured = $7, sort = $8 where id = $9 returning *`,
      [p.name, p.slug, p.category, p.description, p.images, p.active, p.featured, p.sort, id]
    )
    // Borra del disco las imágenes que se quitaron del producto
    await removeUploads((current.images as string[]).filter(img => !p.images.includes(img)))
    return rows[0]
  }
  catch (e) {
    return dbError(e)
  }
})
