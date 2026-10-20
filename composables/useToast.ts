export interface Toast {
  id: number
  type: 'success' | 'error' | 'info'
  text: string
}

/** Avisos cortos que aparecen en la esquina del panel */
export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])

  const dismiss = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const show = (text: string, type: Toast['type'] = 'success') => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, type, text })
    setTimeout(() => dismiss(id), type === 'error' ? 6000 : 3500)
  }

  return {
    toasts,
    dismiss,
    success: (t: string) => show(t, 'success'),
    error: (t: string) => show(t, 'error'),
    info: (t: string) => show(t, 'info')
  }
}
