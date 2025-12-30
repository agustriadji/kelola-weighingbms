import 'reflect-metadata';
import './globals.css';
import GlobalLoading from '@/components/shared/GlobalLoading';

export const metadata = {
  title: 'WBMS',
  description: 'wbms',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Disable console.log in production

  //console.log = () => {};

  return (
    <html lang="en">
      <body className="h-screen flex flex-col font-sans text-sm text-gray-800 bg-gray-100">
        {/* header */}
        <div className="min-h-screen z-999">
          <GlobalLoading />
          {children}
        </div>
      </body>
    </html>
  );
}
