// Carga productos y catálogos una vez por visita. En el navegador se reutilizan los datos que envió el servidor.
export default defineNuxtPlugin({
  name: 'shop-data',
  async setup() {
    const { source } = useShop()
    if (!source.value) await loadShopData()
  }
})
