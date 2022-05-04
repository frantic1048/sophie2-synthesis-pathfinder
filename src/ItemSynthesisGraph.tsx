import { data, isCategoryId, isSynthesizableItem, Sophie2EdgeType, Sophie2ItemType } from './fixtures/ItemData'
import CytoscapeComponent from 'react-cytoscapejs'
import Cytoscape from 'cytoscape'
import React from 'react'
import { style } from 'typestyle'
import { baseGraphEdgeColor } from './colors'
import coseBikent from 'cytoscape-cose-bilkent'
import { useNavigate } from 'react-router-dom'
Cytoscape.use(coseBikent)

const layout = {
  name: 'cose-bilkent',
  quality: 'proof',
  animate: false,
  fit: true,
  nodeDimensionsIncludeLabels: true,
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
    // these elements is needed for computing paths
    selector: '.hidden',
    style: { display: 'none' },
  },
  {
    selector: 'node',
    style: {
      'background-color': '#AD9782',
      label: 'data(id)',
      shape: 'round-octagon',
      width: 10,
      height: 10,

      'background-opacity': 0.8,
      'border-style': 'dotted',
      'border-color': '#9F856C',
      'border-width': 1,
    },
  },
  {
    selector: 'edge',
    style: {
      width: 3,
      'line-color': baseGraphEdgeColor.toHexString(),
      'line-opacity': 0.6,
      'source-arrow-color': baseGraphEdgeColor.toHexString(),
      'source-arrow-shape': 'triangle',
      // MEMO: default 'haystack' curve style does not support arrow!!!
      'curve-style': 'bezier',
    },
  },
  {
    selector: 'node.category-item',
    style: {
      'background-opacity': 0,
      shape: 'barrel',
      'border-style': 'dashed',
      'border-color': '#9F856C',
      'border-width': 2,
      width: 15,
      height: 15,
    },
  },
  {
    selector: 'node.synthesizable',
    style: {
      backgroundColor: '#9F856C',
      'border-width': 0,
      'background-opacity': 0.8,
      width: 30,
      height: 30,
    },
  },
  {
    selector: 'node.active',
    style: {
      'background-color': '#FDEB56',
      'background-opacity': 0.9,
      'border-width': 0,
      shape: 'star',
      width: 50,
      height: 50,
    },
  },
  {
    selector: '.loop',
    style: { display: 'element' },
  },
  {
    selector: 'edge.loop',
    style: {
      'line-color': '#9DBD69',
      'source-arrow-color': '#9DBD69',
      'line-opacity': 0.7,
    },
  },
]

type CollectedItemType = Sophie2ItemType & { isExpanded?: boolean }
type CollectedEdgeType = Sophie2EdgeType & { isExpanded?: boolean }
const collectItemAndEdges: (prop: {
  itemId: Sophie2ItemType['id']
  expandCategory?: boolean
}) => [items: CollectedItemType[], edges: CollectedEdgeType[]] = ({
  itemId,
  /**
   * if an ingredient is catogory, expand it to synthesizable items
   */
  expandCategory = false,
}) => {
  const items: CollectedItemType[] = []
  const edges: CollectedEdgeType[] = []

  // collect related item and edges
  const itemCheckList: string[] = [itemId]
  let itemCheckIndex = 0
  const categoryCheckList: Array<[string, { isExpanded: boolean }]> = []
  let categoryCheckIndex = 0
  const expandedItemCheckList: string[] = []
  let expandedItemCheckListIndex = 0
  const addItemToCheck = (itemId: string) =>
    !itemCheckList.includes(itemId) && !expandedItemCheckList.includes(itemId) && itemCheckList.push(itemId)
  const addExpandedItemToCheck = (itemId: string) =>
    !itemCheckList.includes(itemId) && !expandedItemCheckList.includes(itemId) && expandedItemCheckList.push(itemId)
  const addCategoryToCheck = ([categoryId, opt]: [string, { isExpanded: boolean }]) =>
    !categoryCheckList.some(([c]) => c === categoryId) && categoryCheckList.push([categoryId, opt])

  while (
    itemCheckIndex < itemCheckList.length ||
    categoryCheckIndex < categoryCheckList.length ||
    expandedItemCheckListIndex < expandedItemCheckList.length
  ) {
    if (itemCheckIndex < itemCheckList.length) {
      const itemId = itemCheckList[itemCheckIndex]
      items.push({ ...data.items[itemId], isExpanded: false })
      ++itemCheckIndex
      // find edges start with itemId
      for (const edge of Object.values(data.edges).filter((e) => e.source === itemId)) {
        edges.push(edge)
        if (edge.hasCategory) {
          addCategoryToCheck([edge.target, { isExpanded: false }])
        }
        if (!edge.hasCategory) {
          addItemToCheck(edge.target)
        }
      }
      // NOTE: this is required.
      // it's possible we first met an item as expandedItem (in expandedItemList), then normal item(ignored)
      // but that item should be `isExpanded=false` (display normally) in this case.
      // we eagerly consume itemCheckList thus such an item is first visited as normal item(in itemCheckList).
      continue
    }

    if (categoryCheckIndex < categoryCheckList.length) {
      const [categoryId, { isExpanded }] = categoryCheckList[categoryCheckIndex]
      items.push({ ...data.items[categoryId], isExpanded })
      ++categoryCheckIndex

      if (expandCategory) {
        // const category = categoryIdToName(categoryId)
        for (const edge of Object.values(data.edges).filter(
          (e) => e.source === categoryId && isSynthesizableItem(e.target),
        )) {
          edges.push({ ...edge, isExpanded })
          addExpandedItemToCheck(edge.target)
        }
      }
    }

    if (expandedItemCheckListIndex < expandedItemCheckList.length) {
      const itemId = expandedItemCheckList[expandedItemCheckListIndex]
      items.push({ ...data.items[itemId], isExpanded: true })
      ++expandedItemCheckListIndex
      // similar to item checklist, but ignore unsynthesizable ingredients, to reduce graph complexity
      for (const edge of Object.values(data.edges).filter((e) => e.source === itemId)) {
        if (isSynthesizableItem(edge.target)) {
          if (!edges.some((e) => e.id === edge.id)) {
            edges.push({ ...edge, isExpanded: true })
          }
          addExpandedItemToCheck(edge.target)
        } else if (isCategoryId(edge.target)) {
          if (!edges.some((e) => e.id === edge.id)) {
            edges.push({ ...edge, isExpanded: true })
          }

          addCategoryToCheck([edge.target, { isExpanded: true }])
        }
      }
    }
  }

  return [items, edges]
}

