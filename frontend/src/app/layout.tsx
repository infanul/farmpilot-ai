import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LiveFarmBackground } from '../components/ui/LiveFarmBackground';

export const metadata: Metadata = {
  title: 'FarmPilot AI — Your Intelligent Farming Companion',
  description: 'Smarter Decisions. Healthier Crops. Better Harvests. Full-stack intelligent digital farming assistant.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans relative">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              {/* Live Dynamic Atmospheric Farming Background */}
              <LiveFarmBackground />

              <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 w-full">{children}</main>
                <Footer />
              </div>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
