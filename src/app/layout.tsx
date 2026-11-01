import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel Lovers — Travel More • Worry Less | Bangladesh Bus Ticket Booking",
  description:
    "Book luxury bus tickets across Bangladesh with Green Line, Shohagh, Shyamoli, Hanif, and Ena. Real-time seat selection, bKash/Nagad payments, and instant digital tickets.",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F6F8FC] text-[#152443] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
