<script setup lang="ts">
import type { Producto } from '~/utils/tienda'

const props = defineProps<{ product: Producto, list?: boolean }>()
const emit = defineEmits<{ quickview: [product: Producto] }>()

const quote = useQuote()
const fly = useFlyToCart()
const img = ref<HTMLImageElement>()
const added = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const category = computed(() => getCategoria(props.product.category))
const inQuote = computed(() => quote.has(props.product.slug))

const addToQuote = () => {
  quote.add(props.product.slug)
  fly(img.value)
  added.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (added.value = false), 1600)
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <article class="card" :class="{ list }">
    <div class="media">
      <NuxtLink :to="`/producto/${product.slug}`" class="img-link" :aria-label="product.name">
        <img ref="img" :src="imagenDe(product)" :alt="product.name" width="768" height="922" loading="lazy">
      </NuxtLink>
      <span v-if="inQuote" class="in-quote"><AppIcon name="check" :size="13" /> En tu lista</span>
      <div class="hover-actions">
        <button class="circle" aria-label="Vista rápida" @click="emit('quickview', product)">
          <AppIcon name="eye" :size="18" />
        </button>
        <NuxtLink :to="`/producto/${product.slug}`" class="circle" aria-label="Ver detalle">
          <AppIcon name="arrow-right" :size="18" />
        </NuxtLink>
      </div>
    </div>

    <div class="body">
      <NuxtLink v-if="category" :to="`/tienda/${category.slug}`" class="cat">{{ category.name }}</NuxtLink>
      <h3><NuxtLink :to="`/producto/${product.slug}`">{{ product.name }}</NuxtLink></h3>
      <p class="price">Precio a consultar</p>
      <button class="add" :class="{ added }" @click="addToQuote">
        <Transition name="label" mode="out-in">
          <span v-if="added" key="ok"><AppIcon name="check" :size="17" /> ¡Agregado!</span>
          <span v-else key="add"><AppIcon name="bag" :size="17" /> <span>Agregar<span class="long"> a cotización</span></span></span>
        </Transition>
      </button>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--line);
  overflow: hidden;
  transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease), border-color 0.3s;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow);
  border-color: transparent;
}

.media {
  position: relative;
  aspect-ratio: 1;
  background: #fff;
  overflow: hidden;
}

.img-link {
  display: block;
  height: 100%;
}

.media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 14px;
  transition: transform 0.8s var(--ease);
}

.card:hover .media img {
  transform: scale(1.08);
}

.in-quote {
  position: absolute;
  top: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--teal-500);
  color: var(--indigo-950);
  font-size: 0.75rem;
  font-weight: 700;
}

.hover-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  gap: 8px;
}

.circle {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 0;
  background: #fff;
  color: var(--indigo-900);
  box-shadow: var(--shadow-sm), 0 0 0 1px var(--line);
  opacity: 0;
  transform: translateX(16px);
  transition: opacity 0.3s, transform 0.4s var(--ease), background 0.2s, color 0.2s;
}

.circle:nth-child(2) {
  transition-delay: 0.05s;
}

.card:hover .circle,
.circle:focus-visible {
  opacity: 1;
  transform: none;
}

.circle:hover {
  background: var(--indigo-700);
  color: #fff;
}

.body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px 18px 18px;
  border-top: 1px solid var(--line);
}

.cat {
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold-600);
}

.cat:hover {
  color: var(--indigo-700);
}

h3 {
  margin-top: 6px;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--indigo-900);
  flex: 1;
}

h3 a:hover {
  color: var(--indigo-500);
}

.price {
  margin-top: 8px;
  font-size: 0.88rem;
  color: var(--muted);
}

.add {
  margin-top: 14px;
  height: 44px;
  border-radius: 12px;
  border: 1.5px solid var(--indigo-700);
  background: transparent;
  color: var(--indigo-700);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.93rem;
  transition: background 0.3s, color 0.3s, border-color 0.3s, transform 0.2s;
}

.add span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.add:hover {
  background: var(--indigo-700);
  color: #fff;
}

.add:active {
  transform: scale(0.97);
}

.add.added {
  background: var(--teal-500);
  border-color: var(--teal-500);
  color: var(--indigo-950);
}

.label-enter-active,
.label-leave-active {
  transition: opacity 0.2s, transform 0.25s var(--ease);
}

.label-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.label-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Vista en lista */
.card.list {
  flex-direction: row;
}

.card.list .media {
  width: 180px;
  flex-shrink: 0;
}

.card.list .body {
  border-top: 0;
  border-left: 1px solid var(--line);
  justify-content: center;
}

.card.list h3 {
  flex: 0;
  font-size: 1.2rem;
}

.card.list .add {
  align-self: flex-start;
  padding: 0 22px;
}

/* En pantallas táctiles solo se muestra el botón de vista rápida */
@media (hover: none) {
  .circle {
    opacity: 1;
    transform: none;
    width: 34px;
    height: 34px;
  }

  .circle:nth-child(2) {
    display: none;
  }
}

@media (max-width: 560px) {
  .card.list .media {
    width: 120px;
  }

  .card:not(.list) .long {
    display: none;
  }

  .body {
    padding: 12px;
  }

  h3 {
    font-size: 0.95rem;
  }
}
</style>
