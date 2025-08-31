"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { SocketProvider } from "./context/SocketContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Dripzone</title>
        <meta name="description" content="Dripzone Description" />
        <link rel="icon" href="/site-images/favicon-2.png" sizes="any" />
      </head>
      <body
        className={`${inter.variable} font-inter antialiased`}
      >
        <AuthProvider>
          <LanguageProvider>
            <SocketProvider>
              {children}
            </SocketProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}