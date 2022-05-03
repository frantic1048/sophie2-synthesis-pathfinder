import { quote } from 'csx'
import React from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { classes, style } from 'typestyle'
import { getTraitGrade, traitGradeToColor } from './fixtures/ItemData'

const linkClassName = style({ textDecoration: 'none' })
const makeTraitColorClassName = (traitId: string) =>
  style({
    color: traitGradeToColor(getTraitGrade(traitId)),
  })
const activeClassName = style({
  fontWeight: 'bold',
  position: 'relative',
  textDecoration: 'underline',
  $nest: {
    '&::before': {
      position: 'absolute',
      height: '100%',
      width: '1em',
      left: '-1.2em',
      fontWeight: 'bold',
      content: quote('▸'),
    },
  },
})
export const TraitLink: React.FC<{ traitId: string }> = ({ traitId }) => {
  const to = `/trait/${traitId}`
  const resolved = useResolvedPath(to)
  let match = useMatch({ path: resolved.pathname, end: true })
  return (
    <Link to={to} className={classes(linkClassName, makeTraitColorClassName(traitId), match && activeClassName)}>
      {traitId}
    </Link>
  )
}
