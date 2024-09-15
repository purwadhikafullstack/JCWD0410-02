import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { ToastContainer } from 'react-toastify';
import NextAuthProvider from '@/providers/NextAuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EaseCoz - Simplifying Your Property Rental Experience',
  description:
    'EaseCoz is a user-friendly platform designed to simplify the property rental process. Whether you are looking to rent or list a property, EaseCoz offers seamless features for finding, comparing, and managing rental properties. Explore affordable and premium options with detailed property listings, secure payment systems, and personalized recommendations to make your rental journey effortless.',
  keywords:
    'EaseCoz, property rental, rent property, rental platform, apartment rentals, house rentals, find property, list property, property management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <ReactQueryProvider>
            <Header />
            {children}
            <Footer />
          </ReactQueryProvider>
        </NextAuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
