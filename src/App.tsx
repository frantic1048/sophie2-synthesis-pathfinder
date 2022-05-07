import { synthesizableItems, data, traits } from './fixtures/ItemData'
import React from 'react'
import { cssRule, style } from 'typestyle'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { ItemSynthesisView } from './ItemSynthesisView'
import { TraitView } from './TraitView'
import { TraitLink } from './TraitLink'
import {
  baseBgColor,
  baseBgShadowColor,
  baseFgColor,
  scrollbarBgColor,
  scrollbarBgShadowColor,
  scrollbarBorderColor,
  scrollbarFgColor,
  scrollbarFgShadow2Color,
  scrollbarFgShadowColor,
} from './colors'
import { List } from './List'
import { Helmet } from 'react-helmet-async'
import { Button } from './Button'
import { NavLink } from './NavLink'
import { ItemLink } from './ItemLink'
import { TraitViewV2 } from './TraitViewV2'

cssRule('html', {
  padding: 0,
  margin: 0,
  fontFamily: `"Varela Round", "Noto Sans SC",sans-serif`,
  color: baseFgColor.toString(),
  backgroundColor: baseBgColor.toString(),
  boxShadow: `inset 0 0 400px 10px ${baseBgShadowColor}`,
})
cssRule('body', {
  margin: 'auto',
  scrollbarColor: `${scrollbarFgColor.toString()} ${scrollbarBgColor.toString()}`,
})
cssRule('::-webkit-scrollbar', {
  width: '10px',
})
cssRule('::-webkit-scrollbar-track', {
  borderRadius: '5px',
  backgroundColor: scrollbarBgColor.toString(),
  boxShadow: `inset 0 0 4px 2px ${scrollbarBgShadowColor.toString()}`,
})
cssRule('::-webkit-scrollbar-thumb', {
  paddingLeft: '2px',
  paddingRight: '2px',
  backgroundClip: 'padding-box',
  borderLeft: '2px solid transparent',
  borderRight: '2px solid transparent',
  borderRadius: '5px',
  backgroundColor: scrollbarFgColor.toString(),
  boxShadow: `inset 0 0 2px ${scrollbarFgShadowColor.toString()}, inset 6px 0 8px ${scrollbarFgShadow2Color.toString()}`,
})
const wrapperClassName = style({
  display: 'flex',
  flexDirection: 'row',
})
const headerClassName = style({
  fontSize: '1.2em',
  fontWeight: 'bold',
  textAlign: 'center',
})
const navLinksClassName = style({
  display: 'flex',
  justifyContent: 'space-around',
  $nest: {
    '&>a': { textDecoration: 'none' },
  },
})
const navClassName = style({
  width: '18em',
  height: '100vh',
})
const itemListClassName = style({
  listStyle: 'none',
  height: 'calc(100% - 7.5em)',
  overflowY: 'auto',
})
const contentClassName = style({
  flexGrow: 1,
})

const synthesizableItemIdList = synthesizableItems.map((i) => i.id)
export const App: React.FC<any> = () => {
  return (
    <div className={wrapperClassName}>
      <Helmet>
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Varela+Round&family=Noto+Sans+SC&display=swap"
          as="style"
        />
      </Helmet>
      <nav className={navClassName}>
        <header className={headerClassName}> {`すこぶる可愛い！`} </header>
        <div className={navLinksClassName}>
          <NavLink to="/item">Item</NavLink>
          <NavLink to="/trait">Trait</NavLink>
          <a href="https://github.com/frantic1048/sophie2-synthesis-pathfinder" target={'_blank'} rel="noreferrer">
            <Button>GitHub</Button>
          </a>
        </div>
        <Routes>
          <Route
            path="/item/*"
            element={
              <List className={itemListClassName}>
                {synthesizableItemIdList.map((id) => (
                  <ItemLink key={id} itemId={id} />
                ))}
              </List>
            }
          />
          <Route
            path="/trait/*"
            element={
              <List className={itemListClassName}>
                {traits.map(({ id }) => (
                  <TraitLink key={id} traitId={id} />
                ))}
              </List>
            }
          />
          <Route
            path="/traitv2/*"
            element={
              <List className={itemListClassName}>
                {traits.map(({ id }) => (
                  <TraitLink key={id} traitId={id} />
                ))}
              </List>
            }
          />
        </Routes>
      </nav>
      <div className={contentClassName}>
        <Routes>
          <Route path="/item/:itemId" element={<ItemSynthesisView />} />
          <Route path="/trait/:traitId" element={<TraitView />} />
          <Route path="/traitv2/:traitId" element={<TraitViewV2 />} />
          <Route path="/item" element={<Navigate to={`/item/${synthesizableItemIdList[0]}`} replace />} />
          <Route path="/trait" element={<Navigate to={`/trait/${traits[0].id}`} replace />} />
          <Route path="/traitv2" element={<Navigate to={`/traitv2/${traits[0].id}`} replace />} />
          <Route path="*" element={<Navigate to={`/item/${synthesizableItemIdList[0]}`} replace />} />
        </Routes>
      </div>
    </div>
  )
}
