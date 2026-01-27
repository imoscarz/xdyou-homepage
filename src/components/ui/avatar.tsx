"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { getImageProps } from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

// const AvatarImage = React.forwardRef<
//   React.ElementRef<typeof AvatarPrimitive.Image>,
//   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
// >(({ className, ...props }, ref) => (
//   <AvatarPrimitive.Image
//     ref={ref}
//     className={cn("aspect-square h-full w-full", className)}
//     {...props}
//   />
// ));
// AvatarImage.displayName = AvatarPrimitive.Image.displayName;

// ref: https://github.com/radix-ui/primitives/issues/2230#issuecomment-2568587173
type AvatarImageProps = {
  src?: string;
  alt: string;
  /**
   * 是否优化图片
   * 默认 true（不优化），节省 Vercel 图片优化限额
   * 对于小头像（通常 ≤64px）不需要优化
   */
  unoptimized?: boolean;
} & React.ComponentProps<typeof AvatarPrimitive.Image>;

function AvatarImage({ src, alt, className, unoptimized = true, ...rest }: AvatarImageProps) {
  if (!src) return null;
  // Use provided sizes if present, otherwise fall back to a sensible default (48px)
  const sizes = (rest as unknown as { sizes?: string }).sizes ?? "48px";
  // Derive an integer pixel size from sizes string
  const requestedPx = (() => {
    const m = String(sizes).match(/(\d+)/);
    const n = m ? parseInt(m[1], 10) : 48;
    return Number.isFinite(n) && n > 0 ? n : 48;
  })();

  // If the src is a GitHub avatar, add s=<size> query to reduce upstream bytes
  let finalSrc = src;
  try {
    const u = new URL(src);
    if (u.hostname === "avatars.githubusercontent.com") {
      const hasSize = u.searchParams.has("s") || u.searchParams.has("size");
      if (!hasSize) {
        u.searchParams.set("s", String(requestedPx));
      }
      finalSrc = u.toString();
    }
  } catch {
    // ignore invalid URL (likely local image path)
  }

  const { props } = getImageProps({ src: finalSrc, alt, fill: true, sizes, unoptimized });
  return <AvatarPrimitive.Image {...props} {...rest} className={className} />;
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "bg-muted flex h-full w-full items-center justify-center rounded-full",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
