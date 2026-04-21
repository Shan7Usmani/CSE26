import React from 'react'
import { Link } from 'react-router-dom'
function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '20px', backgroundColor: '#eee' }}>
      <Link to='/'>Home</Link>
      <Link to='/about'>About</Link>
      <Link to='/contact'>Contact</Link>
    </nav>
  )
}

export default Navbar