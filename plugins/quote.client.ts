// Restaura la lista de cotización guardada una vez que la página terminó de hidratarse
// (antes provocaría diferencias entre el HTML del servidor y el del navegador)
export default defineNuxtPlugin((nuxtApp) => {
  let done = false
  nuxtApp.hook('app:suspense:resolve', () => {
    if (done) return
    done = true
    nuxtApp.runWithContext(() => persistQuote())
  })
})
