import React from 'react'

export default function MapOverlay ({centered = false, top = null, left = null, right = null, bottom = null, children}) {

  const style = {}
  if (top != null) {
    style.top = top
  }
  if (left != null) {
    style.left = left
  }
  if (right != null) {
    style.right = right
  }
  if (bottom != null) {
    style.bottom = bottom
  }

  const centerStyle = {}
  if (centered) {
    centerStyle.position = 'relative'
    centerStyle.left = 'calc(50vw - 50%)'
  }

  return (
    <div className={'mapOverlay'} style={style}>
      <div style={centerStyle}>
        {children}
      </div>
    </div>

  )
}