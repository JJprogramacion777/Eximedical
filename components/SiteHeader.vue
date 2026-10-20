<script setup lang="ts">
const { site, nav } = useAppConfig()
const route = useRoute()

const scrolled = ref(false)
const menuOpen = ref(false)
const progress = ref(0)

const onScroll = () => {
  scrolled.value = window.scrollY > 40
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? window.scrollY / max : 0
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

watch(() => route.fullPath, () => (menuOpen.value = false))
watch(menuOpen, open => document.body.style.overflow = open ? 'hidden' : '')

// Todas las páginas abren con un banner oscuro: el header es transparente hasta que se hace scroll
const solid = computed(() => scrolled.value || menuOpen.value)

const quote = useQuote()
const searchOpen = useState('search-open', () => false)
</script>

<template>
  <header class="header" :class="{ solid, scrolled }">
    <div class="topbar">
      <div class="container topbar-inner">
        <div class="topbar-info">
          <a :href="site.phoneHref"><AppIcon name="phone" :size="15" /> ¡Llámanos! {{ site.phone }}</a>
          <a :href="`mailto:${site.email}`" class="hide-sm"><AppIcon name="mail" :size="15" /> {{ site.email }}</a>
        </div>
        <div class="topbar-socials">
          <a
            v-for="s in site.socials"
            :key="s.name"
            :href="s.url"
            :aria-label="s.name"
            target="_blank"
            rel="noopener"
          ><AppIcon :name="s.icon" :size="16" /></a>
        </div>
      </div>
    </div>

    <div class="container nav-bar">
      <NuxtLink to="/" class="brand" aria-label="Eximedical, inicio">
        <img :src="solid ? '/images/logo.png' : '/images/logo-light.png'" alt="Eximedical" width="600" height="218">
      </NuxtLink>

      <nav class="nav" aria-label="Principal">
        <div v-for="item in nav" :key="item.to" class="nav-item" :class="{ 'has-children': item.children }">
          <NuxtLink :to="item.to" class="nav-link">
            {{ item.label }}
            <AppIcon v-if="item.children" name="chevron-down" :size="15" />
          </NuxtLink>
          <div v-if="item.children" class="dropdown">
            <NuxtLink v-for="c in item.children" :key="c.to" :to="c.to">{{ c.label }}</NuxtLink>
          </div>
        </div>
      </nav>

      <div class="nav-actions">
        <button class="icon-btn" aria-label="Buscar productos" @click="searchOpen = true"><AppIcon name="search" :size="20" /></button>
        <button
          :key="`bag-${quote.bump.value}`"
          class="icon-btn cart"
          :class="{ bump: quote.bump.value > 0 }"
          data-quote-target
          :aria-label="`Lista de cotización, ${quote.count.value} productos`"
          @click="quote.open.value = true"
        >
          <AppIcon name="bag" :size="20" />
          <span v-if="quote.count.value" class="badge">{{ quote.count.value }}</span>
        </button>
        <a :href="site.whatsapp" target="_blank" rel="noopener" class="btn nav-cta">Cotizar</a>
        <button class="icon-btn burger" :aria-expanded="menuOpen" aria-label="Abrir menú" @click="menuOpen = !menuOpen">
          <AppIcon :name="menuOpen ? 'x' : 'menu'" :size="24" />
        </button>
      </div>
    </div>

    <div class="progress" :style="{ transform: `scaleX(${progress})` }" />

    <Transition name="drawer">
      <div v-if="menuOpen" class="drawer">
        <nav class="container">
          <template v-for="(item, i) in nav" :key="item.to">
            <NuxtLink :to="item.to" class="drawer-link" :style="{ '--i': i }">{{ item.label }}</NuxtLink>
            <div v-if="item.children" class="drawer-sub">
              <NuxtLink v-for="c in item.children" :key="c.to" :to="c.to">{{ c.label }}</NuxtLink>
            </div>
          </template>
          <a :href="site.whatsapp" target="_blank" rel="noopener" class="btn">
            Cotizar por WhatsApp <AppIcon name="arrow-right" :size="18" />
          </a>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  color: #fff;
  transition: background 0.4s var(--ease), box-shadow 0.4s var(--ease), color 0.4s var(--ease);
}

