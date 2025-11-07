import React from 'react'

interface Props {
  children: React.ReactNode
  open: boolean
  onClose: () => void
}

export const Modal: React.FC<Props> = ({ children, open, onClose }) => {
  if (!open) return null
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
      <div className="bg-white rounded p-4 z-10 w-full max-w-lg shadow-modal">{children}</div>
    </div>
  )
}