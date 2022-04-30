import { data, Sophie2EdgeType, Sophie2ItemType } from './fixtures/ItemData'
import React from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import Cytoscape from 'cytoscape'
import coseBilkent from 'cytoscape-cose-bilkent'

Cytoscape.use(coseBilkent)

const synthesizableItems = Object.values(data.items).filter(({ isSynthesizable }) => isSynthesizable)

const layout = {
  name: 'cose-bilkent',
  animate: false,
  fit: true,
  nodeDimensionsIncludeLabels: true,
  randomize: true,
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
    },
  },
  {
    selector: 'edge',
    style: {
      width: 3,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
      // MEMO: default 'haystack' curve style does not support arrow
      'curve-style': 'bezier',
    },
  },
  {
    selector: '.main-item',
    style: {
      'background-color': '#ff75a7',
    },
  },
]
const collectItemAndEdges: (item: Sophie2ItemType) => [items: Sophie2ItemType[], edges: Sophie2EdgeType[]] = (item) => {
  const items: Sophie2ItemType[] = []
  const edges: Sophie2EdgeType[] = []

  // collect related item and edges
  const itemCheckList: string[] = [item.id]
  let itemCheckIndex = 0
  while (itemCheckIndex <= itemCheckList.length - 1) {
    const itemId = itemCheckList[itemCheckIndex]
    items.push(data.items[itemId])
    ++itemCheckIndex

    // find edges start with itemId
    for (const edge of Object.values(data.edges)) {
      if (edge.source === itemId) {
        edges.push(edge)
        if (edge.hasCategory && !items.some((item) => item.id === edge.target)) {
          items.push(data.items[edge.target])
        }
        if (!edge.hasCategory && !itemCheckList.includes(edge.target)) {
          itemCheckList.push(edge.target)
        }
      }
    }
  }

  return [items, edges]
}
const ItemSynthesisGraph: React.FC<{ item: Sophie2ItemType }> = ({ item }) => {
  const [items, edges] = collectItemAndEdges(item)
  const elements: Cytoscape.ElementDefinition[] = [
    ...items.map(({ id, name }) => ({
      data: { id, label: name },
      classes: id === item.id ? 'main-item' : undefined,
    })),
    ...edges.map(({ source, target }) => ({ data: { source, target } })),
  ]

  return (
    <div
      style={{
        border: '1px solid brown',
        marginBottom: '1em',
        marginRight: '1em',
        width: '40vw',
        display: 'inline-block',
      }}
    >
      <p style={{ paddingLeft: '1em' }}>
        {item.name}, {item.kind}, [{item.categoryList.join(',')}]
      </p>
      <CytoscapeComponent elements={elements} layout={layout} style={style} stylesheet={stylesheet} />
    </div>
  )
}

export const App: React.FC<any> = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}> {`すこぶる可愛い！`} </h1>
      {synthesizableItems.map((item) => (
        <ItemSynthesisGraph key={item.id} item={item} />
      ))}
    </div>
  )
}
