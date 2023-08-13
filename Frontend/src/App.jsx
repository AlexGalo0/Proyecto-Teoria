//import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from './Components/Navbar';
//import { Footer } from './Components/Footer';
import { MainInfoGeneral } from './Components/MainInfoGeneral';
import { Simulador } from './Components/Simulador';
import { Landing } from './Components/Landing';

function App() {
  return (
    <BrowserRouter>
      <div>
      
        <Navbar />

        {/* Rutas */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Simulador" element={<Simulador />} />
          <Route path="/info" element={<MainInfoGeneral />} />

        </Routes>

        {/* Footer siempre visible */}
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
