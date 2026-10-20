<script setup lang="ts">
const items = [
  '¡Garantizamos tecnología confiable y un servicio eficiente!',
  'Equipos médicos',
  'Mobiliario hospitalario',
  'Instrumental quirúrgico',
  'Descartables',
  'Modelos anatómicos'
]
</script>

<template>
  <div class="marquee" aria-label="Garantizamos tecnología confiable y un servicio eficiente">
    <div class="track" aria-hidden="true">
      <template v-for="copy in 2" :key="copy">
        <span v-for="item in items" :key="`${copy}-${item}`" class="item">
          {{ item }} <i>✦</i>
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  background: var(--gold-500);
  color: var(--indigo-950);
  overflow: hidden;
  padding: 18px 0 22px;
  margin-top: -1px;
}

.track {
  display: flex;
  width: max-content;
  animation: scroll 40s linear infinite;
}

.marquee:hover .track {
  animation-play-state: paused;
}

.item {
  display: inline-flex;
  align-items: center;
  gap: 28px;
  padding-right: 28px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(1.1rem, 2vw, 1.45rem);
  white-space: nowrap;
}

.item:first-child,
.item:nth-child(7) {
  font-style: italic;
}

.item i {
  font-style: normal;
  color: var(--indigo-700);
}

@keyframes scroll {
  to { transform: translateX(-50%); }
}
</style>
