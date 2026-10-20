<script setup lang="ts">
import '~/assets/css/admin.css'

const auth = useAdminAuth()
const route = useRoute()
const { toasts, dismiss } = useToast()
const menuOpen = ref(false)

const nav = [
  { to: '/admin', label: 'Resumen', icon: 'trending-up' },
  { to: '/admin/productos', label: 'Productos', icon: 'package' },
  { to: '/admin/catalogos', label: 'Catálogos', icon: 'file-text' }
]

const title = computed(() => nav.find(n => n.to === route.path)?.label ?? 'Panel')
watch(() => route.path, () => (menuOpen.value = false))

useHead({ title: () => `${title.value} · Admin Eximedical`, bodyAttrs: { class: 'admin-body' } })
</script>

<template>
  <div class="admin" :class="{ 'menu-open': menuOpen }">
    <aside class="sidebar">
      <NuxtLink to="/admin" class="brand">
        <img src="/images/logo-light.png" alt="Eximedical" width="600" height="218">
        <span>Panel de administración</span>
      </NuxtLink>

      <nav aria-label="Panel">
        <p class="group">Gestión</p>
        <NuxtLink
          v-for="n in nav"
          :key="n.to"
          :to="n.to"
          class="link"
          :class="{ active: route.path === n.to }"
        >
          <AppIcon :name="n.icon" :size="19" /> {{ n.label }}
        </NuxtLink>

        <p class="group">Sitio web</p>
        <a href="/" target="_blank" class="link"><AppIcon name="external" :size="19" /> Ver sitio</a>
        <a href="/tienda" target="_blank" class="link"><AppIcon name="bag" :size="19" /> Ver tienda</a>
        <a href="/catalogo" target="_blank" class="link"><AppIcon name="globe" :size="19" /> Ver catálogos</a>
      </nav>

      <div class="account">
        <span class="avatar">{{ auth.user.value?.email?.[0]?.toUpperCase() ?? 'A' }}</span>
        <div class="who">
          <strong>{{ auth.user.value?.name || 'Administrador' }}</strong>
          <small>{{ auth.user.value?.email }}</small>
        </div>
        <button class="logout" aria-label="Cerrar sesión" title="Cerrar sesión" @click="auth.logout()">
          <AppIcon name="arrow-right" :size="18" />
        </button>
      </div>
    </aside>

    <div class="scrim" @click="menuOpen = false" />

    <div class="content">
      <header class="topbar">
        <button class="burger" aria-label="Abrir menú" @click="menuOpen = !menuOpen"><AppIcon name="menu" :size="22" /></button>
        <h1>{{ title }}</h1>
      </header>
      <main>
        <slot />
      </main>
    </div>

    <div class="toasts" aria-live="polite">
      <TransitionGroup name="toast">
        <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type" @click="dismiss(t.id)">
          <AppIcon :name="t.type === 'error' ? 'x' : t.type === 'info' ? 'message' : 'check'" :size="18" />
          <span>{{ t.text }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.admin {
  --side-w: 260px;
  min-height: 100vh;
  background: var(--bg);
}

/* ---- Menú lateral ---- */
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 30;
  width: var(--side-w);
  display: flex;
  flex-direction: column;
  padding: 22px 16px;
  background:
    radial-gradient(80% 40% at 0% 0%, rgba(47, 208, 212, 0.18), transparent 70%),
    linear-gradient(180deg, var(--indigo-900), var(--indigo-950));
  color: rgba(255, 255, 255, 0.75);
  transition: transform 0.35s var(--ease);
}

.brand {
  display: grid;
  gap: 6px;
  padding: 4px 10px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand img {
  width: 150px;
  height: auto;
}

.brand span {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold-300);
}

nav {
  flex: 1;
  display: grid;
  align-content: start;
  gap: 4px;
  padding-top: 14px;
}

.group {
  margin: 14px 12px 6px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}

.link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 12px;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}

.link:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.link.active {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.link.active::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 8px;
  bottom: 8px;
  width: 4px;
  border-radius: 0 4px 4px 0;
  background: linear-gradient(var(--gold-500), var(--teal-500));
}

.link.active .icon {
  color: var(--gold-300);
}

.account {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
}

.avatar {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold-300), var(--gold-500));
  color: var(--indigo-950);
  font-weight: 700;
}

.who {
  flex: 1;
  min-width: 0;
}

.who strong {
  display: block;
  color: #fff;
  font-size: 0.9rem;
}

.who small {
  display: block;
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 0;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  transition: background 0.2s;
}

.logout:hover {
  background: #d03c3c;
}

/* ---- Contenido ---- */
.content {
  margin-left: var(--side-w);
  min-height: 100vh;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 68px;
  padding: 0 32px;
  background: rgba(245, 246, 251, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}

.topbar h1 {
  font-size: 1.35rem;
  color: var(--indigo-900);
}

.burger {
  display: none;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--indigo-900);
}

main {
  padding: 28px 32px 60px;
  max-width: 1300px;
}

.scrim {
  display: none;
}

/* ---- Avisos ---- */
.toasts {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 200;
  display: grid;
  gap: 10px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 260px;
  max-width: 380px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff;
  color: var(--ink);
  box-shadow: var(--shadow-lg);
  border-left: 4px solid #25d366;
  cursor: pointer;
  font-size: 0.93rem;
}

.toast .icon {
  flex-shrink: 0;
  color: #17915a;
}

.toast.error {
  border-left-color: #d03c3c;
}

.toast.error .icon {
  color: #d03c3c;
}

.toast.info {
  border-left-color: var(--indigo-500);
}

.toast.info .icon {
  color: var(--indigo-500);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s, transform 0.35s var(--ease);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

@media (max-width: 960px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .menu-open .sidebar {
    transform: none;
  }

  .menu-open .scrim {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 25;
    background: rgba(17, 12, 56, 0.5);
  }

  .content {
    margin-left: 0;
  }

  .burger {
    display: grid;
  }

  .topbar,
  main {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
