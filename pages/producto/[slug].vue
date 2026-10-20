<script setup lang="ts">
import type { Producto } from '~/utils/tienda'

const route = useRoute()
const { site } = useAppConfig()
const { getProducto, productosDe } = useShop()
const product = computed(() => getProducto(route.params.slug as string))

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado', fatal: true })
}

const p = computed(() => product.value!)
const category = computed(() => getCategoria(p.value.category)!)

useSeoMeta({
  title: () => `${p.value.name} | Eximedical`,
  description: () => `${p.value.name} – ${category.value.name}. Cotiza en línea con Eximedical, importadores de equipos médicos en Quito, Ecuador.`,
  ogImage: () => imagenDe(p.value)
})

// Datos estructurados para buscadores
useHead(() => ({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': p.value.name,
      'image': p.value.images,
      'category': category.value.name,
      'brand': { '@type': 'Organization', 'name': 'Eximedical' }
    })
  }]
}))

// ---- Galería con zoom ----
const current = ref(0)
watch(() => route.params.slug, () => (current.value = 0))
const zoom = reactive({ on: false, x: 50, y: 50 })
const onZoom = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse') return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  zoom.on = true
  zoom.x = ((e.clientX - r.left) / r.width) * 100
  zoom.y = ((e.clientY - r.top) / r.height) * 100
}

// ---- Cotización ----
const quote = useQuote()
const fly = useFlyToCart()
const qty = ref(1)
const mainImg = ref<HTMLImageElement>()
const added = ref(false)
watch(() => route.params.slug, () => {
  qty.value = 1
  added.value = false
})

const add = () => {
  quote.add(p.value.slug, qty.value)
  fly(mainImg.value)
  added.value = true
}

const whatsappDirect = computed(() =>
  `${site.whatsapp}?text=${encodeURIComponent(`Hola Eximedical, quisiera cotizar: ${p.value.name} (cantidad: ${qty.value}).`)}`
)

// ---- Compartir ----
const copied = ref(false)
const url = computed(() => (import.meta.client ? window.location.href : ''))
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
  catch { /* sin permiso para el portapapeles */ }
}
const shareWhatsApp = computed(() => `https://wa.me/?text=${encodeURIComponent(`${p.value.name} – Eximedical ${url.value}`)}`)

// ---- Pestañas ----
const tab = ref<'desc' | 'how'>('desc')

// ---- Relacionados y vistos recientemente ----
const related = computed(() => productosDe(p.value.category).filter(x => x.slug !== p.value.slug).slice(0, 10))
const recent = useRecentlyViewed()
const recentItems = computed(() => recent.slugs.value
  .filter(s => s !== p.value.slug)
  .map(s => getProducto(s))
  .filter((x): x is Producto => !!x))
onMounted(() => recent.track(p.value.slug))
watch(() => route.params.slug, s => s && recent.track(s as string))

const quick = ref<Producto | null>(null)

const perks = [
  { icon: 'headset', text: 'Asesoría para elegir el equipo ideal' },
  { icon: 'wrench', text: 'Servicio técnico especializado' },
  { icon: 'award', text: 'Marcas reconocidas internacionalmente' },
  { icon: 'clipboard', text: 'Cotización rápida y sin compromiso' }
]
</script>

