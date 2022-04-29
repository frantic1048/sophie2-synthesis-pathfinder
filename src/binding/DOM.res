type document

@val external document: document = "document"

@send @return(nullable)
external getElementById: (document, string) => option<Dom.element> = "getElementById"
