//import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from './Components/Navbar';
import { Footer } from './Components/Footer';
import { MainInfoGeneral } from './Components/MainInfoGeneral';
import { Simulador } from './Components/Simulador';

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* Navbar siempre visible */}
        <Navbar />

        {/* Rutas */}
        <Routes>
          <Route path="/" element={<MainInfoGeneral />} />
          <Route path="/Simulador" element={<Simulador />} />
        </Routes>

        {/* Footer siempre visible */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
