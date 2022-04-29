let initialNodes = (
  {
    "id": "1",
    "type": "input",
    "data": {"label": "Input Node"},
    "position": {"x": 250, "y": 25},
  },
  {
    "id": "2",
    "data": {"label": <div> {React.string("Default Node")} </div>},
    "position": {"x": 100, "y": 125},
  },
  {
    "id": "3",
    "type": "output",
    "data": {"label": "Output Node"},
    "position": {"x": 250, "y": 250},
  },
)
let initialEdges = (
  {"id": "e1-2", "source": "1", "target": "2"},
  {"id": "e2-3", "source": "2", "target": "3", "animated": true},
)

// MEMO: prefer `some string`
// https://rescript-lang.org/docs/manual/latest/primitive-types#string-interpolation
@react.component
let make = () => {
  let (nodes, setNodes) = React.useState(_ => initialNodes)
  let (edges, setEdges) = React.useState(_ => initialEdges)
  let onNodesChange = React.useCallback1(
    changes => setNodes(nds => ReactFlow.applyNodeChanges(changes, nds)),
    [setNodes],
  )
  let onEdgesChange = React.useCallback1(
    changes => setEdges(eds => ReactFlow.applyEdgeChanges(changes, eds)),
    [setEdges],
  )
  <div>
    <div> {React.string(`すこぶる可愛い！`)} </div>
    <div
      style={ReactDOM.Style.make(~height="1000px", ~width="80vw", ~border="1px solid black", ())}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView={true}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
    </div>
  </div>
}
