import ReactFlow, { Node, Edge } from 'react-flow-renderer'
import { data } from './fixtures/ItemData'
import ELK from 'elkjs/lib/elk.bundled'
import React from 'react'

console.log(data)
const allNodes = Object.values(data.items).map((n) => ({
  id: n['id'],
  data: { label: n['id'] },
}))

const allEdges = Object.values(data.edges).map((n) => ({
  id: n['id'],
  source: n['from'],
  target: n['to'],
}))

export const nodeWidth = 272
export const nodeHeight = 36

const generateLayout = async (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const elk = new ELK()

  const graph = {
    id: 'root',

    children: nodes.map(({ id }) => ({
      id,
      width: nodeWidth,
      height: nodeHeight,
    })),
    edges: edges.map(({ id, source, target }) => ({ id, sources: [source], targets: [target] })),
  }

  const result = await elk.layout(graph, {
    layoutOptions: {
      'elk.algorithm': 'layered',
      // 'elk.direction': 'DOWN',
      'elk.layered.spacing.edgeEdgeBetweenLayers': '10',
      'elk.layered.spacing.nodeNodeBetweenLayers': '10',
    },
  })

  return [
    nodes.map((n) => {
      const res = result.children?.find((c) => c.id === n.id)!
      return {
        ...n,
        position: {
          x: res.x,
          y: res.y,
        },
      }
    }),
    edges,
  ] as [Node[], Edge[]]
}

export const App: React.FC<any> = () => {
  const [nodes, setNodes] = React.useState<Node[]>([])
  const [edges, setEdges] = React.useState<Edge[]>([])
  React.useEffect(() => {
    generateLayout(allNodes, allEdges).then(([n, e]) => {
      console.debug('layouted=', n, e)
      setNodes(n)
      setEdges(e)
    })
  }, [])
  return (
    <div>
      <div> {`すこぶる可愛い！`} </div>
      <div
        style={{
          height: '1000px',
          width: '1000px',
          border: '1px solid black',
        }}
      >
        <ReactFlow fitView={true} nodes={nodes} edges={edges} />
      </div>
    </div>
  )
}