<template>
  <div>
    <div class="top">
      <div class="container">
        <nav class="crumbs" aria-label="Ruta de navegación">
          <NuxtLink to="/">Inicio</NuxtLink>
          <span>/</span>
          <NuxtLink to="/tienda">Tienda</NuxtLink>
          <span>/</span>
          <NuxtLink :to="`/tienda/${category.slug}`">{{ category.name }}</NuxtLink>
          <span>/</span>
          <span aria-current="page">{{ p.name }}</span>
        </nav>
      </div>
    </div>

    <section class="section detail">
      <div class="container">
        <div class="main">
          <!-- Galería -->
          <div class="gallery">
            <div
              class="stage"
              :class="{ zooming: zoom.on }"
              @pointermove="onZoom"
              @pointerleave="zoom.on = false"
            >
              <img
                ref="mainImg"
                :key="`${p.slug}-${current}`"
                :src="p.images[current] ?? imagenDe(p)"
                :alt="p.name"
                width="768"
                height="922"
                :style="{ transformOrigin: `${zoom.x}% ${zoom.y}%` }"
              >
              <span class="zoom-hint"><AppIcon name="search" :size="14" /> Pasa el mouse para ampliar</span>
            </div>
            <div v-if="p.images.length > 1" class="thumbs">
              <button
                v-for="(src, i) in p.images"
                :key="src"
                :class="{ on: i === current }"
                :aria-label="`Imagen ${i + 1}`"
                @click="current = i"
              >
                <img :src="src" alt="" width="80" height="96">
              </button>
            </div>
          </div>

          <!-- Información -->
          <div class="info">
            <NuxtLink :to="`/tienda/${category.slug}`" class="cat">
              <img :src="category.icon" alt="" width="28" height="28"> {{ category.name }}
            </NuxtLink>
            <h1>{{ p.name }}</h1>
            <p class="stock"><span class="dot" /> Disponible para cotización</p>
            <p class="lead">
              Solicita el precio, la ficha técnica y los tiempos de entrega de este producto. Nuestro equipo te
              responde a la brevedad y te asesora para elegir la mejor opción.
            </p>

            <div class="buy">
              <div class="qty">
                <button aria-label="Restar uno" @click="qty = Math.max(1, qty - 1)">−</button>
                <input v-model.number="qty" type="number" min="1" aria-label="Cantidad" @blur="qty = Math.max(1, qty || 1)">
                <button aria-label="Sumar uno" @click="qty++">+</button>
              </div>
              <button class="btn btn-primary add" :class="{ added }" @click="add">
                <AppIcon :name="added ? 'check' : 'bag'" :size="19" />
                {{ added ? 'Agregado a tu lista' : 'Agregar a cotización' }}
              </button>
            </div>
            <button v-if="added" class="view-list" @click="quote.open.value = true">
              Ver mi lista de cotización ({{ quote.count.value }}) <AppIcon name="arrow-right" :size="16" />
            </button>

            <a :href="whatsappDirect" target="_blank" rel="noopener" class="btn wa">
              <AppIcon name="whatsapp" :size="20" /> Cotizar ahora por WhatsApp
            </a>

            <ul class="perks">
              <li v-for="k in perks" :key="k.text"><span><AppIcon :name="k.icon" :size="18" /></span> {{ k.text }}</li>
            </ul>

            <div class="share">
              <span>Compartir:</span>
              <a :href="shareWhatsApp" target="_blank" rel="noopener" aria-label="Compartir por WhatsApp"><AppIcon name="whatsapp" :size="18" /></a>
              <button aria-label="Copiar enlace" @click="copyLink"><AppIcon :name="copied ? 'check' : 'external'" :size="17" /></button>
              <Transition name="toast"><em v-if="copied">¡Enlace copiado!</em></Transition>
            </div>
          </div>
        </div>

        <!-- Pestañas -->
        <div class="tabs">
          <div class="tab-list" role="tablist">
            <button role="tab" :aria-selected="tab === 'desc'" :class="{ on: tab === 'desc' }" @click="tab = 'desc'">Descripción</button>
            <button role="tab" :aria-selected="tab === 'how'" :class="{ on: tab === 'how' }" @click="tab = 'how'">¿Cómo cotizar?</button>
          </div>
          <Transition name="fade" mode="out-in">
            <div v-if="tab === 'desc'" key="desc" class="tab-panel">
              <p v-if="p.description" class="custom-desc">{{ p.description }}</p>
              <p>
                <strong>{{ p.name }}</strong> forma parte de nuestra línea de <strong>{{ category.name.toLowerCase() }}</strong>:
                {{ category.description.toLowerCase() }}
              </p>
              <p>
                En Eximedical importamos y distribuimos productos de marcas reconocidas, con altos estándares de calidad
                para hospitales, clínicas, consultorios e instituciones educativas. Escríbenos para recibir la ficha técnica
                completa, opciones disponibles y asesoría personalizada.
              </p>
            </div>
            <ol v-else key="how" class="tab-panel how">
              <li><strong>Agrega el producto</strong> a tu lista de cotización con la cantidad que necesitas.</li>
              <li><strong>Suma otros productos</strong> desde la tienda si los necesitas.</li>
              <li><strong>Envía tu lista</strong> por WhatsApp o correo desde el ícono de la bolsa.</li>
              <li><strong>Recibe tu cotización</strong> con precios, disponibilidad y tiempos de entrega.</li>
            </ol>
          </Transition>
        </div>

        <ShopProductRow eyebrow="Te puede interesar" :title="`Más en ${category.name}`" :items="related" @quickview="quick = $event" />
        <ClientOnly>
          <ShopProductRow eyebrow="Tu historial" title="Vistos recientemente" :items="recentItems" @quickview="quick = $event" />
        </ClientOnly>
      </div>
    </section>

    <ShopQuickView v-model="quick" />
  </div>
</template>

<style scoped>
.top {
  padding: calc(var(--header-h) + 64px) 0 26px;
  background:
    radial-gradient(60% 140% at 100% 0%, rgba(47, 208, 212, 0.25), transparent 60%),
    linear-gradient(120deg, var(--indigo-950), var(--indigo-800));
  color: rgba(255, 255, 255, 0.7);
}

.crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.92rem;
}

.crumbs a:hover {
  color: var(--gold-300);
}

.crumbs [aria-current] {
  color: var(--gold-300);
  font-weight: 600;
}

.detail {
  padding-top: 48px;
}

.main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 64px);
  align-items: start;
}

/* ---- Galería ---- */
.gallery {
  position: sticky;
  top: calc(var(--header-h) + 20px);
}

.stage {
  position: relative;
  aspect-ratio: 5 / 6;
  border-radius: 28px;
  background: #fff;
  border: 1px solid var(--line);
  overflow: hidden;
  cursor: zoom-in;
}

