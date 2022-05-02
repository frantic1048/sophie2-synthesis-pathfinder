import { Navigate, useParams } from 'react-router-dom'
import React from 'react'
import { ItemSynthesisGraph } from './ItemSynthesisGraph'
import { isSynthesizableItem, synthesizableItems } from './fixtures/ItemData'

export const ItemSynthesisView: React.FC<any> = () => {
  let inputItemId = useParams().itemId

  if (inputItemId && isSynthesizableItem(inputItemId)) {
    return <ItemSynthesisGraph itemId={inputItemId} />
  }

  return <Navigate to={`/item/${synthesizableItems[0].id}`} replace />
}
