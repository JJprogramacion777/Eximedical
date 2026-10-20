export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = routeId(getRouterParam(event, 'id'))

  let deleted: { images: string[] } | undefined
  try {
    deleted = (await useDb().query('delete from productos where id = $1 returning images', [id])).rows[0]
  }
  catch (e) {
    return dbError(e)
  }
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado.' })

  await removeUploads(deleted.images)
  return { ok: true }
})
