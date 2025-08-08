"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Dripzone</title>
        <meta name="description" content="Dripzone Description" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/site-images/favicon-2.png" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-inter`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}