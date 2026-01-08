"use client"

import RoleBasedLayout from "./role-based-layout"
import React, { useEffect, useState } from "react"
import { useWebSocket } from "@/contexts/WebSocketContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, CheckCircle2, Bell } from "lucide-react"

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

export default function SiswaLayout({ children, pathName }: { children: React.ReactNode, pathName: string }) {
    const { lastMessage } = useWebSocket();
    const [notification, setNotification] = useState<NotificationMessage | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (lastMessage) {
            try {
                const parsedMessage = JSON.parse(lastMessage.data);
                if (parsedMessage.type === "pkl_approved") {
                    setNotification(parsedMessage);
                    setIsVisible(true);

                    // Optional: Auto-hide after 10 seconds
                    // setTimeout(() => setIsVisible(false), 10000);
                }
            } catch (error) {
                console.error("Error parsing WebSocket message in layout:", error);
            }
        }
    }, [lastMessage]);

    return (
        <RoleBasedLayout role="ssw" breadcrumbTitle={pathName}>
            {children}

            {/* Floating Notification Card */}
            {isVisible && notification && (
                <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <Card className="border-l-4 border-l-green-500 shadow-xl bg-white dark:bg-slate-900">
                        <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                            <div className="flex items-center gap-2">
                                <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <CardTitle className="text-sm font-semibold">
                                    Pengajuan PKL Disetujui
                                </CardTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -mt-1 -mr-2 text-slate-400 hover:text-slate-600"
                                onClick={() => setIsVisible(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                                Selamat! Pengajuan Anda di <strong>{notification.data.industri_nama}</strong> telah diterima.
                            </p>
                            <p className="text-xs text-slate-400">
                                {new Date(notification.timestamp).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </RoleBasedLayout>
    )
}