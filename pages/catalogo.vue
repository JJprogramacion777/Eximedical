<script setup lang="ts">
import type { Catalogo } from '~/utils/catalogos'

useSeoMeta({
  title: 'Catálogos | Eximedical',
  ogTitle: 'Catálogos de productos | Eximedical',
  description:
    'Consulta y descarga los catálogos de Eximedical: quirófano, mobiliario médico, instrumental, oxigenoterapia, rehabilitación, modelos anatómicos, insumos, descartables y antisépticos.',
  ogImage: '/images/catalogo/equipos-medicos.jpg'
})

const featured = catalogos.find(c => c.featured)!
const rest = catalogos.filter(c => !c.featured)

const viewing = ref<Catalogo | null>(null)

// En celulares el visor de PDF integrado no suele funcionar: se abre en otra pestaña
const open = (item: Catalogo) => {
  if (window.matchMedia('(max-width: 768px)').matches) window.open(item.pdf, '_blank', 'noopener')
  else viewing.value = item
}
</script>

<template>
  <div>
    <PageHero
      crumb="Catálogo"
      title="Nuestros catálogos"
      highlight="digitales"
      subtitle="Consulta en línea o descarga en PDF todas nuestras líneas de producto, siempre actualizadas."
      image="/images/catalogo/instrumental-quirurgico.jpg"
      image-position="center 40%"
    />
    <CatalogFeatured :item="featured" @open="open" />
    <CatalogGrid :items="rest" @open="open" />
    <HomeCta />
    <CatalogViewer v-model="viewing" />
  </div>
</template>
