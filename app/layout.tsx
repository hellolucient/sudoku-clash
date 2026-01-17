import { WalletProvider } from '@/components/wallet-provider';
import { PlayerProfileProvider } from '@/contexts/player-profile-context';
import { ThemeProvider } from '@/components/theme-provider';
import '@/styles/globals.css';

export const metadata = {
  title: 'Sudoku Clash',
  description: 'A competitive twist on the classic Sudoku puzzle',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0D1117',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <WalletProvider>
            <PlayerProfileProvider>
              {children}
            </PlayerProfileProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
