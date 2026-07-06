import { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const LiveUpdatesContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7059/api/';
const HUB_URL = API_URL.replace('/api/', '/hubs/matches');

export function LiveUpdatesProvider({ children }) {
    const [latestUpdate, setLatestUpdate] = useState(null);
    const connectionRef = useRef(null);

    useEffect(() => {
        const conn = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        conn.on("GlobalMatchUpdated", (update) => {
            setLatestUpdate({ ...update, timestamp: Date.now() });
        });

        conn.start()
            .then(() => conn.invoke("JoinGlobal"))
            .catch(err => console.error("Global SignalR error:", err));

        connectionRef.current = conn;

        return () => {
            if (conn.state === signalR.HubConnectionState.Connected) {
                conn.invoke("LeaveGlobal").then(() => conn.stop());
            } else {
                conn.stop();
            }
        };
    }, []);

    const clearUpdate = () => setLatestUpdate(null);

    return (
        <LiveUpdatesContext.Provider value={{ latestUpdate, clearUpdate }}>
            {children}
        </LiveUpdatesContext.Provider>
    );
}

export function useLiveUpdates() {
    return useContext(LiveUpdatesContext);
}