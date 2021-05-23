import React, { useState, useEffect, useRef } from 'react';
import socket from './Socket';
import '../App.css';

const Chat = ({ name }) => {
    const [message, setMensaje] = useState("");
    const [messages, setMensajes] = useState([]);

    useEffect(() => {
        socket.emit('conectado', name[0]);
    }, [name]);

    /*
    useEffect(() => {
        socket.on('CHAT', message => {
            console.log("Llego un mensaje",message.name, message.message, message.date);
            setMensajes([...messages, message]);
        })

        return () => {socket.off()}
    }, [messages])*/

    const divRef = useRef();
    //useEffect(() => {
    //    divRef.current.scrollIntoView({behavior: 'smooth'});
    //})

    const submit = (e) => {
        console.log(name, message);
        e.preventDefault();
        socket.emit('CHAT', {name: name[0], message: message});
        console.log("Se emitio mensaje");
    }

    return (
        <div>
            <div style={{textAlign: 'center'}}>
                <h2>Chat Vuelos</h2>
            </div>
            <div className="chat">
                {name[1].map((e,i) => <div key={i}><div style={{color: 'blue'}}>{e.name} ({(new Date(parseInt(e.date))).toString().slice(0,24)}):</div> <div>{e.message}</div></div>)}
                <div ref={divRef}></div>
            </div>
            <div className="formChat">
                <form onSubmit={submit}>
                    <textarea placeholder="Escribe tu mensaje" name="" id="" cols="30" rows="10" value={message} onChange={e => setMensaje(e.target.value)}></textarea>
                    <button>Enviar</button>
                </form>
            </div>
        </div>
    )
}
export default Chat;