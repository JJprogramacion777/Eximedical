// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  // Configuración privada del servidor (se lee de .env; nunca llega al navegador)
  runtimeConfig: {
    databaseUrl: '', // NUXT_DATABASE_URL o DATABASE_URL
    sessionPassword: '', // NUXT_SESSION_PASSWORD
    uploadsDir: './storage/uploads' // NUXT_UPLOADS_DIR
  },

  // El panel de administración funciona solo en el navegador (no se indexa ni se renderiza en el servidor)
  routeRules: {
    '/admin/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/admin': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
  },

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
