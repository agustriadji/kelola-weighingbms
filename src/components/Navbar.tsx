'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-black text-white p-4">
      <div className="flex space-x-4">
        <Link href="/sales" className="font-semibold">Sales</Link>
        <Link href="/ai-prompt">AI Prompt</Link>
      </div>
      <div className="flex space-x-4">
      </div>
    </nav>
  )
}
