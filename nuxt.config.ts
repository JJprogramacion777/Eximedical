// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Eximedical | Importación y distribución de equipos médicos en Ecuador',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Eximedical importa y distribuye equipos médicos, mobiliario hospitalario, instrumental quirúrgico, descartables y modelos anatómicos. Servicio técnico y asesoría en Quito, Ecuador.'
        },
        { name: 'theme-color', content: '#1b1452' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/icono.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap'
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
