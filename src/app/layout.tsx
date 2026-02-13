import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CoatOfArms from '@/components/CoatOfArms';
import './globals.css';

export const metadata: Metadata = {
  title: 'Família Cipriano — Museu Digital',
  description: 'Árvore genealógica e museu digital da Família Cipriano. Preservando nossa história para as futuras gerações.',
  keywords: ['Cipriano', 'genealogia', 'árvore genealógica', 'família', 'história'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <CoatOfArms variant="watermark" />
        <Header />
        <main style={{ paddingTop: '4.5rem', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
