import Cytoscape from 'cytoscape'
import React from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import { data, traitGradeToColor, Sophie2TraitType, traits } from './fixtures/ItemData'
import { useNavigate } from 'react-router-dom'
import { traitPosition } from './fixtures/TraitPositionData'

const layout = {
  name: 'preset',
  fit: false,
  animate: false,
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
      shape: 'ellipse',
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
      width: 60,
      height: 60,
      'border-width': 10,
      'border-color': '#ABE3FF',
      'border-style': 'double',
    },
  },
  {
    selector: 'node.related',
    style: {
      shape: 'diamond',
    },
  },
  {
    selector: 'edge.related',
    style: {
      width: 6,
      'line-color': '#ABE3FF',
      'target-arrow-color': '#ABE3FF',
    },
  },
]

export const TraitSynthesisGraph: React.FC<{ traitId: Sophie2TraitType['id'] }> = ({ traitId }) => {
  const elements = React.useMemo<Cytoscape.ElementDefinition[]>(
    () => [
      ...traits.map(({ id, name, grade }) => ({
        data: { id: id, label: name, grade },
        position: traitPosition.find((tp) => tp.id === id)?.position,
        style: { 'background-color': traitGradeToColor(grade) },
      })),
      ...Object.values(data.traitEdges).map(({ source, target }) => ({ data: { source, target } })),
    ],
    [],
  )

  const cy = React.useRef<Cytoscape.Core>()
  const handleCyRef = React.useCallback<(cy: Cytoscape.Core) => void>((_cy) => (cy.current = _cy), [])
  React.useEffect(() => {
    if (cy.current) {
      const selectedNode = cy.current.nodes(`#${traitId}`)
      const relatedEdges = selectedNode.successors()

      cy.current.startBatch()
      cy.current.elements('.active, .related').removeClass('active related')
      selectedNode.addClass('active')
      relatedEdges.addClass('related')
      cy.current.endBatch()

      cy.current.animate({ center: { eles: selectedNode }, duration: 300 })
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
        wheelSensitivity={0.5}
      />
    </>
  )
}

// temp1.current.nodes().map(n => ({id: n.id(),position: n.renderedPosition()}))