.stage img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 24px;
  transition: transform 0.35s var(--ease);
  animation: img-in 0.6s var(--ease);
}

.stage.zooming img {
  transform: scale(2);
}

@keyframes img-in {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
}

.zoom-hint {
  position: absolute;
  left: 50%;
  bottom: 16px;
  translate: -50% 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 999px;
  background: rgba(27, 20, 82, 0.8);
  color: #fff;
  font-size: 0.8rem;
  transition: opacity 0.3s;
}

.stage.zooming .zoom-hint {
  opacity: 0;
}

.thumbs {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.thumbs button {
  width: 80px;
  height: 96px;
  padding: 6px;
  border-radius: 14px;
  border: 2px solid var(--line);
  background: #fff;
  transition: border-color 0.2s;
}

.thumbs button.on {
  border-color: var(--indigo-500);
}

.thumbs img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* ---- Información ---- */
.info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: info-in 0.8s var(--ease) both;
}

@keyframes info-in {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
}

.cat {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 8px;
  padding: 4px 14px 4px 4px;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--line);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--indigo-800);
  transition: border-color 0.2s;
}

.cat:hover {
  border-color: var(--teal-500);
}

h1 {
  font-size: clamp(2rem, 4vw, 2.9rem);
  font-weight: 700;
  color: var(--indigo-900);
}

.stock {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #17915a;
  font-weight: 600;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #25d366;
  animation: dot-pulse 2s infinite;
}

@keyframes dot-pulse {
  0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6); }
  70%, 100% { box-shadow: 0 0 0 9px rgba(37, 211, 102, 0); }
}

.lead {
  color: var(--muted);
  font-size: 1.05rem;
}

.buy {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 6px;
}

.qty {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid var(--line);
  border-radius: 999px;
  background: #fff;
  overflow: hidden;
}

.qty button {
  width: 46px;
  height: 52px;
  border: 0;
  background: none;
  font-size: 1.3rem;
  color: var(--indigo-900);
}

.qty button:hover {
  background: var(--indigo-100);
}

.qty input {
  width: 50px;
  border: 0;
  outline: 0;
  text-align: center;
  font: inherit;
  font-weight: 700;
  font-size: 1.05rem;
  -moz-appearance: textfield;
}

.qty input::-webkit-outer-spin-button,
.qty input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.add {
  flex: 1;
  min-width: 220px;
}

.add.added {
  --btn-bg: var(--teal-500);
  --btn-fg: var(--indigo-950);
}

.view-list {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: none;
  padding: 0;
  color: var(--indigo-700);
  font-weight: 600;
  animation: info-in 0.4s var(--ease);
}

.view-list:hover {
  text-decoration: underline;
}

.btn.wa {
  --btn-bg: #25d366;
  --btn-fg: #fff;
}

.btn.wa:hover {
  box-shadow: 0 14px 30px -10px rgba(37, 211, 102, 0.7);
}

.perks {
  list-style: none;
  padding: 18px 0 0;
  margin: 6px 0 0;
  border-top: 1px solid var(--line);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.perks li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.93rem;
  color: var(--indigo-900);
}

.perks span {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--indigo-100);
  color: var(--indigo-700);
}

.share {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 0.92rem;
}

.share a,
.share button {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--indigo-800);
  transition: background 0.2s, color 0.2s;
}

.share a:hover,
.share button:hover {
  background: var(--indigo-700);
  color: #fff;
}

.share em {
  font-style: normal;
  color: #17915a;
  font-weight: 600;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* ---- Pestañas ---- */
.tabs {
  margin-top: 72px;
  border-radius: 24px;
  background: var(--surface);
  border: 1px solid var(--line);
  overflow: hidden;
}

.tab-list {
  display: flex;
  border-bottom: 1px solid var(--line);
}

.tab-list button {
  position: relative;
  padding: 18px 26px;
  border: 0;
  background: none;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.02rem;
  color: var(--muted);
}

.tab-list button::after {
  content: '';
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: -1px;
  height: 3px;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--gold-500), var(--teal-500));
  transform: scaleX(0);
  transition: transform 0.35s var(--ease);
}

.tab-list button.on {
  color: var(--indigo-900);
}

.tab-list button.on::after {
  transform: scaleX(1);
}

.tab-panel {
  padding: 28px 30px 32px;
  color: var(--muted);
  display: grid;
  gap: 12px;
  max-width: 820px;
}

.custom-desc {
  white-space: pre-line;
  color: var(--ink);
}

.tab-panel strong {
  color: var(--indigo-900);
}

.how {
  margin: 0;
  padding-left: 52px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .main {
    grid-template-columns: 1fr;
  }

  .gallery {
    position: static;
  }

  .stage {
    max-width: 480px;
    margin-inline: auto;
  }
}

@media (max-width: 520px) {
  .perks {
    grid-template-columns: 1fr;
  }

  .zoom-hint {
    display: none;
  }
}
</style>
