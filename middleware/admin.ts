// Protege las páginas del panel: sin sesión se redirige al login
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return
  const auth = useAdminAuth()
  await auth.init()

  const isLogin = to.path === '/admin/login'
  if (!auth.user.value && !isLogin) return navigateTo('/admin/login')
  if (auth.user.value && isLogin) return navigateTo('/admin')
})
