"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

export default function DownloadCard({
  id,
  name,
  icon,
  note,
  className,
  children,
}: {
  id: string;
  name: string;
  icon: keyof typeof Icons;
  note?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const Icon = Icons[icon];
  useEffect(() => {
    const revealTarget = () => {
      if (window.location.hash === `#download-${id}`) setOpen(true);
    };
    revealTarget();
    const revealDownload = (event: Event) => {
      if ((event as CustomEvent<string>).detail === `#download-${id}`)
        setOpen(true);
    };
    window.addEventListener("hashchange", revealTarget);
    window.addEventListener("platform-download", revealDownload);
    return () => {
      window.removeEventListener("hashchange", revealTarget);
      window.removeEventListener("platform-download", revealDownload);
    };
  }, [id]);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);
  return (
    <div
      ref={root}
      id={`download-${id}`}
      className={cn("relative h-40 scroll-mt-24", open && "z-20", className)}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={() => {
        if (!root.current?.contains(document.activeElement)) setOpen(false);
      }}
      onFocusCapture={(event) => {
        if (event.target.matches(":focus-visible")) setOpen(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          (root.current?.querySelector("button") as HTMLButtonElement)?.focus();
          setOpen(false);
          event.stopPropagation();
        }
      }}
    >
      <div
        className={cn(
          "surface-card absolute inset-x-0 top-0 overflow-hidden transition-[border-color,box-shadow] duration-200",
          open && "border-foreground/20 shadow-lg",
        )}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`download-options-${id}`}
          onClick={(event) => {
            // A mouse enters before clicking; keep the hover-open panel open.
            if (
              event.detail > 0 &&
              window.matchMedia("(hover: hover)").matches
            ) {
              setOpen(true);
            } else {
              setOpen((value) => !value);
            }
          }}
          className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl px-3 text-center focus-visible:outline-2 focus-visible:outline-offset-[-4px]"
        >
          {["android", "ohos", "ios", "windows", "linux"].includes(id) ? (
            <Image
              src={`/images/platforms/${id}.webp`}
              alt=""
              width={48}
              height={48}
              className="mb-1 size-12 object-contain dark:invert"
            />
          ) : (
            <Icon className="mb-1 size-7" />
          )}
          <span className="text-sm font-medium">{name}</span>
          <span className="text-muted-foreground min-h-4 text-[11px]">
            {note}
          </span>
          <Icons.chevrondown
            className={cn(
              "text-muted-foreground size-3 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
        <div
          id={`download-options-${id}`}
          aria-hidden={!open}
          inert={!open}
          className="grid transition-[grid-template-rows,opacity] duration-200 ease-out"
          style={{
            gridTemplateRows: open ? "1fr" : "0fr",
            opacity: open ? 1 : 0,
          }}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="max-h-[55dvh] space-y-3 overflow-y-auto border-t p-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
