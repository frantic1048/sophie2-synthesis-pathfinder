/*
MEMO: how to express these TypeScript types:
  - union: Polymorphic Variant looks similar but not the same.
  - {[key in string]: string}
  - as any as: "%identity" magic?
*/

// ref version: 10.1.2
// check https://github.com/wbkd/react-flow/blob/10.1.2/src/index.ts

// https://github.com/wbkd/react-flow/blob/10.1.2/src/container/ReactFlow/index.tsx
@module("react-flow-renderer") @react.component
external make: (
  ~nodes: 'nodes=?,
  ~edges: 'edges=?,
  ~onNodesChange: 'onNodesChange=?,
  ~onEdgesChange: 'onEdgesChange=?,
  ~onConnect: 'onConnect=?,
  ~children: React.element=?,
  ~fitView: bool=?,
) => React.element = "default"

@module("react-flow-renderer")
external applyNodeChanges: (array<'nodeChange>, 'nodes) => 'nodes = "applyNodeChanges"

@module("react-flow-renderer")
external applyEdgeChanges: (array<'edgeChange>, 'edges) => 'edges = "applyEdgeChanges"
