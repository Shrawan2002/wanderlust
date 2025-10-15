import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import AppLayout from './components/layout/AppLayout'
import Register from './pages/Register'
import Home from './pages/Home'
import Listings from './pages/Listings'
import Login from './pages/Login'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout/>,
      children: [
        {
          path: "/",
          element: <Listings/>
        },
        {
          path: "/listings",
          element: <Listings/>
        },
        {
          path: "/signup",
          element: <Register/>
        },
        {
          path: "/login",
          element: <Login/>
        }
      ]
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
