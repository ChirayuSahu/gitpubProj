// components/navbarWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Hide navbar on /campaign
  if (pathname.startsWith('/campaign') || pathname.startsWith('/courses') || pathname.startsWith('/path')) {
    return null;
  }

  return <Navbar />;
}