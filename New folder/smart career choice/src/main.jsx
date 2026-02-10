import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "sonner";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import ResumeBuilder from './pages/ResumeBuilder.jsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext.jsx';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Interview from './pages/Interview';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
  },
  {
    path: "/resume",
    element: <ProtectedRoute><ResumeBuilder/></ProtectedRoute>
  },
  {
    path: "/signin",
    element: <Login/>
  },
  {
    path: "/signup",
    element: <Signup/>
  },
  {
    path: "/profile",
    element: <Profile/>
  },
  {
    path: "/about",
    element: <About/>
  },
  {
    path: "/admin",
    element:<AdminDashboard/>
  },
  {
    path: "/interview",
    element:<ProtectedRoute><Interview/></ProtectedRoute>
  },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />,
            <Toaster position="top-center" richColors />
        </AuthProvider>
    </StrictMode>
);
