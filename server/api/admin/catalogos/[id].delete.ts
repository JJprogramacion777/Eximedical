export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = routeId(getRouterParam(event, 'id'))

  let deleted: { img: string, pdf: string } | undefined
  try {
    deleted = (await useDb().query('delete from catalogos where id = $1 returning img, pdf', [id])).rows[0]
  }
  catch (e) {
    return dbError(e)
  }
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Catálogo no encontrado.' })

  await removeUploads([deleted.img, deleted.pdf])
  return { ok: true }
})
