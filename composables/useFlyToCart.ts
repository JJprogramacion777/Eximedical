// Animación: una copia de la imagen del producto "vuela" hasta el ícono de cotización del header
export const useFlyToCart = () => {
  return (source?: HTMLElement | null) => {
    if (!import.meta.client || !source) return
    const target = document.querySelector<HTMLElement>('[data-quote-target]')
    if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const from = source.getBoundingClientRect()
    const to = target.getBoundingClientRect()
    const clone = source.cloneNode(true) as HTMLElement
    Object.assign(clone.style, {
      position: 'fixed',
      left: `${from.left}px`,
      top: `${from.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
      margin: '0',
      zIndex: '200',
      borderRadius: '16px',
      objectFit: 'contain',
      background: '#fff',
      boxShadow: '0 20px 50px -10px rgba(27, 20, 82, 0.5)',
      pointerEvents: 'none'
    })
    document.body.appendChild(clone)

    const dx = to.left + to.width / 2 - (from.left + from.width / 2)
    const dy = to.top + to.height / 2 - (from.top + from.height / 2)
    const anim = clone.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${dx * 0.5}px, ${dy - 80}px) scale(0.45)`, opacity: 0.9, offset: 0.6 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.08)`, opacity: 0.3 }
      ],
      { duration: 850, easing: 'cubic-bezier(0.5, 0, 0.3, 1)' }
    )
    anim.onfinish = () => clone.remove()
    // Seguridad por si la animación no termina (pestaña en segundo plano)
    setTimeout(() => clone.remove(), 1500)
  }
}
