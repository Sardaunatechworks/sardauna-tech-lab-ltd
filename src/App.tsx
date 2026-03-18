import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Services from './pages/Services';
import CaseStudies from './pages/CaseStudies';
import Products from './pages/Products';
import About from './pages/About';
import Team from './pages/Team';
import Partners from './pages/Partners';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/Services';
import AdminCaseStudies from './pages/admin/CaseStudies';
import AdminProducts from './pages/admin/Products';
import AdminBlog from './pages/admin/Blog';
import AdminTeam from './pages/admin/Team';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminPartners from './pages/admin/Partners';
import AdminMessages from './pages/admin/Messages';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="products" element={<Products />} />
          <Route path="about" element={<About />} />
          <Route path="team" element={<Team />} />
          <Route path="partners" element={<Partners />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="case-studies" element={<AdminCaseStudies />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
