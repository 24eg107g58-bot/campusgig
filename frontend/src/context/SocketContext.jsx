import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const stompClientRef = useRef(null);
  const listenersRef = useRef(new Set());

  useEffect(() => {
    if (!user || !token) {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
      return;
    }

    const wsUrl = import.meta.env.VITE_API_URL 
      ? `${import.meta.env.VITE_API_URL}/ws` 
      : '/ws';

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        // Subscribe to user-specific message queue
        client.subscribe(`/topic/messages.${user.id}`, (message) => {
          try {
            const data = JSON.parse(message.body);
            listenersRef.current.forEach(callback => callback(data));
          } catch (e) {
            console.error('Error parsing socket message:', e);
          }
        });
      },
      onStompError: (frame) => {
        console.warn('STOMP broker error:', frame.headers['message']);
      }
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [user, token]);

  const onNewMessage = (callback) => {
    listenersRef.current.add(callback);
    return () => {
      listenersRef.current.delete(callback);
    };
  };

  return (
    <SocketContext.Provider value={{ onNewMessage, stompClient: stompClientRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  return context || { onNewMessage: () => () => {}, stompClient: null };
};
