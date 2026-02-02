import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CarDetail from './pages/CarDetail'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car/:slug" element={<CarDetail />} />
      </Routes>
    </Router>
  )
}

export default App
