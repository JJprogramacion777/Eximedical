<script setup lang="ts">
// Buscador global de productos. Se abre con el ícono de lupa, con "/" o con Ctrl+K.
const open = useState('search-open', () => false)
const query = ref('')
const input = ref<HTMLInputElement>()
const active = ref(0)
const router = useRouter()

const results = computed(() => {
  const q = normalizar(query.value.trim())
  if (!q) return []
  return productos.filter(p => normalizar(p.name).includes(q)).slice(0, 7)
})

const cats = computed(() => {
  const q = normalizar(query.value.trim())
  return q ? categorias.filter(c => normalizar(c.name).includes(q)) : categorias
})

watch(open, async (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) {
    query.value = ''
    await nextTick()
    input.value?.focus()
  }
})
watch(query, () => (active.value = 0))

const go = (to: string) => {
  open.value = false
  router.push(to)
}

const submit = () => {
  const hit = results.value[active.value]
  if (hit) go(`/producto/${hit.slug}`)
  else if (query.value.trim()) go(`/tienda?q=${encodeURIComponent(query.value.trim())}`)
}

const onKey = (e: KeyboardEvent) => {
  const typing = e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable]')
  if (!open.value && ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)))) {
    e.preventDefault()
    open.value = true
    return
  }
  if (!open.value) return
  if (e.key === 'Escape') open.value = false
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    active.value = Math.min(active.value + 1, results.value.length - 1)
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    active.value = Math.max(active.value - 1, 0)
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="search">
      <div v-if="open" class="overlay" @click.self="open = false">
        <div class="panel" role="dialog" aria-modal="true" aria-label="Buscar productos">
          <form class="bar" @submit.prevent="submit">
            <AppIcon name="search" :size="22" />
            <input ref="input" v-model="query" type="search" placeholder="Buscar productos: camilla, tensiómetro, pinza..." aria-label="Buscar productos">
            <kbd>Esc</kbd>
          </form>

          <div class="body">
            <template v-if="query.trim()">
              <p class="label">Productos</p>
              <ul v-if="results.length" class="results">
                <li v-for="(p, i) in results" :key="p.slug">
                  <button :class="{ active: i === active }" @mouseenter="active = i" @click="go(`/producto/${p.slug}`)">
                    <img :src="imagenDe(p)" alt="" width="44" height="52">
                    <span>
                      <strong>{{ p.name }}</strong>
                      <small>{{ getCategoria(p.category)?.name }}</small>
                    </span>
                    <AppIcon name="arrow-right" :size="16" />
                  </button>
                </li>
              </ul>
              <p v-else class="none">Sin resultados para “{{ query }}”.</p>
              <button v-if="results.length" class="all" @click="go(`/tienda?q=${encodeURIComponent(query.trim())}`)">
                Ver todos los resultados en la tienda <AppIcon name="arrow-right" :size="16" />
              </button>
            </template>

            <p class="label">Categorías</p>
            <div class="cats">
              <button v-for="c in cats" :key="c.slug" class="cat" @click="go(`/tienda/${c.slug}`)">
                <img :src="c.icon" alt="" width="32" height="32"> {{ c.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 95;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 10vh 16px 16px;
  background: rgba(17, 12, 56, 0.6);
  backdrop-filter: blur(8px);
}

.panel {
  width: min(640px, 100%);
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  border-radius: 22px;
  background: #fff;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--line);
  color: var(--indigo-700);
}

.bar input {
  flex: 1;
  border: 0;
  outline: 0;
  font: inherit;
  font-size: 1.1rem;
  color: var(--ink);
}

kbd {
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--line);
  font-size: 0.75rem;
  color: var(--muted);
  font-family: inherit;
}

.body {
  overflow-y: auto;
  padding: 8px 12px 18px;
}

.label {
  padding: 12px 8px 6px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold-600);
}

.results {
  list-style: none;
  margin: 0;
  padding: 0;
}

.results button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px;
  border: 0;
  border-radius: 12px;
  background: none;
  text-align: left;
  color: var(--muted);
}

.results button.active {
  background: var(--indigo-100);
  color: var(--indigo-700);
}

.results img {
  width: 44px;
  height: 52px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: #fff;
}

.results span {
  flex: 1;
  min-width: 0;
}

.results strong {
  display: block;
  color: var(--indigo-900);
  font-weight: 600;
}

.results small {
  font-size: 0.8rem;
}

.none {
  padding: 8px;
  color: var(--muted);
}

.all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 6px 8px 0;
  border: 0;
  background: none;
  color: var(--indigo-700);
  font-weight: 600;
}

.cats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 8px;
}

.cat {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 6px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--indigo-900);
  font-weight: 500;
  transition: border-color 0.2s, transform 0.2s;
}

.cat:hover {
  border-color: var(--teal-500);
  transform: translateY(-2px);
}

.cat img {
  width: 32px;
  height: 32px;
}

.search-enter-active,
.search-leave-active {
  transition: opacity 0.25s;
}

.search-enter-active .panel,
.search-leave-active .panel {
  transition: transform 0.35s var(--ease);
}

.search-enter-from,
.search-leave-to {
  opacity: 0;
}

.search-enter-from .panel,
.search-leave-to .panel {
  transform: translateY(-20px) scale(0.98);
}
</style>
