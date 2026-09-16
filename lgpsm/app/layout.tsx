import type { Metadata } from "next";
import { Inter, Space_Grotesk, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LGPSM - Digital Invitations for Today's Events",
  description: "Design, customize, and share stunning QR-based invitations for events and celebrations all in one simple platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-gray-900 selection:bg-[#FF5B22] selection:text-white">
        {children}
      </body>
    </html>
  );
}
