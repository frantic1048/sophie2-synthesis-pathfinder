import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { data, traits } from './fixtures/ItemData'
import { TraitSynthesisGraphV2 } from './TraitSynthesisGraphV2'

export const TraitViewV2: React.FC<any> = () => {
  let inputTraitId = useParams().traitId

  if (inputTraitId && data.traits[inputTraitId]) {
    return <TraitSynthesisGraphV2 traitId={inputTraitId} />
  }
  return <Navigate to={`/traitv2/${traits[0].id}`} replace />
}
