import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import { About, Academics, Campus, Sports } from './pages/Info'
import { ProgrammeDetail, Programmes } from './pages/Programmes'
import Gallery from './pages/Gallery'
import { Admissions, Careers, Contact } from './pages/Admissions'
import NotFound from './pages/NotFound'
import { AdminShell } from './admin/Auth'
import Dashboard from './admin/Dashboard'
import { Applications, Enquiries, Messages } from './admin/Inbox'
import * as C from './admin/Crud'
import SettingsEditor from './admin/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="academics" element={<Academics />} />
        <Route path="programmes" element={<Programmes />} />
        <Route path="programmes/:slug" element={<ProgrammeDetail />} />
        <Route path="sports" element={<Sports />} />
        <Route path="campus" element={<Campus />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="careers" element={<Careers />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/admin" element={<AdminShell />}>
        <Route index element={<Dashboard />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="applications" element={<Applications />} />
        <Route path="messages" element={<Messages />} />
        <Route path="programmes" element={<C.Programmes />} />
        <Route path="gallery" element={<C.Gallery />} />
        <Route path="announcements" element={<C.Announcements />} />
        <Route path="jobs" element={<C.Jobs />} />
        <Route path="settings" element={<SettingsEditor />} />
      </Route>
    </Routes>
  )
}
