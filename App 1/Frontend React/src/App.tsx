import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Formcomponent } from './Component/Formcomponent';
import { Gridcomponent } from './Component/Gridcomponent';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/form' element={<Formcomponent />}></Route>
        <Route path='/' element={<Gridcomponent />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;