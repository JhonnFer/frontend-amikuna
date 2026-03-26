// src/hooks/useSocket.js
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import getAuthHeaders from "../helpers/getAuthHeaders.js";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const useSocket = (chatId, onNuevoMensaje) => {
    const [isConnected, setIsConnected] = useState(false);
    const socket = useRef(null);

    useEffect(() => {
        
        if (!chatId) return;

        const authHeaders = getAuthHeaders();
        const fullToken = authHeaders?.headers?.Authorization;
        const tokenFromHeaders = fullToken?.startsWith("Bearer ")
            ? fullToken.split(" ")[1]
            : fullToken;

        const token = tokenFromHeaders || localStorage.getItem("token");
        

        if (!token) {
            console.error("No se encontró token de autenticación para el socket.");
            return;
        }

        socket.current = io(SOCKET_URL, {
            auth: { token: token },
            query: { chatId: chatId },
        });

        socket.current.on('connect', () => {
            setIsConnected(true);
            if (chatId) {
                // Esto envía el evento al backend para unirse a la sala
                socket.current.emit('join:chat', chatId); 
            }
        });
        

        socket.current.on("connect_error", (err) => {
  console.error("✗ Error conectando socket:", err.message); // ← clave
});

socket.current.on("disconnect", (reason) => {
  console.log("Socket desconectado, razón:", reason); // ← clave
  setIsConnected(false);
});

        socket.current.on('disconnect', () => {
            setIsConnected(false);
        });

        // <<-- CAMBIO CLAVE AQUÍ -->>
        // Escuchamos el evento correcto que tu backend envía
        socket.current.on('mensaje:nuevo', (data) => onNuevoMensaje(data.mensaje));

        return () => {
            if (socket.current) {
                socket.current.off('mensaje:nuevo', onNuevoMensaje);
                socket.current.disconnect();
            }
        };
    }, [chatId, onNuevoMensaje]);

    // <<-- CAMBIO CLAVE AQUÍ -->>
    // Retornamos la función para emitir el mensaje
    const emitMessage = (payload) => {
        if (socket.current && isConnected) {
            socket.current.emit('chat:mensaje', payload);
        }
    };

    return { isConnected, emitMessage };
};

export default useSocket;
