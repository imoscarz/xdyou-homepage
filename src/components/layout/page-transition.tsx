"use client";

import { usePathname, useSearchParams } from "next/navigation";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <div
      key={`${pathname}:${params.get("lang") || "zh"}`}
      className="content-reveal"
    >
      {children}
    </div>
  );
}
