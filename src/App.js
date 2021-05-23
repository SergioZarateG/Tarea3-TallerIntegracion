import logo from './logo.svg';
import {MapContainer, TileLayer} from 'react-leaflet'
import React, { useState } from 'react';
import Chat from './componentes/Chat';
import PositionFlight from './componentes/Position'
import Flights from './componentes/Flights';
import './App.css';

function App() {
  const [nombre, setNombre] = useState("");
  const [registrado, setRegistrado] = useState(false);

  const registrar = (e) => {
    e.preventDefault();
    if(nombre !== ""){
      setRegistrado(true);
    }
  }

  return (
    <div className="App">
      <Flights name={nombre} />
    </div>
  );
}

export default App;
