// Datos del administrador con sesión (null si no hay sesión)
export default defineEventHandler(async (event) => {
  const admin = await getAdmin(event)
  return admin ? { email: admin.email, name: admin.name } : null
})
