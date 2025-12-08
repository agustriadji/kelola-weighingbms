import 'reflect-metadata';
import './globals.css';
import { ChatProvider } from '@/contexts/ChatContext';
import GlobalLoading from '@/components/shared/GlobalLoading';

export const metadata = {
  title: 'Dashboard',
  description: 'test',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Disable console.log in production

  console.log = () => { };

  return (
    <html lang="en">
      <body className="h-screen flex flex-col bg-gray-100 text-gray-900">
        {/* header */}
        {/* <Navbar /> */}
        <ChatProvider>
          <GlobalLoading />
          {children}
        </ChatProvider>
      </body>
    </html>
  );
}
