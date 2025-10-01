import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { DataProvider } from "@/contexts/DataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Controle de Financa",
  description: "Organize sua vida financeira, entradas, saídas e muito mais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}