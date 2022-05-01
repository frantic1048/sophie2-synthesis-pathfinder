import { synthesizableItems } from './fixtures/ItemData'
import React from 'react'
import { ItemSynthesisGraph } from './ItemSynthesisGraph'

export const App: React.FC<any> = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}> {`すこぶる可愛い！`} </h1>
      {synthesizableItems.map((item) => (
        <ItemSynthesisGraph key={item.id} item={item} />
      ))}
    </div>
  )
}
