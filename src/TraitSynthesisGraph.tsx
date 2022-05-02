import Cytoscape from 'cytoscape'
import React from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import { data, Sophie2TraitType, traits } from './fixtures/ItemData'
import { useNavigate } from 'react-router-dom'
import { traitPosition } from './fixtures/TraitPositionData'

const layout = {
  name: 'preset',
  fit: false,
  animate: false,
  // nodeDimensionsIncludeLabels: true,
  // animate: false,
  // tile: true,
  // randomize: true,
  // edgeElasticity: 0.1, // 0.45,
  // gravityRange: 5, // 3.8
  transform(node, position) {
    const scaleRatio = 1.6
    return {
      x: position.x * scaleRatio,
      y: position.y * scaleRatio,
    }
  },
}
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
    selector: 'node.active',
    style: {
      'background-color': '#ff6ea2',
      shape: 'star',
      width: 50,
      height: 50,
    },
  },
  {
    selector: 'node.related',
    style: {
      'background-color': '#516186',
      shape: 'ellipse',
    },
  },
  {
    selector: 'edge.related',
    style: {
      width: 7,
      'line-color': '#ABE3FF',
      'target-arrow-color': '#ABE3FF',
    },
  },
]

export const TraitSynthesisGraph: React.FC<{ traitId: Sophie2TraitType['id'] }> = ({ traitId }) => {
  const elements = React.useMemo<Cytoscape.ElementDefinition[]>(
    () => [
      ...traits.map(({ id, name }) => ({
        data: { id: id, label: name },
        position: traitPosition.find((tp) => tp.id === id)?.position,
      })),
      ...Object.values(data.traitEdges).map(({ source, target }) => ({ data: { source, target } })),
    ],
    [],
  )

  const cy = React.useRef<Cytoscape.Core>()
  const handleCyRef = React.useCallback<(cy: Cytoscape.Core) => void>((_cy) => (cy.current = _cy), [])
  React.useEffect(() => {
    if (cy.current) {
      cy.current.elements('.active, .related').removeClass('active related')

      const selectedNode = cy.current.nodes(`#${traitId}`)
      selectedNode.addClass('active')

      const relatedEdges = selectedNode.successors()
      relatedEdges.addClass('related')

      cy.current.animate({ center: { eles: selectedNode } })
    }
  }, [traitId])

  const goto = useNavigate()
  React.useEffect(() => {
    if (cy.current) {
      cy.current.nodes().on('click', (e) => {
        const node = e.target
        goto(`/trait/${node.id()}`)
      })
    }
  }, [])

  return (
    <>
      <p>{traitId}</p>
      <CytoscapeComponent
        cy={handleCyRef}
        elements={elements}
        layout={layout}
        style={cystyle}
        stylesheet={stylesheet}
        userZoomingEnabled={true}
        autoungrabify={true}
        maxZoom={1.5}
        minZoom={0.2}
      />
    </>
  )
}

// temp1.current.nodes().map(n => ({id: n.id(),position: n.renderedPosition()}))
