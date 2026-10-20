// Todos los productos, incluidos los ocultos
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  try {
    const { rows } = await useDb().query('select * from productos order by sort, id')
    return rows
  }
  catch (e) {
    return dbError(e)
  }
})
