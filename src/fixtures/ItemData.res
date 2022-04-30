
// dunno how to express Record<string, {...}> (ˊ_>ˋ)
@scope("JSON") @val
external parseRawItemData: string => 't = "parse"

let data = parseRawItemData(RawItemData.data)