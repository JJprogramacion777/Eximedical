<script setup lang="ts">
// Panel lateral con la lista de cotización. Se envía por WhatsApp o correo.
const { site } = useAppConfig()
const quote = useQuote()
const { open, detailed, count } = quote
const route = useRoute()

const name = ref('')
const note = ref('')

const close = () => (open.value = false)
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

watch(open, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})
watch(() => route.fullPath, close)

const sendWhatsApp = () => {
  const text = quote.message({ name: name.value.trim(), note: note.value.trim() })
  window.open(`${site.whatsapp}?text=${encodeURIComponent(text)}`, '_blank')
}
const sendEmail = () => {
  const text = quote.message({ name: name.value.trim(), note: note.value.trim() })
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Solicitud de cotización desde la web')}&body=${encodeURIComponent(text)}`
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="backdrop" @click="close" />
    </Transition>
    <Transition name="slide">
      <aside v-if="open" class="drawer" role="dialog" aria-modal="true" aria-label="Lista de cotización">
        <header>
          <div>
            <h2>Tu cotización</h2>
            <small>{{ count }} {{ count === 1 ? 'producto' : 'productos' }}</small>
          </div>
          <button class="close" aria-label="Cerrar" @click="close"><AppIcon name="x" :size="22" /></button>
        </header>

        <div v-if="!detailed.length" class="empty">
          <div class="empty-icon"><AppIcon name="bag" :size="40" /></div>
          <h3>Tu lista está vacía</h3>
          <p>Agrega productos desde la tienda y envíanos tu solicitud en un solo mensaje.</p>
          <NuxtLink to="/tienda" class="btn btn-primary" @click="close">
            Ir a la tienda <AppIcon name="arrow-right" :size="18" />
          </NuxtLink>
        </div>

        <template v-else>
          <TransitionGroup tag="ul" name="item" class="items">
            <li v-for="i in detailed" :key="i.slug" class="item">
              <NuxtLink :to="`/producto/${i.slug}`" class="thumb" @click="close">
                <img :src="imagenDe(i.product)" :alt="i.product.name" width="72" height="86">
              </NuxtLink>
              <div class="info">
                <NuxtLink :to="`/producto/${i.slug}`" class="name" @click="close">{{ i.product.name }}</NuxtLink>
                <small>{{ getCategoria(i.product.category)?.name }}</small>
                <div class="qty">
                  <button aria-label="Restar uno" @click="quote.setQty(i.slug, i.qty - 1)">−</button>
                  <input
                    :value="i.qty"
                    type="number"
                    min="1"
                    aria-label="Cantidad"
                    @change="quote.setQty(i.slug, Number(($event.target as HTMLInputElement).value) || 1)"
                  >
                  <button aria-label="Sumar uno" @click="quote.setQty(i.slug, i.qty + 1)">+</button>
                </div>
              </div>
              <button class="remove" :aria-label="`Quitar ${i.product.name}`" @click="quote.remove(i.slug)">
                <AppIcon name="x" :size="16" />
              </button>
            </li>
          </TransitionGroup>

          <footer>
            <input v-model="name" type="text" placeholder="Tu nombre (opcional)" class="input">
            <textarea v-model="note" rows="2" placeholder="Comentarios: ciudad, plazo de entrega, etc. (opcional)" class="input" />
            <button class="btn wa" @click="sendWhatsApp">
              <AppIcon name="whatsapp" :size="20" /> Solicitar cotización por WhatsApp
            </button>
            <div class="row">
              <button class="link" @click="sendEmail"><AppIcon name="mail" :size="16" /> Enviar por correo</button>
              <button class="link muted" @click="quote.clear()">Vaciar lista</button>
            </div>
            <p class="fine">Te responderemos con precios, disponibilidad y tiempos de entrega.</p>
          </footer>
        </template>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(17, 12, 56, 0.55);
  backdrop-filter: blur(4px);
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 91;
  width: min(440px, 100%);
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: var(--shadow-lg);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 24px;
  border-bottom: 1px solid var(--line);
}

h2 {
  font-size: 1.5rem;
  color: var(--indigo-900);
}

header small {
  color: var(--muted);
}

.close {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 0;
  background: var(--bg);
  color: var(--indigo-900);
  transition: transform 0.3s var(--ease), background 0.2s;
}

.close:hover {
  transform: rotate(90deg);
  background: var(--indigo-100);
}

.empty {
  flex: 1;
  display: grid;
  place-content: center;
  justify-items: center;
  text-align: center;
  gap: 12px;
  padding: 32px;
}

.empty-icon {
  display: grid;
  place-items: center;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--indigo-100);
  color: var(--indigo-700);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  50% { transform: translateY(-8px); }
}

.empty h3 {
  color: var(--indigo-900);
  font-size: 1.3rem;
}

.empty p {
  color: var(--muted);
  max-width: 300px;
  margin-bottom: 8px;
}

.items {
  flex: 1;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 8px 24px;
}

.item {
  position: relative;
  display: flex;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
}

.thumb {
  flex-shrink: 0;
  width: 72px;
  height: 86px;
  border-radius: 12px;
  border: 1px solid var(--line);
  overflow: hidden;
  background: #fff;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.info {
  flex: 1;
  min-width: 0;
  padding-right: 24px;
}

.name {
  display: block;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--indigo-900);
  line-height: 1.3;
}

.name:hover {
  color: var(--indigo-500);
}

.info small {
  color: var(--muted);
  font-size: 0.82rem;
}

.qty {
  display: inline-flex;
  align-items: center;
  margin-top: 10px;
  border: 1px solid var(--line);
  border-radius: 999px;
  overflow: hidden;
}

.qty button {
  width: 32px;
  height: 32px;
  border: 0;
  background: var(--bg);
  color: var(--indigo-900);
  font-size: 1.1rem;
}

.qty button:hover {
  background: var(--indigo-100);
}

.qty input {
  width: 44px;
  height: 32px;
  border: 0;
  text-align: center;
  font: inherit;
  font-weight: 600;
  -moz-appearance: textfield;
}

.qty input::-webkit-outer-spin-button,
.qty input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.remove {
  position: absolute;
  top: 16px;
  right: 0;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 0;
  background: transparent;
  color: var(--muted);
  transition: background 0.2s, color 0.2s;
}

.remove:hover {
  background: #fde8e8;
  color: #d03c3c;
}

footer {
  display: grid;
  gap: 10px;
  padding: 18px 24px 24px;
  border-top: 1px solid var(--line);
  background: var(--bg);
}

.input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  font: inherit;
  resize: none;
  outline: 0;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: var(--indigo-500);
}

.btn.wa {
  --btn-bg: #25d366;
  --btn-fg: #fff;
  width: 100%;
}

.row {
  display: flex;
  justify-content: space-between;
}

.link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: none;
  padding: 4px 0;
  color: var(--indigo-700);
  font-weight: 600;
}

.link.muted {
  color: var(--muted);
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

.fine {
  font-size: 0.82rem;
  color: var(--muted);
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.45s var(--ease);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.item-enter-active,
.item-leave-active {
  transition: opacity 0.3s, transform 0.4s var(--ease);
}

.item-enter-from,
.item-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
