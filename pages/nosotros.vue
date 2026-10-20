<script setup lang="ts">
useSeoMeta({
  title: 'Nosotros | Eximedical',
  ogTitle: 'Nosotros | Eximedical',
  description:
    'Conoce a Eximedical: importadores y distribuidores de equipos médicos de última tecnología en Ecuador. Nuestra misión, visión y valores.',
  ogImage: '/images/equipo-eximedical.jpg'
})
</script>

<template>
  <div>
    <PageHero
      crumb="Nosotros"
      title="Conoce a"
      highlight="Eximedical"
      subtitle="Importamos y distribuimos tecnología médica de calidad, con un equipo comprometido con la salud de todo el país."
      image="/images/equipo-eximedical.jpg"
      image-position="center 35%"
    />
    <AboutIntro />
    <AboutMissionVision />
    <AboutValues />
    <HomeBrands />
    <HomeCta />
  </div>
</template>
