let allNodes = JsArr.map(.JsObj.values(ItemData.data["items"]), n =>
  {
    "id": n["id"],
    "data": {"label": n["id"]},
    // layout stuff
    "position": {"x": 0, "y": 0},
  }
)
let allEdges = JsArr.map(.JsObj.values(ItemData.data["edges"]), n =>
  {
    "id": n["id"],
    "source": n["from"],
    "target": n["to"],
    // layout stuff
    "type": "smoothstep",
  }
)
let allElements = JsArr.concat(. allNodes, allEdges)

Js.Console.log4("initial data:", allNodes, allEdges, allElements)

let generateLayout = elements => {
  let nodes = []
  let edges = []
  let elk = ELKJs.elk({
    "defaultLayoutOptions": {
      "elk.algorithm": "layered",
      "elk.direction": "RIGHT",
      "elk.padding": "[top=200,left=100,bottom=25,right=25]",
      // "elk.spacing.componentComponent": 30,
      "elk.spacing.nodeNode": 50,
      "elk.layered.spacing.nodeNodeBetweenLayers": 25,
      // "elk.edgeLabels.inline": true,
      "elk.edgeRouting": "SPLINES",
      // "elk.algorithm": "layered",
      // "elk.contentAlignment": "V_CENTER",
      // "elk.direction": "RIGHT",
      // "elk.spacing.nodeNode": "25",
      // "elk.layered.spacing.nodeNodeBetweenLayers": "75"
      // "elk.layered.spacing": "50",
      // "elk.spacing": "50"
      // "elk.spacing.individual": "250"
      // "elk.alignment": "RIGHT"
    },
  })

  Js.Array2.forEach(elements, el => {
    if %raw(`el`) && ReactFlow.isNode(el) {
      JsArr.push(.
        nodes,
        {
          "id": el["id"],
          "width": %raw(`el.__rf?.width ?? 172`),
          "height": %raw(`el.__rf?.height ?? 36`),
        },
      )
    } else {
      JsArr.push(. edges, el)
    }
  })

  elk
  ->ELKJs.layout({
    "id": "root",
    "children": nodes,
    "edges": edges,
  })
  ->Promise.then(newGraph => {
    Promise.resolve(
      JsArr.map(.elements, el => {
        if %raw(`el`) && ReactFlow.isNode(el) {
          let node = %raw(`newGraph?.children?.find(n => n.id === el.id)`)
          el["sourcePosition"] = "right"
          el["targetPosition"] = "left"
          if %raw(`node?.x && node?.y && node?.width && node?.height`) {
            el["position"] = {
              "x": node["x"] - node["width"] / 2,
              "y": node["y"] - node["height"] / 2,
            }
          }
        }
      }),
    )
  })
}

// MEMO: prefer `some string`
// https://rescript-lang.org/docs/manual/latest/primitive-types#string-interpolation
@react.component
let make = () => {
  let (elements, setElements) = React.useState(_ => allElements)

  // MEMO: no early return ......
  // https://forum.rescript-lang.org/t/translating-guard-clauses-to-rescript/909
  // https://github.com/rescript-lang/syntax/pull/20
  React.useEffect2(() => {
    Js.Console.log2("effect", elements)

    JsPromise.then(.generateLayout(elements), els => {
      setElements(els)
      Promise.resolve()
    })

    None
  }, (elements, setElements))

  <div>
    <div> {React.string(`すこぶる可愛い！`)} </div>
    <div
      style={ReactDOM.Style.make(~height="1000px", ~width="80vw", ~border="1px solid black", ())}>
      <ReactFlow fitView={true} elements={elements} connectionLineType="smoothstep" />
    </div>
  </div>
}
