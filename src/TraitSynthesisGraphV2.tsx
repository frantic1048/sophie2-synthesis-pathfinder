import React from 'react'
import { data, Sophie2TraitType, getTraitGrade } from './fixtures/ItemData'
import { titleLightBgColor, titleLightFgColor } from './colors'
import { style } from 'typestyle'
import { em } from 'csx'

import Graph from 'graphology'
import { SigmaContainer, useLoadGraph } from '@react-sigma/core'
import '@react-sigma/core/lib/react-sigma.min.css'

const infoClassName = style({
  position: 'absolute',
  padding: `${em(0.2)} ${em(1)}`,
  zIndex: 1,
  backgroundColor: titleLightBgColor.fadeOut(0.3).toString(),
  color: titleLightFgColor.toString(),
})

const LoadGraph = () => {
  const loadGraph = useLoadGraph()

  React.useEffect(() => {
    const graph = new Graph()
    graph.addNode('first', { x: 0, y: 0, size: 15, label: 'My first node', color: '#FA4F40' })
    loadGraph(graph)
  }, [loadGraph])

  return null
}

export const TraitSynthesisGraphV2: React.FC<{ traitId: Sophie2TraitType['id'] }> = ({ traitId }) => {
  return (
    <>
      <p className={infoClassName}>
        {traitId}
        <br />
        {getTraitGrade(traitId)} | {data.traits[traitId].kindList.join(',')}
      </p>
      <SigmaContainer
        style={{ height: '500px', width: '500px', backgroundColor: titleLightBgColor.fadeOut(0.3).toString() }}
      >
        <LoadGraph />
      </SigmaContainer>
    </>
  )
}
