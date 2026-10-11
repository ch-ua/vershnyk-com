import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
export const metadata={title:"VERSHNYK | Handwerk & Montage",description:"Handwerk, Montage, Garten und Küchenmontage."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="de"><body>{children}<Analytics /></body></html>}
