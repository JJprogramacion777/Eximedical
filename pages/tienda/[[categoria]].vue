<script setup lang="ts">
import type { Producto } from '~/utils/tienda'

// /tienda muestra todo; /tienda/<categoria> filtra por categoría
definePageMeta({
  key: 'tienda',
  // Al cambiar de categoría dentro de la tienda no se vuelve al inicio de la página
  scrollToTop: (_to, from) => !from.path.startsWith('/tienda')
})

const route = useRoute()
const router = useRouter()
const { productos, productosDe } = useShop()

const slug = computed(() => (route.params.categoria as string | undefined) || undefined)
const category = computed(() => getCategoria(slug.value))

if (slug.value && !category.value) {
  throw createError({ statusCode: 404, statusMessage: 'Categoría no encontrada', fatal: true })
}

useSeoMeta({
  title: () => category.value ? `${category.value.name} | Tienda Eximedical` : 'Tienda | Eximedical',
  description: () => category.value
    ? `${category.value.name}: ${category.value.description} Cotiza en línea con Eximedical, Quito – Ecuador.`
    : 'Tienda de Eximedical: equipos médicos, mobiliario, instrumental quirúrgico, descartables y modelos anatómicos. Arma tu lista y cotiza en línea.',
  ogImage: () => category.value?.cover ?? '/images/catalogo/equipos-medicos.jpg'
})

// ---- Filtros (se reflejan en la URL para poder compartir la búsqueda) ----
const query = ref(String(route.query.q ?? ''))
const sort = ref(String(route.query.orden ?? 'destacados'))
const view = ref<'grid' | 'list'>('grid')

watch([query, sort], () => {
  const q: Record<string, string> = {}
  if (query.value.trim()) q.q = query.value.trim()
  if (sort.value !== 'destacados') q.orden = sort.value
  router.replace({ query: q })
})
watch(() => route.query.q, (v) => {
  if (String(v ?? '') !== query.value.trim()) query.value = String(v ?? '')
})

const filtered = computed(() => {
  const q = normalizar(query.value.trim())
  let list = productos.value.filter(p =>
    (!slug.value || p.category === slug.value)
    && (!q || normalizar(p.name).includes(q))
  )
  // "Destacados": primero los marcados como destacados en el panel, luego por categoría
  if (sort.value === 'destacados') {
    const order = categorias.map(c => c.slug)
    list = [...list].sort((a, b) =>
      Number(!!b.featured) - Number(!!a.featured) || order.indexOf(a.category) - order.indexOf(b.category))
  }
  if (sort.value === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'es'))
  if (sort.value === 'za') list = [...list].sort((a, b) => b.name.localeCompare(a.name, 'es'))
  return list
})

// ---- Carga progresiva: 12 productos y luego más al llegar al final ----
const PAGE = 12
const limit = ref(PAGE)
const visible = computed(() => filtered.value.slice(0, limit.value))
const hasMore = computed(() => limit.value < filtered.value.length)
watch([filtered, slug], () => (limit.value = PAGE))

const sentinel = ref<HTMLElement>()
let io: IntersectionObserver | undefined
onMounted(() => {
  io = new IntersectionObserver(([e]) => {
    if (e?.isIntersecting && hasMore.value) limit.value += PAGE
  }, { rootMargin: '300px' })
  if (sentinel.value) io.observe(sentinel.value)
})
onBeforeUnmount(() => io?.disconnect())

// Al cambiar de categoría, desplazarse suavemente hasta los productos
const productsEl = ref<HTMLElement>()
watch(slug, () => {
  const top = (productsEl.value?.getBoundingClientRect().top ?? 0) + window.scrollY - 120
  if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' })
})

const countFor = (s?: string) => (s ? productosDe(s).length : productos.value.length)
const quick = ref<Producto | null>(null)

const steps = [
  { icon: 'bag', title: 'Agrega productos', text: 'Arma tu lista con las cantidades que necesitas.' },
  { icon: 'whatsapp', title: 'Envía tu solicitud', text: 'Por WhatsApp o correo, en un solo mensaje.' },
  { icon: 'file-text', title: 'Recibe tu cotización', text: 'Precios, disponibilidad y tiempos de entrega.' }
]
</script>

