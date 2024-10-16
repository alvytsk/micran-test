import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss'
import Header from './components/Header'
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import Objects from './pages/Objects/Objects';

function App() {

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="app__content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/objects" element={<Objects />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
