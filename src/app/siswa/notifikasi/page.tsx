"use client";

import React, { useEffect, useState } from "react";
import { useWebSocket } from "@/contexts/WebSocketContext";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Briefcase, Calendar, CheckCircle2 } from "lucide-react";

interface NotificationData {
    application_id: number;
    siswa_id: number;
    siswa_username: string;
    siswa_nama: string;
    industri_id: number;
    industri_nama: string;
    jurusan_id: number;
    jurusan_nama: string;
    status: string;
    catatan: string | null;
}

interface NotificationMessage {
    type: string;
    data: NotificationData;
    timestamp: string;
}

export default function NotifikasiPage() {
    const { lastMessage, isConnected } = useWebSocket();
    const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

    useEffect(() => {
        console.log(lastMessage)
        if (lastMessage) {
            try {
                const parsedMessage = JSON.parse(lastMessage.data);
                if (parsedMessage.type === "pkl_approved") {
                    setNotifications((prev) => [parsedMessage, ...prev]);
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        }
    }, [lastMessage]);

    console.log(notifications)
    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Notifikasi</h1>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-sm text-muted-foreground">{isConnected ? "Terhubung Real-time" : "Terputus"}</span>
                </div>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-4">
                        <Bell className="w-12 h-12 opacity-20" />
                        <p>Tidak ada notifikasi baru</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notif, index) => (
                            <Card key={index} className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                Pengajuan PKL Disetujui
                                            </CardTitle>
                                            <CardDescription>
                                                Selamat! Pengajuan PKL Anda telah diterima.
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                            {notif.data.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-3 text-sm mt-2">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Briefcase className="w-4 h-4" />
                                            <span className="font-medium text-foreground">{notif.data.industri_nama}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(notif.timestamp).toLocaleString("id-ID", {
                                                dateStyle: "full",
                                                timeStyle: "short"
                                            })}</span>
                                        </div>
                                        {notif.data.catatan && (
                                            <div className="bg-muted/50 p-3 rounded-md mt-2 text-sm italic">
                                                "{notif.data.catatan}"
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}