<script setup lang="ts">
import type { Producto } from '~/utils/tienda'

// Vista rápida del producto sin salir del listado
const model = defineModel<Producto | null>({ required: true })
const { site } = useAppConfig()
const quote = useQuote()
const fly = useFlyToCart()
const qty = ref(1)
const img = ref<HTMLImageElement>()

const close = () => (model.value = null)
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

watch(model, (p) => {
  qty.value = 1
  document.body.style.overflow = p ? 'hidden' : ''
  if (p) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})

const add = () => {
  if (!model.value) return
  quote.add(model.value.slug, qty.value)
  fly(img.value)
  close()
}

const askNow = computed(() => {
  if (!model.value) return '#'
  const text = `Hola Eximedical, quisiera cotizar: ${model.value.name} (cantidad: ${qty.value}).`
  return `${site.whatsapp}?text=${encodeURIComponent(text)}`
})
</script>

<template>
  <Teleport to="body">
    <Transition name="qv">
      <div v-if="model" class="backdrop" @click.self="close">
        <div class="dialog" role="dialog" aria-modal="true" :aria-label="model.name">
          <button class="close" aria-label="Cerrar" @click="close"><AppIcon name="x" :size="20" /></button>
          <div class="media">
            <img ref="img" :src="imagenDe(model)" :alt="model.name" width="768" height="922">
          </div>
          <div class="info">
            <NuxtLink :to="`/tienda/${model.category}`" class="cat" @click="close">
              {{ getCategoria(model.category)?.name }}
            </NuxtLink>
            <h2>{{ model.name }}</h2>
            <p class="stock"><span class="dot" /> Disponible para cotización</p>
            <p class="text">
              Solicita precio, ficha técnica y tiempos de entrega. Nuestro equipo te asesora para elegir la mejor opción.
            </p>
            <div class="buy">
              <div class="qty">
                <button aria-label="Restar uno" @click="qty = Math.max(1, qty - 1)">−</button>
                <span>{{ qty }}</span>
                <button aria-label="Sumar uno" @click="qty++">+</button>
              </div>
              <button class="btn btn-primary" @click="add">
                <AppIcon name="bag" :size="18" /> Agregar a cotización
              </button>
            </div>
            <a :href="askNow" target="_blank" rel="noopener" class="wa-link">
              <AppIcon name="whatsapp" :size="18" /> Cotizar solo este producto por WhatsApp
            </a>
            <NuxtLink :to="`/producto/${model.slug}`" class="more" @click="close">
              Ver detalle completo <AppIcon name="arrow-right" :size="16" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 96;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(17, 12, 56, 0.6);
  backdrop-filter: blur(6px);
}

.dialog {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: min(880px, 100%);
  max-height: 90vh;
  overflow: auto;
  border-radius: 26px;
  background: #fff;
  box-shadow: var(--shadow-lg);
}

.close {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 0;
  background: var(--bg);
  color: var(--indigo-900);
  transition: transform 0.3s var(--ease);
}

.close:hover {
  transform: rotate(90deg);
}

.media {
  display: grid;
  place-items: center;
  padding: 28px;
  background: #fff;
  border-right: 1px solid var(--line);
}

.media img {
  max-height: 420px;
  width: auto;
  object-fit: contain;
}

.info {
  padding: 40px 34px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cat {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold-600);
}

h2 {
  font-size: 1.8rem;
  color: var(--indigo-900);
  padding-right: 30px;
}

.stock {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #17915a;
  font-weight: 600;
  font-size: 0.92rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #25d366;
  box-shadow: 0 0 0 4px rgba(37, 211, 102, 0.2);
}

.text {
  color: var(--muted);
}

.buy {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.qty {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid var(--line);
  border-radius: 999px;
  overflow: hidden;
}

.qty button {
  width: 44px;
  height: 50px;
  border: 0;
  background: none;
  font-size: 1.2rem;
  color: var(--indigo-900);
}

.qty button:hover {
  background: var(--indigo-100);
}

.qty span {
  min-width: 32px;
  text-align: center;
  font-weight: 700;
}

.wa-link,
.more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.wa-link {
  color: #17915a;
}

.more {
  color: var(--indigo-700);
}

.wa-link:hover,
.more:hover {
  text-decoration: underline;
}

.qv-enter-active,
.qv-leave-active {
  transition: opacity 0.3s;
}

.qv-enter-active .dialog,
.qv-leave-active .dialog {
  transition: transform 0.4s var(--ease);
}

.qv-enter-from,
.qv-leave-to {
  opacity: 0;
}

.qv-enter-from .dialog,
.qv-leave-to .dialog {
  transform: translateY(30px) scale(0.96);
}

@media (max-width: 720px) {
  .dialog {
    grid-template-columns: 1fr;
  }

  .media {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .media img {
    max-height: 260px;
  }

  .info {
    padding: 24px;
  }
}
</style>
