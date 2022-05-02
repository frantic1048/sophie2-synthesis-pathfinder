import { data, isCategoryId, isSynthesizableItem, Sophie2EdgeType, Sophie2ItemType } from './fixtures/ItemData'
import CytoscapeComponent from 'react-cytoscapejs'
import Cytoscape from 'cytoscape'
import coseBilkent from 'cytoscape-cose-bilkent'
import React from 'react'
import { style } from 'typestyle'

Cytoscape.use(coseBilkent)

const layout = {
  // FIXME: readable layout......
  name: 'breadthfirst',
  animate: false,
  fit: true,
  nodeDimensionsIncludeLabels: true,
  circle: true,
}

const wrapperClassName = style({
  position: 'relative',
  height: '98%',
})
const cystyle: React.CSSProperties = {
  width: '100%',
  height: 'max(800px, calc(100% - 5em))',
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
      for (const edge of Object.values(data.edges).filter((e) => e.source === itemId)) {
        edges.push(edge)
        if (edge.hasCategory && !categoryCheckList.includes(edge.target)) {
          categoryCheckList.push(edge.target)
        }
        if (!edge.hasCategory && !itemCheckList.includes(edge.target)) {
          itemCheckList.push(edge.target)
        }
      }
    }

    if (categoryCheckIndex < categoryCheckList.length) {
      const categoryId = categoryCheckList[categoryCheckIndex]
      items.push(data.items[categoryId])
      ++categoryCheckIndex

      if (expandCategory) {
        // const category = categoryIdToName(categoryId)
        for (const edge of Object.values(data.edges).filter(
          (e) => e.source === categoryId && isSynthesizableItem(e.target),
        )) {
          edges.push(edge)
          if (!itemCheckList.includes(edge.target) && !expandedItemCheckList.includes(edge.target)) {
            expandedItemCheckList.push(edge.target)
          }
        }
      }
    }

    if (expandedItemCheckListIndex < expandedItemCheckList.length) {
      const itemId = expandedItemCheckList[expandedItemCheckListIndex]
      items.push(data.items[itemId])
      ++expandedItemCheckListIndex
      // similar to item checklist, but ignore unsynthesizable ingredients, to reduce graph complexity
      for (const edge of Object.values(data.edges).filter((e) => e.source === itemId)) {
        if (isSynthesizableItem(edge.target)) {
          if (!edges.some((e) => e.id === edge.id)) {
            edges.push(edge)
          }
          if (!itemCheckList.includes(edge.target) && !expandedItemCheckList.includes(edge.target)) {
            expandedItemCheckList.push(edge.target)
          }
        } else if (isCategoryId(edge.target)) {
          if (!edges.some((e) => e.id === edge.id)) {
            edges.push(edge)
          }
          if (!categoryCheckList.includes(edge.target)) {
            categoryCheckList.push(edge.target)
          }
        }
      }
    }
  }

  return [items, edges]
}

export const ItemSynthesisGraph: React.FC<{ itemId: Sophie2ItemType['id'] }> = ({ itemId }) => {
  const item = data.items[itemId]

  const cy = React.useRef<Cytoscape.Core>()
  const handleCyRef = React.useCallback<(cy: Cytoscape.Core) => void>((_cy) => (cy.current = _cy), [])
  React.useEffect(() => {
    if (cy.current) {
      cy.current.layout(layout).run()
    }
  }, [itemId])
  const baseElements = React.useMemo(() => collectItemAndEdges({ itemId, expandCategory: true }), [itemId])

  const elements = React.useMemo<Cytoscape.ElementDefinition[]>(() => {
    const [items, edges] = baseElements
    return [
      ...items.map(({ id, name }) => ({
        data: { id, label: name },
        classes: [id === itemId && 'main-item', isCategoryId(id) && 'category-item'].filter(Boolean).join(' '),
      })),
      ...edges.map(({ source, target }) => ({
        data: {
          source,
          target,
        },
        classes: source === itemId ? 'main-edge' : undefined,
      })),
    ]
  }, [baseElements])

  return (
    <div className={wrapperClassName}>
      <p style={{ paddingLeft: '1em' }}>
        {item.name}, {item.kind}, [{item.categoryList.join(',')}]
      </p>
      <CytoscapeComponent
        cy={handleCyRef}
        elements={elements}
        layout={layout}
        style={cystyle}
        stylesheet={stylesheet}
        userZoomingEnabled={true}
        maxZoom={1.5}
        minZoom={0.2}
      />
    </div>
  )
}
