// Datos de la empresa usados en todo el sitio. Edita aquí y se actualiza en todas las secciones.
export default defineAppConfig({
  site: {
    name: 'Eximedical',
    tagline: 'Importaciones y Distribuciones Médicas',
    phone: '098 690 5066',
    phoneHref: 'tel:+593986905066',
    phoneAlt: '098 414 2216',
    whatsapp: 'https://wa.me/593986905066',
    email: 'eximedical120@gmail.com',
    address: 'Alonso de Angulo Oe 2-763 y Galo Molina, Quito 170601 – Ecuador',
    mapsUrl: 'https://maps.google.com/?q=Alonso+de+Angulo+Oe2-763+y+Galo+Molina+Quito',
    // TODO: reemplazar '#' por los enlaces reales de cada red social
    socials: [
      { name: 'Facebook', icon: 'facebook', url: '#' },
      { name: 'Instagram', icon: 'instagram', url: '#' },
      { name: 'YouTube', icon: 'youtube', url: '#' },
      { name: 'TikTok', icon: 'tiktok', url: 'https://www.tiktok.com/@eximedical2' }
    ]
  },
  nav: [
    { label: 'Inicio', to: '/' },
    {
      label: 'Tienda',
      to: '/tienda',
      children: [
        { label: 'Equipos médicos', to: '/tienda/equipos-medicos' },
        { label: 'Mobiliario', to: '/tienda/mobiliario' },
        { label: 'Instrumental quirúrgico', to: '/tienda/instrumental-quirurgico' },
        { label: 'Descartables', to: '/tienda/descartables' },
        { label: 'Anatómicos', to: '/tienda/anatomicos' }
      ]
    },
    { label: 'Nosotros', to: '/nosotros' },
    { label: 'Catálogo', to: '/catalogo' },
    { label: 'Contacto', to: '/contacto' }
  ]
})
