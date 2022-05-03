import React from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { style } from 'typestyle'
import { Button } from './Button'

const navLinkClassName = style({
  textDecoration: 'none',
})
export const NavLink: React.FC<{ children?: React.ReactNode; to: string }> = ({ children, to }) => {
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: false })
  return (
    <Link to={to} className={navLinkClassName}>
      <Button isActive={!!match}>{children}</Button>
    </Link>
  )
}
