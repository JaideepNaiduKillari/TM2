import { useState, useEffect } from 'react'
import map from './assets/Image-1.png'
import searchMap from './assets/Image-2.png'
import pinData from './pinData.json'
import './App.css'

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [markerPosition, setMarkerPosition] = useState({ left: '0%', top: '0%' })
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    const storedPin = localStorage.getItem('authenticatedPin')
    const storedTime = localStorage.getItem('authTime')
    
    if (storedPin && storedTime) {
      const currentTime = new Date().getTime()
      const authTime = parseInt(storedTime)
      
      // Check if 2 minutes (120000 ms) have passed
      if (currentTime - authTime < 120000) {
        setAuthenticated(true)
        setMarkerPosition(pinData[storedPin])
      } else {
        localStorage.removeItem('authenticatedPin')
        localStorage.removeItem('authTime')
      }
    }
  }, [])

  const handlePinSubmit = () => {
    if (pinData[pin]) {
      setAuthenticated(true)
      setMarkerPosition(pinData[pin])
      localStorage.setItem('authenticatedPin', pin)
      localStorage.setItem('authTime', new Date().getTime().toString())
      
      // Clear authentication after 2 minutes
      setTimeout(() => {
        localStorage.removeItem('authenticatedPin')
        localStorage.removeItem('authTime')
        setAuthenticated(false)
        setPin('')
      }, 120000) // 2 minutes
    } else {
      alert('Invalid PIN')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePinSubmit()
    }
  }

  return (
    <>
      {authenticated ? (
        <div>
          <div className="tab-bar">
            <button 
              onClick={() => setShowSearch(false)} 
              className={!showSearch ? 'active' : ''}
            >
              Map View
            </button>
            <button 
              onClick={() => setShowSearch(true)} 
              className={showSearch ? 'active' : ''}
            >
              Search
            </button>
          </div>
          
          <img
            src={showSearch ? searchMap : map}
            alt="Map"
            className="map-image"
          />
          
          {!showSearch && (
            <div
              className="marker"
              style={{ left: markerPosition.left, top: markerPosition.top }}
            />
          )}
        </div>
      ) : (
        <div className="pin-container">
          <div className="pin-input">
            <h2>Welcome!</h2>
            <p>Enter PIN to access your loaction on map</p>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter PIN"
              maxLength="4"
            />
            <button onClick={handlePinSubmit}>Access Map</button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
