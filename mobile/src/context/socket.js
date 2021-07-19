import React from 'react'
import io from "socket.io-client";
import { SOCKET_URL } from "config";

export const socket = io.connect('https://wicked-penguin-8.loca.lt');
export const SocketContext = React.createContext();

    

socket.on("connect", msg => {
  console.log("Connected in socket context", msg)
})

socket.on("chat message", (msg) => {
  console.log('Received on client', msg)
})