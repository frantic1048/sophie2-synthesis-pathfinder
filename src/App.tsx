import { synthesizableItems, data, traits, traitGradeToColor } from './fixtures/ItemData'
import React from 'react'
import { cssRule, style } from 'typestyle'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { ItemSynthesisView } from './ItemSynthesisView'
import { TraitView } from './TraitView'
import { TraitLink } from './TraitLink'

cssRule('html', {
  padding: 0,
  margin: 0,
  fontFamily: `"Noto Serif SC",serif`,
})
cssRule('body', {
  margin: 'auto',
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
})
const navClassName = style({
  width: '18em',
  height: '100vh',
})
const itemListClassName = style({
  listStyle: 'none',
  height: 'calc(100% - 5em)',
  overflowY: 'auto',
})
const contentClassName = style({
  flexGrow: 1,
})

const synthesizableItemIdList = synthesizableItems.map((i) => i.id)
export const App: React.FC<any> = () => {
  return (
    <div className={wrapperClassName}>
      <nav className={navClassName}>
        <header className={headerClassName}> {`すこぶる可愛い！`} </header>
        <div className={navLinksClassName}>
          <Link to="/item">item</Link>
          <Link to="/trait">trait</Link>
          <a href="https://github.com/frantic1048/sophie2-synthesis-pathfinder" target={'_blank'} rel="noreferrer">
            github
          </a>
        </div>
        <ul className={itemListClassName}>
          <Routes>
            <Route
              path="/item/*"
              element={
                <>
                  {synthesizableItemIdList.map((id) => (
                    <li key={id}>
                      <Link to={`/item/${id}`}>{id}</Link>
                    </li>
                  ))}
                </>
              }
            />
            <Route
              path="/trait/*"
              element={
                <>
                  {traits.map(({ id }) => (
                    <li key={id}>
                      <TraitLink traitId={id} />
                    </li>
                  ))}
                </>
              }
            />
          </Routes>
        </ul>
      </nav>
      <div className={contentClassName}>
        <Routes>
          <Route path="/item/:itemId" element={<ItemSynthesisView />} />
          <Route path="/trait/:traitId" element={<TraitView />} />
          <Route path="/item" element={<Navigate to={`/item/${synthesizableItemIdList[0]}`} replace />} />
          <Route path="/trait" element={<Navigate to={`/trait/${traits[0].id}`} replace />} />
          <Route path="*" element={<Navigate to={`/item/${synthesizableItemIdList[0]}`} replace />} />
        </Routes>
      </div>
    </div>
  )
}
