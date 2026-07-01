import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

const HUB_URL = 'https://localhost:7059/hubs/matches';

export function useMatchHub(tournamentId, onMatchUpdated) {
    const connectionRef = useRef(null);

    useEffect(() => {
        if (!tournamentId) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        connection.on("MatchUpdated", (match) => {
            console.log("🔴 Live match update:", match);
            onMatchUpdated(match);
        });

        connection.start()
            .then(() => {
                console.log("✅ SignalR connected");
                return connection.invoke("JoinTournament", tournamentId.toString());
            })
            .catch(err => console.error("SignalR connection error:", err));

        connectionRef.current = connection;

        return () => {
            if (connection.state === signalR.HubConnectionState.Connected) {
                connection.invoke("LeaveTournament", tournamentId.toString())
                    .then(() => connection.stop());
            } else {
                connection.stop();
            }
        };
    }, [tournamentId]);

    return connectionRef.current;
}