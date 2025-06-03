"use client";
import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function ClerkUrlCleaner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasDbJwt = searchParams?.has("__clerk_db_jwt");
    if (hasDbJwt) {
      window.location.replace("/");
    }
  }, [searchParams, pathname, router]);

  return null;
}
