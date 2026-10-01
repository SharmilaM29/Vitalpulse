import React from 'react'
import '../../App.css';
function LoadingSpinner() {
  return (
    <div className='loading-overlay'>
      <div className='spinner'></div>
      <p>Synchronizing Pulse Data</p>
    </div>
  )
}

export default LoadingSpinner
