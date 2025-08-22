// src/hooks/useAnalytics.ts
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import * as gtag from "@/lib/gtag";

export function useAnalytics() {
    const pathname = usePathname();
    useEffect(() => {
        if (pathname) {
            gtag.pageview(pathname);
        }
    }, [pathname]);
}
