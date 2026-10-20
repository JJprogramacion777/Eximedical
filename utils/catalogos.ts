// Catálogos PDF. Se administran desde /admin (base de datos PostgreSQL);
// si no, se usan los datos locales de data/catalogos.json (archivos en /public/catalogos).
import catalogosJson from '~/data/catalogos.json'

export type GrupoCatalogo = 'Equipamiento' | 'Insumos' | 'Especialidades'
export const gruposCatalogo: GrupoCatalogo[] = ['Equipamiento', 'Insumos', 'Especialidades']

export interface Catalogo {
  id?: number
  slug: string
  title: string
  description: string
  img: string
  pdf: string
  size: string
  group: GrupoCatalogo
  featured?: boolean
  active?: boolean
  sort?: number
}

export const catalogosLocales = catalogosJson as Catalogo[]
