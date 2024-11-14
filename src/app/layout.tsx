import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from '@/providers';
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/layouts";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vulcan Launchpad",
  description: "ICO launchpad",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon.svg",
        href: "/favicon.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon.svg",
        href: "/favicon.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head></head>
      <body className={inter.className} suppressHydrationWarning={true}>
          <Provider>
            <Layout>
              {children}
            </Layout>
          </Provider>
      </body>
    </html>
  );
}
