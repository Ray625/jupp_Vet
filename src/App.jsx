import 'normalize.css'; // Reset CSS
import './App.css'
import { AuthProvider } from './contexts/AuthContext';
import { DeviceProvider } from './contexts/DeviceContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './pages/layout/layout';

function App() {

  return (
    <BrowserRouter>
      <DeviceProvider>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              <Route path='/' element={<Layout/>}>
                <Route index element={<div><p>Hello world</p></div>} />
              </Route>
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </DeviceProvider>
    </BrowserRouter>
  )
}

export default App
