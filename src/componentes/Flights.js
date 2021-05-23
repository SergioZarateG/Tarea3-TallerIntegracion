import { React, useState, useEffect, useRef } from 'react';
import socket from './Socket';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip} from 'react-leaflet'
import randomColor from 'randomcolor';
import Chat from './Chat';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import L from 'leaflet';

const Flights = ({ name }) => {
    const [vuelos, setFlights] = useState([]);
    const [posiciones, setPositions] = useState([[],[]]);
    const [nombre, setNombre] = useState("");
    const [registrado, setRegistrado] = useState(false);

    const registrar = (e) => {
        e.preventDefault();
        if(nombre !== ""){
        setRegistrado(true);
        }
    }

    useEffect(() => {
        socket.emit('FLIGHTS');
        return () => {socket.off()}
    },[]);
    //useEffect(() => {
      //  socket.on('FLIGHTS', flights => {
        //    console.log("Nuevos vuelos", flights);
           // setFlights([...flights]);
       // })
        //return () => {socket.off()}
    //}, [vuelos])

    useEffect(() => {
        if (vuelos.length == 0) {
            socket.on('FLIGHTS', flights => {
                console.log("Nuevos vuelos", flights);
                setFlights([...flights]);
            })
        }
        socket.on('CHAT', message => {
            console.log("Llego un mensaje",message.name, message.message, message.date);
            setPositions([[...posiciones[0]],[...posiciones[1], message]]);
        });
        socket.on('POSITION', posicion => {
            const arreglo = posiciones[0].filter(function(i) { return i.code !== posicion.code });
            console.log('llego nueva posicion');
            setPositions([[...arreglo, posicion],[...posiciones[1]]]);
        });
        return () => {socket.off()}
    }, [posiciones])
    const myIcon = L.icon({
        iconUrl: 'https://i7.uihere.com/icons/282/56/895/position-493a7c32f55474b865c24d2428ce9bd0.png',
        iconSize: [40,40],
        iconAnchor: [20, 40],
        popupAnchor: [0,0],
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
    });

    const planeIcon = L.icon({
        iconUrl: 'https://i.pinimg.com/originals/d6/2b/91/d62b914376eae43839c1339e929e06a7.png',
        iconSize: [30,30],
        iconAnchor: [20, 30],
        popupAnchor: [0,0],
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null
    });

    const submit = () => {
        socket.emit('FLIGHTS');
    }

    return (
        <div>
            <div style={{marginLeft: '20px'}}>
                <h2>Mapa en "vivo"</h2>
                <p>Si quieres volver a pedir los vuelos preciona el siguiente boton: </p>
                <form onSubmit={submit}>
                    <button>Refrescar</button>
                </form>
            </div>
            <div>
                <MapContainer center={{lat: '51.52437', lng: '13.41053'}} zoom={2}>
                    <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' 
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                    {vuelos.map((e,i) => 
                        <div key={i}>
                            <Polyline positions={[e.origin, e.destination]} color={randomColor()} />
                            <Marker position={e.origin} icon={myIcon}>
                                <Popup>Vuelo: {e.code}</Popup>
                            </Marker>
                        </div>
                    )}
                    {posiciones[0].map( (p,i) => 
                        <div key={i}>
                            <Marker position={p.position} icon={planeIcon}>
                                <Tooltip offset={[0, 0]} opacity={1} sticky>
                                    <span>{p.code}</span>
                                </Tooltip>
                            </Marker>
                        </div>
                    )}
                </MapContainer>
                <div className='divChat'>
                    {
                        !registrado &&
                        <form onSubmit={registrar}>
                        <label htmlFor="">Introduzca su nombre para acceder al chat: </label>
                        <input placeholder="Nickname" value={nombre} onChange={e => setNombre(e.target.value)}/>
                        <button>Ir al chat</button>
                        </form>
                    }
                    {
                        registrado &&
                            <Chat name={[nombre, posiciones[1]]}/>
                    }
                </div>
            </div>
            <div>
                <h2 style={{marginLeft: '20px'}}>Información de vuelos</h2>
                <div style={{maxWidth: '100%'}}>
                    {vuelos.map((e,i) => 
                        <div className="Vuelos" key={i}>
                            <div style={{margin: '10px'}}>
                                <h2>Vuelo: {e.code}</h2>
                                <em>Aerolinea: {e.airline}</em>
                                <p>Orgigen: [lat: {e.origin[0]}, lng: {e.origin[1]}]</p>
                                <p>Destino: [lat: {e.destination[0]}, lng: {e.destination[1]}]</p>
                                <p>Avion: {e.plane}</p>
                                <p>Cantidad de asientos: {e.seats}</p>
                                <p>Pasajeros:
                                    {e.passengers.map((p,j) => 
                                        <li key={j}>Nombre: {p.name}, Edad: {p.age}</li>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Flights;