<template>
  <div>
    <PageHero
      :crumb="category ? category.name : 'Tienda'"
      :title="category ? category.name : 'Tienda'"
      :highlight="category ? undefined : 'Eximedical'"
      :subtitle="category ? category.description : 'Explora nuestros productos, arma tu lista y recibe una cotización personalizada.'"
      :image="category?.cover ?? '/images/catalogo/equipos-medicos.jpg'"
    />

    <section class="steps-section">
      <div class="container steps">
        <div v-for="(s, i) in steps" :key="s.title" v-reveal="{ delay: i * 100 }" class="step">
          <span class="s-icon"><AppIcon :name="s.icon" :size="22" /></span>
          <div>
            <strong>{{ i + 1 }}. {{ s.title }}</strong>
            <small>{{ s.text }}</small>
          </div>
        </div>
      </div>
    </section>

    <section ref="productsEl" class="section shop">
      <div class="container">
        <!-- Categorías -->
        <nav class="cats" aria-label="Categorías">
          <NuxtLink to="/tienda" class="cat" :class="{ active: !slug }">
            <span class="cat-icon all"><AppIcon name="package" :size="22" /></span>
            <span><strong>Todos</strong><small>{{ countFor() }} productos</small></span>
          </NuxtLink>
          <NuxtLink
            v-for="c in categorias"
            :key="c.slug"
            :to="`/tienda/${c.slug}`"
            class="cat"
            :class="{ active: slug === c.slug }"
          >
            <img :src="c.icon" alt="" class="cat-icon" width="44" height="44">
            <span><strong>{{ c.name }}</strong><small>{{ countFor(c.slug) }} productos</small></span>
          </NuxtLink>
        </nav>

        <!-- Barra de herramientas -->
        <div class="toolbar">
          <label class="search">
            <AppIcon name="search" :size="19" />
            <input v-model="query" type="search" placeholder="Buscar en la tienda..." aria-label="Buscar productos">
          </label>
          <p class="results">
            <strong>{{ filtered.length }}</strong> {{ filtered.length === 1 ? 'producto' : 'productos' }}
            <template v-if="query.trim()"> para “{{ query.trim() }}”</template>
          </p>
          <div class="right">
            <select v-model="sort" aria-label="Ordenar">
              <option value="destacados">Destacados</option>
              <option value="az">Nombre: A → Z</option>
              <option value="za">Nombre: Z → A</option>
            </select>
            <div class="view" role="group" aria-label="Vista">
              <button :class="{ on: view === 'grid' }" aria-label="Vista en cuadrícula" @click="view = 'grid'">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
              </button>
              <button :class="{ on: view === 'list' }" aria-label="Vista en lista" @click="view = 'list'">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="3" y="4" width="18" height="4" rx="1.5" /><rect x="3" y="10" width="18" height="4" rx="1.5" /><rect x="3" y="16" width="18" height="4" rx="1.5" /></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Productos -->
        <div v-if="visible.length" class="grid" :class="view">
          <ShopProductCard
            v-for="(p, i) in visible"
            :key="p.slug"
            :product="p"
            :list="view === 'list'"
            class="appear"
            :style="{ '--d': `${(i % PAGE) * 40}ms` }"
            @quickview="quick = $event"
          />
        </div>

        <div v-else class="empty">
          <div class="empty-icon"><AppIcon name="search" :size="36" /></div>
          <h3>No encontramos productos</h3>
          <p>Prueba con otra palabra o revisa otra categoría. Si no lo ves, igual podemos conseguirlo para ti.</p>
          <div class="empty-actions">
            <button class="btn btn-primary" @click="query = ''">Limpiar búsqueda</button>
            <NuxtLink to="/contacto" class="btn">Consultar disponibilidad</NuxtLink>
          </div>
        </div>

        <div ref="sentinel" class="sentinel" />

        <div v-if="filtered.length > PAGE" class="more">
          <p>Mostrando {{ visible.length }} de {{ filtered.length }}</p>
          <div class="bar"><span :style="{ transform: `scaleX(${visible.length / filtered.length})` }" /></div>
          <button v-if="hasMore" class="btn btn-primary" @click="limit += PAGE">Cargar más productos</button>
        </div>
      </div>
    </section>

    <HomeCta />
    <ShopQuickView v-model="quick" />
  </div>
</template>

