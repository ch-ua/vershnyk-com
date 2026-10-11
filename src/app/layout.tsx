import "./globals.css";
import SiteFooter from "./components/SiteFooter";
export const metadata={title:"VERSHNYK | Handwerk & Montage",description:"Handwerk, Montage, Garten und Küchenmontage."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="de"><body>{children}<SiteFooter/></body></html>}
