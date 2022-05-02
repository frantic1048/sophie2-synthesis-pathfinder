import { synthesizableItems } from './fixtures/ItemData'
import React from 'react'
import { cssRule, style } from 'typestyle'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { ItemSynthesisView } from './ItemSynthesisView'

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
        <h1 style={{ textAlign: 'center' }}> {`すこぶる可愛い！`} </h1>
        <ul className={itemListClassName}>
          {synthesizableItemIdList.map((id) => (
            <li key={id}>
              <Link to={`/${id}`}>{id}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={contentClassName}>
        <Routes>
          <Route path="/" element={<Navigate to={`/${synthesizableItemIdList[0]}`} replace />} />
          <Route path="/:itemId" element={<ItemSynthesisView />} />
        </Routes>
      </div>
    </div>
  )
}
