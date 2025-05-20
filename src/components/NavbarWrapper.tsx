'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  if (pathname === ('/') || pathname === '/login' || pathname === '/signup') {
    return <Navbar/>;
  }

  return null;
}