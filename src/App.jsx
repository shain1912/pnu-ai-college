import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import SiteLayout from './layout/SiteLayout'
import Home from './pages/Home'
import AiCollege from './pages/AiCollege'
import AdpxPage from './pages/AdpxPage'
import SchoolsIndex from './pages/SchoolsIndex'
import SchoolDetail from './pages/SchoolDetail'
import RoadmapPage from './pages/RoadmapPage'

// Vite injects BASE_URL from vite.config.js; the router needs the same prefix
// or every link would point above the project-site subpath.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/ai-college', element: <AiCollege /> },
      { path: '/ai-college/adpx', element: <AdpxPage /> },
      { path: '/ai-college/schools', element: <SchoolsIndex /> },
      { path: '/ai-college/schools/:slug', element: <SchoolDetail /> },
      { path: '/ai-college/roadmap', element: <RoadmapPage /> },
      // unknown paths fall back to the home page rather than a dead end
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
], { basename })

export default function App() {
  return <RouterProvider router={router} />
}
