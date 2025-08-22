// src/components/GlobalClickTracker.tsx
"use client";

import { useEffect } from "react";
import { event } from "@/lib/gtag";

export default function GlobalClickTracker() {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");
            if (link && link.href) {
                event({
                    action: "click_link",
                    category: "navigation",
                    label: link.href,
                });
            }
        };

        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    return null;
}
