import { data as raw } from './RawItemData'

export type Sophie2ItemType = {
  id: string
  name: string
  kind: string // TODO: enum
  categoryList: string[] // TODO: enum
  isCategory: boolean
  isSynthesizable: boolean
}
export type Sophie2EdgeType = {
  id: string
  source: string // ItemType.id
  target: string // ItemType.id
  hasCategory?: boolean // is target category
}

export type Sophie2TraitType = {
  id: string
  name: string
  grade: number
}
export type Sophie2TraitEdgeType = {
  id: string
  source: string
  target: string
}

// see cook_sophie2_data.py
type Sophie2Data = {
  items: { [key: string]: Sophie2ItemType }
  edges: { [key: string]: Sophie2EdgeType }
  traits: { [key: string]: Sophie2TraitType }
  traitEdges: { [key: string]: Sophie2TraitEdgeType }
}

export const data: Sophie2Data = JSON.parse(raw)

export const synthesizableItems = Object.values(data.items).filter(({ isSynthesizable }) => isSynthesizable)
export const traits = Object.values(data.traits)
export const maxTraitGrade = Math.max(...traits.map((t) => t.grade))
export const minTraitGrade = Math.min(...traits.map((t) => t.grade))
export const traitGradeToColor: (grade: number) => string = (grade) => {
  const [maxH, maxS, maxL] = [360, 86, 50] // deg, percent, percent
  const [minH, minS, minL] = [106, 20, 16]
  const ratio = (grade - minTraitGrade) / (maxTraitGrade - minTraitGrade)
  const [h, s, l] = [minH + ratio * (maxH - minH), minS + ratio * (maxS - minS), minL + ratio * (maxL - minL)]
  const result = `hsl(${h},${s}%,${l}%)`

  return result
}
export const getTraitGrade = (traitId: string) => data.traits[traitId]?.grade ?? minTraitGrade

// category id: (uni), in Sophie2ItemType.id
// category name: uni, in Sophie2ItemType.categoryList
export const categoryIdToName = (categoryId: string): string => categoryId.replace(/^\(/, '').replace(/\)$/, '')

export const isSynthesizableItem = (itemId: string): boolean => !!data.items[itemId]?.isSynthesizable
export const isCategoryId = (itemId: string): boolean => itemId.startsWith('(')

// data does not contain category -> () edges
// sometimes we want to make such edges
export const makeEdge = ({ source, target }: { source: string; target: string }) => ({
  id: `edge__${source}__${target}`,
  source,
  target,
})
