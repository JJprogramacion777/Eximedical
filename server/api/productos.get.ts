// Productos publicados (los usa el sitio público)
export default defineEventHandler(async () => {
  try {
    const { rows } = await useDb().query(
      `select id, slug, name, category, description, images, featured, sort
       from productos where active order by sort, id`
    )
    return rows
  }
  catch (e) {
    return dbError(e)
  }
})
