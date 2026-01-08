"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { getAccessToken } from "@/utils/auth";
import { toast } from "sonner";

interface WebSocketContextType {
    isConnected: boolean;
    lastMessage: MessageEvent | null;
    sendMessage: (message: string) => void;
    socket: WebSocket | null;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = () => {
        // Only connect in browser environment
        if (typeof window === "undefined") return;

        const token = getAccessToken();
        if (!token) {
            console.log("⚠️ No access token found, skipping WebSocket connection");
            return;
        }

        const url = `wss://api.gedanggoreng.com/ws?token=${token}`;

        try {
            const ws = new WebSocket(url);

            ws.onopen = () => {
                console.log("✅ WebSocket Connected");
                setIsConnected(true);
                // Clear any pending reconnect
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
            };

            ws.onmessage = (event) => {
                // console.log("📩 WebSocket Message:", event.data);
                setLastMessage(event);
            };

            ws.onclose = (event) => {
                console.log("❌ WebSocket Disconnected:", event.code, event.reason);
                setIsConnected(false);
                socketRef.current = null;

                // Attempt reconnect if not normal closure
                if (event.code !== 1000) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log("🔄 Attempting to reconnect...");
                        connect();
                    }, 3000);
                }
            };

            ws.onerror = (error) => {
                console.error("🔥 WebSocket Error:", error);
                ws.close();
            };

            socketRef.current = ws;
        } catch (err) {
            console.error("Failed to create WebSocket:", err);
        }
    };

    useEffect(() => {
        connect();

        return () => {
            if (socketRef.current) {
                socketRef.current.close(1000, "Component unmounting");
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    const sendMessage = (message: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
        } else {
            console.warn("WebSocket is not open. Cannot send message.");
            toast.error("Tidak terhubung ke server WebSocket");
        }
    };

    return (
        <WebSocketContext.Provider
            value={{ isConnected, lastMessage, sendMessage, socket: socketRef.current }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
};
