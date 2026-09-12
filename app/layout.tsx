import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono, Unbounded } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-unbounded',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  preload: true,
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: 'LIMÓN — A Citrus Experience',
  description: 'An immersive editorial journey into the world of the lemon. Sophisticated, surreal, cinematic.',
  openGraph: {
    title: 'LIMÓN',
    description: 'An immersive editorial journey into the world of the lemon.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#fefce8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} ${unbounded.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}