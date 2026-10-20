// Restaura la lista de cotización guardada después de hidratar la página
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => persistQuote())
})
