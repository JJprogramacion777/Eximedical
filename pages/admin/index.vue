<script setup lang="ts">
import type { Producto } from '~/utils/tienda'
import type { Catalogo } from '~/utils/catalogos'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const api = useAdminApi()
const auth = useAdminAuth()
const toast = useToast()

type Row = Producto & { updated_at?: string }
const productos = ref<Row[]>([])
const catalogos = ref<(Catalogo & { updated_at?: string })[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [p, c] = await Promise.all([api.list<Row>('productos'), api.list<Catalogo & { updated_at?: string }>('catalogos')])
    productos.value = p
    catalogos.value = c
  }
  catch (e) {
    toast.error(`Error al cargar datos: ${(e as Error).message}`)
  }
  loading.value = false
})

const stats = computed(() => [
  { label: 'Productos publicados', value: productos.value.filter(p => p.active).length, icon: 'package', tone: 'indigo', to: '/admin/productos' },
  { label: 'Productos ocultos', value: productos.value.filter(p => !p.active).length, icon: 'eye', tone: 'gray', to: '/admin/productos' },
  { label: 'Catálogos PDF', value: catalogos.value.length, icon: 'file-text', tone: 'gold', to: '/admin/catalogos' },
  { label: 'Productos sin imagen', value: productos.value.filter(p => !p.images?.length).length, icon: 'x', tone: 'red', to: '/admin/productos' }
])

const byCategory = computed(() => {
  const max = Math.max(1, ...categorias.map(c => productos.value.filter(p => p.category === c.slug).length))
  return categorias.map(c => {
    const count = productos.value.filter(p => p.category === c.slug).length
    return { ...c, count, pct: (count / max) * 100 }
  })
})

const recent = computed(() =>
  [...productos.value]
    .sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))
    .slice(0, 6)
)

const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'
})

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('es-EC', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '')
</script>

<template>
  <div class="dash">
    <section class="hello">
      <div>
        <h2>{{ greeting }} 👋</h2>
        <p>Desde aquí administras los productos de la tienda y los catálogos PDF del sitio. Los cambios se publican al instante.</p>
      </div>
      <div class="quick">
        <NuxtLink to="/admin/productos" class="adm-btn gold"><AppIcon name="bag" :size="18" /> Gestionar productos</NuxtLink>
        <NuxtLink to="/admin/catalogos" class="adm-btn ghost"><AppIcon name="file-text" :size="18" /> Gestionar catálogos</NuxtLink>
      </div>
    </section>

    <section class="stats">
      <NuxtLink v-for="(s, i) in stats" :key="s.label" :to="s.to" class="stat" :class="s.tone" :style="{ '--i': i }">
        <span class="s-icon"><AppIcon :name="s.icon" :size="22" /></span>
        <strong>{{ loading ? '—' : s.value }}</strong>
        <small>{{ s.label }}</small>
      </NuxtLink>
    </section>

    <div class="cols">
      <section class="card">
        <h3>Productos por categoría</h3>
        <ul class="bars">
          <li v-for="c in byCategory" :key="c.slug">
            <div class="bar-label">
              <img :src="c.icon" alt="" width="28" height="28"> {{ c.name }}
              <strong>{{ c.count }}</strong>
            </div>
            <div class="bar"><span :style="{ width: loading ? '0%' : `${c.pct}%` }" /></div>
          </li>
        </ul>
      </section>

      <section class="card">
        <h3>Últimos productos modificados</h3>
        <ul class="recent">
          <li v-for="p in recent" :key="p.id">
            <img :src="imagenDe(p)" alt="" class="adm-thumb">
            <div>
              <strong>{{ p.name }}</strong>
              <small>{{ getCategoria(p.category)?.name }} · {{ fmtDate(p.updated_at) }}</small>
            </div>
            <span class="dot" :class="{ off: !p.active }" :title="p.active ? 'Publicado' : 'Oculto'" />
          </li>
          <li v-if="!loading && !recent.length" class="none">Aún no hay productos.</li>
        </ul>
      </section>
    </div>

    <p class="session">Sesión iniciada como <strong>{{ auth.user.value?.email }}</strong></p>
  </div>
</template>

<style scoped>
.dash {
  display: grid;
  gap: 24px;
}

.hello {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 28px 30px;
  border-radius: 22px;
  color: #fff;
  background:
    radial-gradient(60% 120% at 100% 0%, rgba(47, 208, 212, 0.3), transparent 60%),
    linear-gradient(120deg, var(--indigo-800), var(--indigo-950));
}

.hello h2 {
  font-size: 1.7rem;
}

.hello p {
  margin-top: 6px;
  max-width: 520px;
  color: rgba(255, 255, 255, 0.78);
}

.quick {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat {
  display: grid;
  gap: 4px;
  padding: 20px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid var(--line);
  transition: transform 0.3s var(--ease), box-shadow 0.3s;
  animation: up 0.5s var(--ease) both;
  animation-delay: calc(var(--i) * 70ms);
}

@keyframes up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}

.stat:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}

.s-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: 8px;
  border-radius: 12px;
  background: var(--indigo-100);
  color: var(--indigo-700);
}

.gold .s-icon {
  background: #fff3d6;
  color: var(--gold-600);
}

.gray .s-icon {
  background: #eef0f4;
  color: #6b7080;
}

.red .s-icon {
  background: #fde8e8;
  color: #d03c3c;
}

.stat strong {
  font-family: var(--font-display);
  font-size: 2rem;
  line-height: 1;
  color: var(--indigo-900);
}

.stat small {
  color: var(--muted);
}

.cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.card {
  padding: 22px 24px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid var(--line);
}

.card h3 {
  font-size: 1.1rem;
  color: var(--indigo-900);
  margin-bottom: 16px;
}

.bars {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}

.bar-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: var(--indigo-900);
}

.bar-label strong {
  margin-left: auto;
}

.bar {
  margin-top: 6px;
  height: 8px;
  border-radius: 8px;
  background: var(--bg);
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--indigo-500), var(--teal-500));
  transition: width 1s var(--ease);
}

.recent {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.recent li {
  display: flex;
  align-items: center;
  gap: 12px;
}

.recent .adm-thumb {
  width: 44px;
  height: 44px;
}

.recent div {
  flex: 1;
  min-width: 0;
}

.recent strong {
  display: block;
  color: var(--indigo-900);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent small {
  color: var(--muted);
  font-size: 0.8rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #25b86b;
}

.dot.off {
  background: #c4c6d4;
}

.none {
  color: var(--muted);
}

.session {
  color: var(--muted);
  font-size: 0.88rem;
}

@media (max-width: 1100px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 860px) {
  .cols {
    grid-template-columns: 1fr;
  }
}
</style>
