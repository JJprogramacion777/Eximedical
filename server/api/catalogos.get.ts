// Catálogos publicados (los usa el sitio público)
export default defineEventHandler(async () => {
  try {
    const { rows } = await useDb().query(
      `select id, slug, title, description, img, pdf, size, "group", featured, sort
       from catalogos where active order by sort, id`
    )
    return rows
  }
  catch (e) {
    return dbError(e)
  }
})
