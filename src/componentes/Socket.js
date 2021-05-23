import io from 'socket.io-client';

let socket = io("wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl", {
    path: '/flights'
});

export default socket;