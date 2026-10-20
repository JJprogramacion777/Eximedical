// Directiva v-reveal: anima los elementos cuando entran en pantalla.
// Uso: <div v-reveal> o <div v-reveal="{ delay: 150, from: 'left' }">
type RevealOptions = { delay?: number, from?: 'up' | 'left' | 'right' | 'zoom' }

export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  const getObserver = () => {
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer?.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      )
    }
    return observer
  }

  nuxtApp.vueApp.directive<HTMLElement, RevealOptions | undefined>('reveal', {
    // Las clases se agregan solo en el cliente para no provocar diferencias de hidratación
    getSSRProps: () => ({}),
    mounted(el, binding) {
      el.classList.add('reveal')
      el.dataset.from = binding.value?.from ?? 'up'
      el.style.setProperty('--reveal-delay', `${binding.value?.delay ?? 0}ms`)
      getObserver().observe(el)
    },
    unmounted(el) {
      observer?.unobserve(el)
    }
  })
})
