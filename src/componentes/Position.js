import { React, useState, useEffect, useRef } from 'react';
import socket from './Socket';

const PositionFlight = () => {
    useEffect(() => {
        socket.on('POSITION', posicion => {
            console.log(posicion);
        });
        return () => {socket.off()}
    }, [])
    return null
}

export default PositionFlight;