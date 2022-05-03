import { em, px, rgb, rgba } from 'csx'
import React from 'react'
import { classes, style } from 'typestyle'
import { contentBorderColor, titleDarkBgColor, titleDarkFgColor, titleLightFgColor } from './colors'

const buttonClassName = style({
  marginTop: px(8),
  marginBottom: px(8),
  padding: `${em(0.2)} ${em(1)}`,
  color: titleDarkFgColor.toString(),
  backgroundColor: titleDarkBgColor.toString(),
  borderRadius: em(1),
  boxShadow: [
    `inset -4px -2px 10px ${titleDarkBgColor.darken(0.1).fadeOut(0.3).toString()}`,
    `0 0 0 1px ${contentBorderColor.fadeOut(0.4).toString()}`,
    `0 0 0 3px ${titleDarkBgColor.toString()}`,
    `0 0 0 5px ${contentBorderColor.toString()}`,
    `0 0 2px 6px ${contentBorderColor.darken(0.3).toString()}`,
  ].join(','),
  transition: ['box-shadow 0.2s ease', 'background-color 0.2s ease', 'color 0.2s ease'].join(','),
})
const buttonActiveClassName = style({
  color: titleLightFgColor.toString(),
  backgroundColor: rgb(255, 153, 124).toString(),
  boxShadow: [
    `inset 0 0 8px 2px ${rgba(253, 194, 179, 0.4).toString()}`,
    `0 0 2px 1px ${rgb(239, 124, 80).toString()}`,
    `0 0 2px 3px ${rgb(246, 143, 98).toString()}`,
    `0 0 0 5px ${contentBorderColor.toString()}`,
    `0 0 2px 6px ${contentBorderColor.darken(0.3).toString()}`,
  ].join(','),
})
export const Button: React.FC<{ children?: React.ReactNode; isActive?: boolean }> = ({ children, isActive }) => {
  return <div className={classes(buttonClassName, isActive && buttonActiveClassName)}>{children}</div>
}
