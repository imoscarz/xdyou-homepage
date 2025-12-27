"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { MotionProps } from "motion/react";
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  disableMagnification?: boolean;
  iconDistance?: number;
  direction?: "top" | "middle" | "bottom";
  children: React.ReactNode;
}

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;
const DEFAULT_DISABLEMAGNIFICATION = false;

const dockVariants = cva(
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 mx-auto mt-8 flex h-[58px] w-max items-center justify-center gap-2 rounded-2xl border p-2 backdrop-blur-md",
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      disableMagnification = DEFAULT_DISABLEMAGNIFICATION,
      iconDistance = DEFAULT_DISTANCE,
      direction = "middle",
      ...props
    },
    ref,
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const mouseX = useMotionValue(Infinity);

    useEffect(() => {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
      };

      checkIsMobile();
      window.addEventListener("resize", checkIsMobile);

      return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (
          React.isValidElement<DockIconProps>(child) &&
          child.type === DockIcon
        ) {
          return React.cloneElement(child, {
            ...child.props,
            mouseX: isMobile ? undefined : mouseX,
            size: iconSize,
            magnification: iconMagnification,
            disableMagnification: disableMagnification || isMobile,
            distance: iconDistance,
          });
        }
        return child;
      });
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={isMobile ? undefined : (e) => mouseX.set(e.pageX)}
        onMouseLeave={isMobile ? undefined : () => mouseX.set(Infinity)}
        {...props}
        className={cn(dockVariants({ className }), {
          "items-start": direction === "top",
          "items-center": direction === "middle",
          "items-end": direction === "bottom",
        })}
      >
        {renderChildren()}
      </motion.div>
    );
  },
);

Dock.displayName = "Dock";

export interface DockIconProps
  extends Omit<MotionProps & React.HTMLAttributes<HTMLDivElement>, "children"> {
  size?: number;
  magnification?: number;
  disableMagnification?: boolean;
  distance?: number;
  mouseX?: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
  props?: PropsWithChildren;
  fluid?: boolean;
}

const DockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  disableMagnification,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  fluid,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const padding = Math.max(6, size * 0.2);
  const defaultMouseX = useMotionValue(Infinity);

  // 如果没有 mouseX 或禁用了放大，使用固定尺寸
  const shouldAnimate = mouseX && !disableMagnification;

  const distanceCalc = useTransform(
    shouldAnimate ? mouseX : defaultMouseX,
    (val: number) => {
      const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
      return val - bounds.x - bounds.width / 2;
    },
  );

  const targetSize = disableMagnification ? size : magnification;

  const sizeTransform = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, targetSize, size],
  );

  const scaleTransform = useTransform(sizeTransform, (val: number) =>
    size === 0 ? 1 : val / size,
  );

  const scaleValue = useSpring(scaleTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{
        width:
          fluid && !disableMagnification
            ? "auto"
            : fluid && disableMagnification
              ? "auto"
              : shouldAnimate
                ? scaleSize
                : size,
        height: fluid ? size : shouldAnimate ? scaleSize : size,
        padding: fluid ? 0 : padding,
        scale: fluid && shouldAnimate ? scaleValue : undefined,
      }}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-full",
        !fluid && "aspect-square",
        disableMagnification && "hover:bg-muted-foreground transition-colors",
        className,
      )}
      {...props}
    >
      <div>{children}</div>
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
