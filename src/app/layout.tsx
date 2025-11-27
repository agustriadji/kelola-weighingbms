import "reflect-metadata";
import "./globals.css";
// import Navigation from "@/components/navigation";
// import QueryProvider from "@/components/queryProvider";
import Navbar from "../components/Navbar";
import { ChatProvider } from "@/contexts/ChatContext";


export const metadata = {
  title: 'Dashboard',
  description: 'test',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className="h-screen flex flex-col bg-gray-100 text-gray-900">
        {/* header */}
        {/* <Navbar /> */}
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}
