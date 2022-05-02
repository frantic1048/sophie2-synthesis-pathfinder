import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { data, traits } from './fixtures/ItemData'
import { TraitSynthesisGraph } from './TraitSynthesisGraph'

export const TraitView: React.FC<any> = () => {
  let inputTraitId = useParams().traitId

  if (inputTraitId && data.traits[inputTraitId]) {
    return <TraitSynthesisGraph traitId={inputTraitId} />
  }
  return <Navigate to={`/trait/${traits[0].id}`} replace />
}
