import { em, px, rgb } from 'csx'
import React from 'react'
import { classes, style } from 'typestyle'
import { contentBgColor, contentBgShadowColor, contentBorderColor } from './colors'

const listClassName = style({
  padding: em(0.4),
  backgroundColor: contentBgColor.toString(),
  borderRadius: px(5),
  margin: px(16),
  boxShadow: [
    `inset 0 0 2px ${contentBgShadowColor.toString()}`,
    `0 0 2px ${contentBgShadowColor.toString()}`,
    `0 0 0 4px ${contentBgColor.toString()}`,
    `0 0 0 9px ${contentBorderColor.toString()}`,
    ` 0 0 2px 10px ${contentBorderColor.darken(0.3).toString()}`,
  ].join(','),
})
export const List: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={classes(listClassName, className)}>{children}</div>
}
const listItemClassName = style({
  paddingTop: em(0.2),
  paddingBottom: em(0.2),
  paddingLeft: em(1),
  margin: `${px(5)} 0`,
  borderRadius: px(5),
  backgroundColor: rgb(204, 192, 178).toString(),
})
const listItemActiveClassName = style({
  backgroundColor: rgb(253, 232, 65).toString(),
  boxShadow: [
    `inset 0 0 5px 2px ${rgb(250, 238, 178).toString()}`,
    `inset -15px 0 15px ${rgb(252, 200, 28).toString()}`,
  ].join(','),
})
export const ListItem: React.FC<{ children: React.ReactNode; isActive?: boolean; className?: string }> = ({
  children,
  isActive,
  className,
}) => {
  return <div className={classes(listItemClassName, isActive && listItemActiveClassName, className)}>{children}</div>
}
