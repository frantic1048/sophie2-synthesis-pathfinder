type root

// React@18 support: https://github.com/rescript-lang/rescript-react/issues/34
@module("react-dom/client")
external createRoot: Dom.element => root = "createRoot"

@send external render: (root, React.element) => unit = "render"