<style scoped>
/* ---- Pasos ---- */
.steps-section {
  margin-top: -40px;
  position: relative;
  z-index: 2;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.step {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 18px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.step strong {
  display: block;
  font-family: var(--font-display);
  color: var(--indigo-900);
}

.step small {
  color: var(--muted);
}

.s-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--gold-300), var(--gold-500));
  color: var(--indigo-950);
}

.shop {
  padding-top: 56px;
}

/* ---- Categorías ---- */
.cats {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px 4px 14px;
  margin: 0 -4px 22px;
  scrollbar-width: none;
}

.cats::-webkit-scrollbar {
  display: none;
}

.cat {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1 0 auto;
  padding: 10px 18px 10px 10px;
  border-radius: 18px;
  background: var(--surface);
  border: 1.5px solid var(--line);
  transition: border-color 0.3s, transform 0.3s var(--ease), box-shadow 0.3s, background 0.3s;
}

.cat:hover {
  transform: translateY(-3px);
  border-color: var(--teal-500);
}

.cat.active {
  background: var(--indigo-900);
  border-color: var(--indigo-900);
  box-shadow: 0 14px 30px -14px rgba(27, 20, 82, 0.8);
}

.cat-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: transform 0.5s var(--ease);
}

.cat:hover .cat-icon,
.cat.active .cat-icon {
  transform: rotate(-12deg);
}

.cat-icon.all {
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--indigo-500), var(--indigo-800));
  color: #fff;
}

.cat strong {
  display: block;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--indigo-900);
  white-space: nowrap;
}

.cat small {
  color: var(--muted);
  font-size: 0.8rem;
}

.cat.active strong {
  color: #fff;
}

.cat.active small {
  color: var(--gold-300);
}

/* ---- Barra de herramientas ---- */
.toolbar {
  position: sticky;
  top: calc(var(--header-h) - 4px);
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px;
  margin-bottom: 28px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);
}

.search {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 1 260px;
  max-width: 360px;
  height: 46px;
  padding: 0 16px;
  border-radius: 12px;
  background: var(--bg);
  color: var(--muted);
  border: 1.5px solid transparent;
  transition: border-color 0.2s, background 0.2s;
}

.search:focus-within {
  border-color: var(--indigo-500);
  background: #fff;
}

.search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: none;
  font: inherit;
  color: var(--ink);
}

.results {
  color: var(--muted);
}

.results strong {
  color: var(--indigo-900);
}

.right {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

select {
  height: 46px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1.5px solid var(--line);
  background: #fff;
  font: inherit;
  color: var(--indigo-900);
  cursor: pointer;
}

.view {
  display: flex;
  padding: 4px;
  border-radius: 12px;
  background: var(--bg);
}

.view button {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 9px;
  background: none;
  color: var(--muted);
  transition: background 0.2s, color 0.2s;
}

.view button.on {
  background: #fff;
  color: var(--indigo-700);
  box-shadow: var(--shadow-sm);
}

/* ---- Grilla ---- */
.grid {
  display: grid;
  gap: 22px;
}

.grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
}

.grid.list {
  grid-template-columns: 1fr;
}

.appear {
  animation: appear 0.6s var(--ease) both;
  animation-delay: var(--d);
}

@keyframes appear {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}

.empty {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  display: grid;
  place-items: center;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: var(--indigo-100);
  color: var(--indigo-700);
}

.empty h3 {
  font-size: 1.4rem;
  color: var(--indigo-900);
}

.empty p {
  max-width: 440px;
  color: var(--muted);
}

.empty-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;
}

.sentinel {
  height: 1px;
}

.more {
  display: grid;
  justify-items: center;
  gap: 12px;
  margin-top: 36px;
  color: var(--muted);
}

.more .bar {
  width: 220px;
  height: 4px;
  border-radius: 4px;
  background: var(--line);
  overflow: hidden;
}

.more .bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--gold-500), var(--teal-500));
  transform-origin: left;
  transition: transform 0.5s var(--ease);
}

@media (max-width: 860px) {
  .steps {
    grid-template-columns: 1fr;
  }

  .step:not(:first-child) {
    display: none;
  }
}

@media (max-width: 640px) {
  .toolbar {
    position: static;
  }

  .right {
    margin-left: 0;
    width: 100%;
  }

  select {
    flex: 1;
  }

  .search {
    max-width: none;
  }

  .grid.grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>
