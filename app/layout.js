import localFont from "next/font/local";
import "./globals.css";
import ClientInterceptor from "./components/ClientInterceptor";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Sistema Gestión ProdeÓptica",
  description: "Sistema integral de gestión óptica, refracción clínica y punto de venta",
  icons: {
    icon: "/img/logo.webp",
    shortcut: "/img/logo.webp",
    apple: "/img/logo.webp",
    other: {
      rel: "apple-touch-icon",
      url: "/img/logo.webp",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientInterceptor />
        {children}
      </body>
    </html>
  );
}
