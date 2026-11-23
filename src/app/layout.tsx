import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CyberBackground from '@/components/CyberBackground';
import RecruitmentBanner from '@/components/RecruitmentBanner';
import { EVENT_DETAILS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Volunteer Recruitments | CyberFest 2027 • DDC CBIT',
  description: 'Volunteer Recruitments for CyberFest 2027, organized by Digital Defence Club (DDC), Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad.',
  keywords: [
    'Volunteer Recruitments',
    'CyberFest 2027',
    'DDC CBIT',
    'Digital Defence Club',
    'Cybersecurity Conclave Hyderabad',
    'CBIT Hyderabad',
  ],
  authors: [{ name: 'Digital Defence Club (DDC), CBIT' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-400 selection:text-black">
        <RecruitmentBanner />
        <CyberBackground />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
