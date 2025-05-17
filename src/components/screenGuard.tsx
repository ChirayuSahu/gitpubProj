"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ScreenGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function checkWidth() {
      if (window.innerWidth < 1024) {
        if (pathname !== "/no-mobile") {
          router.replace("/no-mobile");
        }
      } else {
        if (pathname === "/no-mobile") {
          router.back();
        }
      }
    }

    checkWidth();

    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, [pathname, router]);

  return null;
}
