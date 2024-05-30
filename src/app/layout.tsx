import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://fip171.com'),
  title: "FIP171",
  description: "A demo app showing how FIP171 can be implemented",
  icons: {
    icon: 'https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmVaTM359zQtweVbBP5m4WkiRW581WeEV6nhcpVzUsNskC',
    shortcut: 'https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmVaTM359zQtweVbBP5m4WkiRW581WeEV6nhcpVzUsNskC',
    apple: 'https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmVaTM359zQtweVbBP5m4WkiRW581WeEV6nhcpVzUsNskC',
    other: {
      rel: 'https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmVaTM359zQtweVbBP5m4WkiRW581WeEV6nhcpVzUsNskC',
      url: 'https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmVaTM359zQtweVbBP5m4WkiRW581WeEV6nhcpVzUsNskC',
    },
  },
  openGraph: {
    title: 'FIP171',
    description: 'A demo app showing how FIP171 can be implemented',
    url: 'https://fip171.com',
    siteName: 'FIP171',
    images: [
      {
        url: 'https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmPVaoYNRZ8CicHPd8crho3dXi44CqAQ2KdTJRQjzAVLiK', // Must be an absolute URL
        width: 800,
        height: 600,
      },      
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white text-black">
      <body className={`${inter.className} h-full`}>
        {children}
      </body>
    </html>
  );
}
