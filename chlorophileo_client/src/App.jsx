import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './app/routes';
import AuthProvider from './auth/AuthProvider';

function App() {
  const router = createBrowserRouter(routes)
  return <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
}

export default App
