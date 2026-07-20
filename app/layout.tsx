import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from './hooks/useTheme';
import './globals.css';

export const metadata: Metadata = {
  title: 'NyxEditor — Secure Code Editor',
  description: 'A production-grade, security-hardened text editor with zero dynamic code execution.',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#0a0a0a] text-[#00ff41] antialiased overflow-hidden">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
