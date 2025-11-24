import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/register'
import NotFound from './pages/NotFound'
import '../styles/global.css'

function App() {

  return (
    <>
    <Router>
      <div className='app'>
        <Routes>
          <Route path='/register' 
          element={
            <Register/>
          } />
          <Route path='/login' 
          element={
            <Login/>
          } />
          <Route path='*' 
          element={
            <NotFound/>
          } />
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App
