import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './globals.css';

export const metadata = {
  title: 'DevPulse',
  description: 'DevPulse Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--bg)] text-[var(--text-primary)] antialiased min-h-screen transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
