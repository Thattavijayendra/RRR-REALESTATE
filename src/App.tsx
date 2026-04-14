import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import HomePage from './pages/HomePage'
import PropertiesPage from './pages/PropertiesPage'
import PropertyDetails from './pages/PropertyDetails'
import DealerDashboard from './pages/dealer/DealerDashboard'
import Services from '@/components/home/Services'
import Contact from '@/components/home/Contact'

function ServicesPage() {
  return (
    <div className="pt-20">
      <Services />
      <Contact />
    </div>
  )
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/services" element={<ServicesPage />} />
        {/* <Route path="/dealer" element={<DealerDashboard />} /> */}
        <Route path="/dealer/*" element={<DealerDashboard />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
      </Routes>
    </Layout>
  )
}

export default App
