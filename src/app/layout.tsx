import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MagangHub - Sistem Manajemen Magang Terpadu",
  description: "Platform komprehensif untuk mengelola data siswa, industri, dan program magang dengan interface yang modern dan user-friendly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-sidebar-collapsed="true">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent sidebar flicker by setting initial state before React hydration
              (function() {
                try {
                  const collapsed = localStorage.getItem('sidebar-collapsed');
                  if (collapsed !== null) {
                    document.documentElement.setAttribute('data-sidebar-collapsed', collapsed);
                  } else {
                    document.documentElement.setAttribute('data-sidebar-collapsed', 'false');
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-sidebar-collapsed', 'false');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        cz-shortcut-listen="true"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
