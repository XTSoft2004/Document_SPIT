// src/hooks/useAnalytics.ts
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import * as gtag from "@/lib/gtag";

export function useAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname) {
            const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");
            gtag.pageview(url);
        }
    }, [pathname, searchParams]);
}
