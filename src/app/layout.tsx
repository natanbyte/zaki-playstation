import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zaki Playstation · Masuk ke Sistem",
  description: "Sistem Manajemen Rental & Kasir PlayStation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark h-full">
      <body className="min-h-full flex flex-col bg-[#0D0E10] text-[#EDEDED] antialiased selection:bg-[#C8F135] selection:text-black">
        {children}
      </body>
    </html>
  );
}
