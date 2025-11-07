import React from 'react'

interface Props {
  children: React.ReactNode
  onClick?: () => void
}

export const Button: React.FC<Props> = ({ children, onClick }) => (
  <button onClick={onClick} className="px-4 py-2 rounded bg-primary-500 text-white">{children}</button>
)