type elk
@module("elkjs/lib/elk.bundled") @new external elk: 'a => elk = "default"

@send external layout: (elk, 'a) => Js.Promise.t<'b> = "layout"
