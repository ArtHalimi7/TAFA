import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import CarDetail from './pages/CarDetail'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'

// ScrollToTop component - scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/car/:slug" element={<CarDetail />} />
      </Routes>
    </Router>
  )
}

export default App
