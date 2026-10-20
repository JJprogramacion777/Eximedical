<script setup lang="ts">
useSeoMeta({
  title: 'Contacto | Eximedical',
  ogTitle: 'Contacto | Eximedical',
  description:
    'Contáctanos para cotizar equipos médicos, mobiliario e insumos. Oficina en Quito, Ecuador. Teléfono 098 690 5066 · eximedical120@gmail.com.',
  ogImage: '/images/hero.jpg'
})
</script>

<template>
  <div>
    <PageHero
      crumb="Contacto"
      title="Estamos a tu"
      highlight="disposición"
      subtitle="Cuéntanos qué necesitas y nuestro equipo te responderá a la brevedad con una solución a tu medida."
      image="/images/hero.jpg"
      image-position="70% center"
    />
    <ContactInfo />
    <ContactMain />
  </div>
</template>
