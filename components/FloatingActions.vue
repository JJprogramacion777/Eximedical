<script setup lang="ts">
const { site } = useAppConfig()

const progress = ref(0)
const showTop = ref(false)
const showTip = ref(false)

const onScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? window.scrollY / max : 0
  showTop.value = window.scrollY > 600
}

let tipTimer: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  // El mensaje de ayuda aparece unos segundos después de cargar
  tipTimer = setTimeout(() => (showTip.value = true), 4000)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  clearTimeout(tipTimer)
})

const CIRC = 2 * Math.PI * 22
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
  <div class="floating">
    <Transition name="pop">
      <button v-if="showTop" class="to-top" aria-label="Volver arriba" @click="toTop">
        <svg viewBox="0 0 50 50" class="progress-ring" aria-hidden="true">
          <circle cx="25" cy="25" r="22" class="track" />
          <circle
            cx="25"
            cy="25"
            r="22"
            class="ring"
            :stroke-dasharray="CIRC"
            :stroke-dashoffset="CIRC * (1 - progress)"
          />
        </svg>
        <AppIcon name="chevron-up" :size="20" />
      </button>
    </Transition>

    <div class="wa-wrap">
      <Transition name="tip">
        <div v-if="showTip" class="tip">
          <button class="tip-close" aria-label="Cerrar" @click="showTip = false"><AppIcon name="x" :size="14" /></button>
          <strong>¿Necesitas ayuda?</strong>
          <span>Escríbenos, te respondemos enseguida.</span>
        </div>
      </Transition>
      <a :href="site.whatsapp" target="_blank" rel="noopener" class="wa" aria-label="Escríbenos por WhatsApp">
        <AppIcon name="whatsapp" :size="30" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.floating {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 40;
  display: grid;
  justify-items: end;
  gap: 14px;
}

.wa-wrap {
  position: relative;
}

.wa {
  position: relative;
  display: grid;
  place-items: center;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: #25d366;
  color: #fff;
  box-shadow: 0 12px 30px -8px rgba(37, 211, 102, 0.7);
  transition: transform 0.3s var(--ease);
}

.wa::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #25d366;
  z-index: -1;
  animation: ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.wa:hover {
  transform: scale(1.1) rotate(-8deg);
}

@keyframes ping {
  75%,
  100% {
    transform: scale(1.7);
    opacity: 0;
  }
}

.tip {
  position: absolute;
  right: 76px;
  bottom: 6px;
  width: 230px;
  padding: 14px 16px;
  border-radius: 14px 14px 4px 14px;
  background: #fff;
  box-shadow: var(--shadow);
  font-size: 0.9rem;
  color: var(--muted);
}

.tip strong {
  display: block;
  color: var(--indigo-900);
  font-family: var(--font-display);
}

.tip-close {
  position: absolute;
  top: 8px;
  right: 8px;
  border: 0;
  background: none;
  color: var(--muted);
  padding: 2px;
}

.to-top {
  position: relative;
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border: 0;
  border-radius: 50%;
  background: #fff;
  color: var(--indigo-700);
  box-shadow: var(--shadow);
  margin-right: 6px;
  transition: transform 0.3s var(--ease);
}

.to-top:hover {
  transform: translateY(-4px);
}

.progress-ring {
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);
}

.to-top circle {
  fill: none;
  stroke-width: 3;
}

.track {
  stroke: var(--indigo-100);
}

.ring {
  stroke: var(--gold-500);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.1s linear;
}

.pop-enter-active,
.pop-leave-active,
.tip-enter-active,
.tip-leave-active {
  transition: opacity 0.3s, transform 0.4s var(--ease);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.tip-enter-from,
.tip-leave-to {
  opacity: 0;
  transform: translateX(16px) scale(0.95);
}

@media (max-width: 560px) {
  .floating {
    right: 16px;
    bottom: 16px;
  }

  .tip {
    width: 200px;
  }
}
</style>