export const ItemSynthesisGraph: React.FC<{ itemId: Sophie2ItemType['id'] }> = ({ itemId }) => {
  const item = data.items[itemId]

  const goto = useNavigate()

  const cy = React.useRef<Cytoscape.Core>()
  const handleCyRef = React.useCallback<(cy: Cytoscape.Core) => void>((_cy) => (cy.current = _cy), [])

  const elements = React.useMemo<Cytoscape.ElementDefinition[]>(() => {
    const [items, edges] = collectItemAndEdges({ itemId, expandCategory: true })
    return [
      ...items.map(({ id, name, isExpanded, isSynthesizable, isCategory }) => ({
        data: { id, label: name, isExpanded, isSynthesizable, isCategory },
      })),
      ...edges.map(({ source, target, isExpanded }) => ({ data: { source, target, isExpanded } })),
    ]
  }, [itemId])

  React.useEffect(() => {
    if (cy.current) {
      const selectedNode = cy.current.$(`node#${itemId}`)
      const categoryNodes = cy.current.$(`node[id ^= "("]`)
      const expandedEles = cy.current.$('[?isExpanded]')
      const synthesizableNodes = cy.current.$('node[?isSynthesizable]')

      const oldHiddenEles = cy.current.$('.hidden')
      const oldActiveEls = cy.current.$('.active')
      const oldLoopEls = cy.current.$('.loop')

      const handleClickSynthesizableNode = (e) => {
        const node = e.target
        if (node.id() !== itemId) {
          goto(`/item/${node.id()}`)
        }
      }
      synthesizableNodes.on('click', handleClickSynthesizableNode)

      cy.current.startBatch()

      // reset status
      oldHiddenEles.removeClass('hidden')
      oldActiveEls.removeClass('active')
      oldLoopEls.removeClass('loop')

      selectedNode.addClass('active')
      categoryNodes.addClass('category-item')
      expandedEles.addClass('hidden')
      synthesizableNodes.addClass('synthesizable')

      const edgeToSelectedNode = cy.current.edges(`[target = "${itemId}"]`)
      const djk = cy.current.elements().dijkstra({ root: selectedNode, directed: true })
      edgeToSelectedNode.forEach((ele) => {
        const target = ele.source()
        const path = djk.pathTo(target)
        const distance = djk.distanceTo(target)
        if (Number.isFinite(distance)) {
          ele.addClass('loop')
          ele.source().addClass('loop')
          path.addClass('loop')
        }
      })

      const edgeFromSelectedNode = cy.current
        .edges(`[source = "${itemId}"]`)
        .filter((ele) => ele.target().data('isSynthesizable') || ele.target().data('isCategory'))
      edgeFromSelectedNode.forEach((ele) => {
        const root = ele.target()
        const djk = cy.current?.elements().dijkstra({ root, directed: true })
        const path = djk?.pathTo(selectedNode)
        const distance = djk?.distanceTo(selectedNode)
        if (Number.isFinite(distance)) {
          ele.addClass('loop')
          path?.addClass('loop')
        }
      })

      cy.current.endBatch()

      cy.current.$(':visible').layout(layout).run()

      return () => {
        synthesizableNodes.off('click', undefined, handleClickSynthesizableNode)
      }
    }
  }, [elements])

  return (
    <div className={wrapperClassName}>
      <p style={{ paddingLeft: '1em' }}>
        {item.name}, {item.kind}, [{item.categoryList.join(',')}]
      </p>
      <CytoscapeComponent
        cy={handleCyRef}
        elements={elements}
        layout={{ name: 'null' }}
        style={cystyle}
        stylesheet={stylesheet}
        userZoomingEnabled={true}
        maxZoom={1.5}
        minZoom={0.2}
      />
    </div>
  )
}
