switch DOM.document->DOM.getElementById("root") {
| Some(container) =>
  ReactDOMClient.createRoot(container)->ReactDOMClient.render(
    <React.StrictMode> <App /> </React.StrictMode>,
  )
| None => ()
}
