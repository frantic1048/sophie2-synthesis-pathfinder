import Cytoscape from 'cytoscape'
import React from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import { data, traitGradeToColor, Sophie2TraitType, traits } from './fixtures/ItemData'
import { useNavigate } from 'react-router-dom'
import { traitPosition } from './fixtures/TraitPositionData'
import { baseGraphEdgeColor, titleLightBgColor, titleLightFgColor } from './colors'
import { style } from 'typestyle'
import { em } from 'csx'

const infoClassName = style({
  position: 'absolute',
  padding: `${em(0.2)} ${em(1)}`,
  zIndex: 1,
  backgroundColor: titleLightBgColor.fadeOut(0.3).toString(),
  color: titleLightFgColor.toString(),
})

const layout = {
  name: 'preset',
  fit: false,
  animate: false,
}
const cystyle: React.CSSProperties = {
  width: '100%',
  height: 'max(800px, 100%)',
}
const stylesheet: Cytoscape.Stylesheet[] = [
  {
    selector: 'node',
    style: {
      label: 'data(id)',
      shape: 'ellipse',
      'background-opacity': 0.7,
      'text-background-color': '#fff',
      'text-background-opacity': 0.2,
      'text-background-padding': '3px',
      'text-background-shape': 'roundrectangle',
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
    selector: 'node.active',
    style: {
      shape: 'star',
      width: 60,
      height: 60,
      'border-width': 5,
      'border-color': '#ff6ea2',
      'border-style': 'double',
      color: '#fff',
      'background-opacity': 1,
      'font-weight': 'bold',
      'text-outline-color': '#ff6ea2',
      'text-outline-width': 1,
      'text-background-color': '#ff6ea2',
      'text-background-opacity': 0.6,
      'z-index': 2,
    },
  },
  {
    selector: 'node.related',
    style: {
      shape: 'diamond',
      'border-width': 4,
      'border-color': '#ff6ea2',
      'border-style': 'double',
      color: '#fff',
      'background-opacity': 1,
      'text-background-color': '#ff6ea2',
      'text-background-opacity': 0.6,
      'z-index': 1,
    },
  },
  {
    selector: 'edge.related',
    style: {
      width: 2,
      'line-opacity': 0.8,
      'line-color': '#ff6ea2',
      'source-arrow-color': '#ff6ea2',
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
      <p className={infoClassName}>{traitId}</p>
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
