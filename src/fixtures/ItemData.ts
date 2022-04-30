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
  hasCategory: boolean
}

// see cook_sophie2_data.py
type Sophie2Data = {
  items: { [key in string]: Sophie2ItemType }
  edges: { [key in string]: Sophie2EdgeType }
}

export const data: Sophie2Data = JSON.parse(raw)
