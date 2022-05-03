import { quote } from 'csx'
import React from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { classes, style } from 'typestyle'
import { baseFgColor } from './colors'
import { ListItem } from './List'

const linkClassName = style({ textDecoration: 'none', color: baseFgColor.toString() })
const activeClassName = style({})
export const TraitLink: React.FC<{ traitId: string }> = ({ traitId }) => {
  const to = `/trait/${traitId}`
  const resolved = useResolvedPath(to)
  let match = useMatch({ path: resolved.pathname, end: true })
  return (
    <Link to={to} className={classes(linkClassName, match && activeClassName)}>
      <ListItem isActive={!!match}>{traitId}</ListItem>
    </Link>
  )
}
