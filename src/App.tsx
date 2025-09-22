import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import Team from './components/Team';
import Testimonials from './components/Testimonials';
import Partners from './components/Partners';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AdminApp from './components/admin/AdminApp';

// Main website component
const MainWebsite = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <Hero />
    <About />
    <Gallery />
    <Team />
    <Testimonials />
    <Partners />
    <BookingForm />
    <Footer />
    <Chatbot />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainWebsite />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </Router>
  );
}

export default App;