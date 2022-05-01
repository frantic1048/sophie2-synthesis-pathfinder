import {
  categoryIdToName,
  data,
  isCategoryId,
  isSynthesizableItem,
  Sophie2EdgeType,
  Sophie2ItemType,
  synthesizableItems,
} from './fixtures/ItemData'
import CytoscapeComponent from 'react-cytoscapejs'
import Cytoscape from 'cytoscape'
import coseBilkent from 'cytoscape-cose-bilkent'
import React from 'react'

Cytoscape.use(coseBilkent)

const layout = {
  name: 'cose-bilkent',
  animate: false,
  fit: true,
  nodeDimensionsIncludeLabels: true,
  randomize: true,
  edgeElasticity: 0.1, // 0.45,
  gravityRange: 5, // 3.8
}
const style: React.CSSProperties = {
  width: '100%',
  height: '500px',
}
const stylesheet: Cytoscape.Stylesheet[] = [
  {
    selector: 'node',
    style: {
      'background-color': '#666',
      label: 'data(id)',
      shape: 'round-octagon',
    },
  },
  {
    selector: 'edge',
    style: {
      width: 3,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
      // MEMO: default 'haystack' curve style does not support arrow!!!
      'curve-style': 'bezier',
    },
  },
  {
    selector: '.main-item',
    style: {
      'background-color': '#ff6ea2',
      shape: 'star',
      width: 50,
      height: 50,
    },
  },
  {
    selector: '.category-item',
    style: {
      'background-color': '#308536',
      shape: 'round-diamond',
    },
  },
  {
    selector: '.main-edge',
    style: {
      width: 7,
      'line-color': '#ABE3FF',
      'target-arrow-color': '#ABE3FF',
    },
  },
]

const collectItemAndEdges: (prop: {
  itemId: Sophie2ItemType['id']
  expandCategory?: boolean
}) => [items: Sophie2ItemType[], edges: Sophie2EdgeType[]] = ({
  itemId,
  /**
   * if an ingredient is catogory, expand it to synthesizable items
   */
  expandCategory = false,
}) => {
  const items: Sophie2ItemType[] = []
  const edges: Sophie2EdgeType[] = []

  // collect related item and edges
  const itemCheckList: string[] = [itemId]
  let itemCheckIndex = 0
  const categoryCheckList: string[] = []
  let categoryCheckIndex = 0
  const expandedItemCheckList: string[] = []
  let expandedItemCheckListIndex = 0
  while (
    itemCheckIndex < itemCheckList.length ||
    categoryCheckIndex < categoryCheckList.length ||
    expandedItemCheckListIndex < expandedItemCheckList.length
  ) {
    if (itemCheckIndex < itemCheckList.length) {
      const itemId = itemCheckList[itemCheckIndex]
      items.push(data.items[itemId])
      ++itemCheckIndex
      // find edges start with itemId
      for (const edge of Object.values(data.edges)) {
        if (edge.source === itemId) {
          edges.push(edge)
          if (edge.hasCategory && !categoryCheckList.includes(edge.target)) {
            categoryCheckList.push(edge.target)
          }
          if (!edge.hasCategory && !itemCheckList.includes(edge.target)) {
            itemCheckList.push(edge.target)
          }
        }
      }
    }

    if (categoryCheckIndex < categoryCheckList.length) {
      const categoryId = categoryCheckList[categoryCheckIndex]
      items.push(data.items[categoryId])
      ++categoryCheckIndex

      if (expandCategory) {
        const category = categoryIdToName(categoryId)
        for (const item of synthesizableItems) {
          if (
            item.categoryList.includes(category) &&
            !itemCheckList.includes(item.id) &&
            !expandedItemCheckList.includes(item.id)
          ) {
            expandedItemCheckList.push(item.id)
            edges.push({
              id: `edge__${categoryId}__${item.id}`,
              source: categoryId,
              target: item.id,
            })
          }
        }
      }
    }

    if (expandedItemCheckListIndex < expandedItemCheckList.length) {
      const itemId = expandedItemCheckList[expandedItemCheckListIndex]
      items.push(data.items[itemId])
      ++expandedItemCheckListIndex
      // similar to item checklist, but ignore unsynthesizable ingredients, to reduce graph complexity
      for (const edge of Object.values(data.edges)) {
        if (edge.source === itemId && isSynthesizableItem(edge.target) && !edges.some((e) => e.id === edge.id)) {
          edges.push(edge)
          if (!itemCheckList.includes(edge.target) && !expandedItemCheckList.includes(edge.target)) {
            expandedItemCheckList.push(edge.target)
          }
        }
      }
    }
  }

  return [items, edges]
}

export const ItemSynthesisGraph: React.FC<{ item: Sophie2ItemType }> = ({ item }) => {
  const [items, edges] = collectItemAndEdges({ itemId: item.id, expandCategory: true })
  const elements: Cytoscape.ElementDefinition[] = [
    ...items.map(({ id, name }) => ({
      data: { id, label: name },
      classes: [id === item.id && 'main-item', isCategoryId(id) && 'category-item'].filter(Boolean).join(' '),
    })),
    ...edges.map(({ source, target }) => ({
      data: {
        source,
        target,
      },
      classes: source === item.id ? 'main-edge' : undefined,
    })),
  ]

  return (
    <div
      style={{
        border: '1px solid brown',
        marginBottom: '1em',
        marginRight: '1em',
        width: '100%',
        display: 'block',
      }}
    >
      <p style={{ paddingLeft: '1em' }}>
        {item.name}, {item.kind}, [{item.categoryList.join(',')}]
      </p>
      <CytoscapeComponent elements={elements} layout={layout} style={style} stylesheet={stylesheet} />
    </div>
  )
}