.header.solid {
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: saturate(160%) blur(16px);
  box-shadow: 0 8px 30px -12px rgba(27, 20, 82, 0.18);
  color: var(--indigo-900);
}

/* Barra superior */
.topbar {
  background: var(--indigo-900);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.85rem;
  max-height: 44px;
  overflow: hidden;
  transition: max-height 0.4s var(--ease), opacity 0.3s;
}

.header:not(.solid) .topbar {
  background: rgba(17, 12, 56, 0.35);
}

.header.scrolled .topbar {
  max-height: 0;
  opacity: 0;
}

.topbar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
}

.topbar-info {
  display: flex;
  gap: 24px;
}

.topbar-info a,
.topbar-socials a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
}

.topbar-info a:hover,
.topbar-socials a:hover {
  color: var(--gold-300);
}

.topbar-socials {
  display: flex;
  gap: 16px;
}

/* Navegación */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-h);
  gap: 24px;
}

.brand img {
  height: 52px;
  width: auto;
  transition: filter 0.4s, height 0.3s var(--ease);
}

.header.scrolled .brand img {
  height: 46px;
}

.nav {
  display: flex;
  gap: 6px;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 0.98rem;
  border-radius: 999px;
  position: relative;
  transition: color 0.2s;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 4px;
  height: 2px;
  border-radius: 2px;
  background: var(--gold-500);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s var(--ease);
}

.nav-link:hover::after,
.nav-link.router-link-exact-active::after {
  transform: scaleX(1);
}

.nav-link:hover {
  color: var(--gold-500);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 240px;
  padding: 10px;
  background: #fff;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
  display: grid;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s var(--ease);
}

.nav-item:hover .dropdown,
.nav-item:focus-within .dropdown {
  opacity: 1;
  visibility: visible;
  transform: none;
}

.dropdown a {
  padding: 10px 14px;
  border-radius: 8px;
  color: var(--ink);
  font-size: 0.95rem;
  transition: background 0.2s, padding 0.25s var(--ease), color 0.2s;
}

.dropdown a:hover {
  background: var(--indigo-100);
  color: var(--indigo-700);
  padding-left: 20px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-btn {
  position: relative;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 0;
  background: transparent;
  color: inherit;
  transition: background 0.2s;
}

.icon-btn:hover {
  background: rgba(127, 120, 200, 0.15);
}

.badge {
  position: absolute;
  top: 4px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--teal-500);
  color: var(--indigo-950);
  font-size: 0.7rem;
  font-weight: 700;
  display: grid;
  place-items: center;
}

/* Rebote del ícono al agregar un producto */
.cart.bump {
  animation: bag-bump 0.6s var(--ease) 0.75s;
}

.cart.bump .badge {
  animation: badge-pop 0.6s var(--ease) 0.75s;
}

@keyframes bag-bump {
  30% { transform: scale(1.25) rotate(-8deg); }
  60% { transform: scale(0.95) rotate(4deg); }
}

@keyframes badge-pop {
  40% { transform: scale(1.6); background: var(--gold-500); }
}

.nav-cta {
  padding: 11px 22px;
  margin-left: 8px;
}

.burger {
  display: none;
}

/* Barra de progreso de lectura */
.progress {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg, var(--gold-500), var(--teal-500));
  transform-origin: left;
}

/* Menú móvil */
.drawer {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: calc(100dvh - var(--header-h));
  background: #fff;
  color: var(--indigo-900);
  overflow-y: auto;
  padding-block: 24px 40px;
}

.drawer nav {
  display: grid;
  gap: 4px;
}

.drawer-link {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 600;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  animation: slide-in 0.5s var(--ease) both;
  animation-delay: calc(var(--i) * 60ms);
}

.drawer-sub {
  display: grid;
  padding: 6px 0 10px 14px;
  color: var(--muted);
}

.drawer-sub a {
  padding: 6px 0;
}

.drawer .btn {
  margin-top: 24px;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s, transform 0.4s var(--ease);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-24px);
  }
}

@media (max-width: 1024px) {
  .nav,
  .nav-cta {
    display: none;
  }

  .burger {
    display: grid;
  }
}

@media (max-width: 640px) {
  .hide-sm {
    display: none !important;
  }

  .brand img {
    height: 42px;
  }

  .header.scrolled .brand img {
    height: 38px;
  }
}
</style>
