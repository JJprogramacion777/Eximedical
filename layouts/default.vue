<template>
  <div class="layout">
    <SiteHeader />
    <main>
      <slot />
    </main>
    <SiteFooter />
    <FloatingActions />
    <QuoteDrawer />
    <SiteSearch />
  </div>
</template>
