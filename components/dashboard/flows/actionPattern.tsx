"use client";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import React, { forwardRef, useRef } from "react";
import { Library, CircleSlash, BadgeCheck, Rocket, Forklift, Combine } from 'lucide-react';

// eslint-disable-next-line react/display-name
const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

export function FlowActionPattern({ action }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-10 md:shadow-xl"
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center items-center">
          <Circle ref={div1Ref}>
            <Library className="text-black" />
          </Circle>
          <h4>Incoming Payload</h4>
        </div>
        <div className="flex flex-col justify-center items-center">
          <Circle ref={div2Ref}>
            <Combine className="text-black" />
          </Circle>
          <h4>Get Action Patterns</h4>
        </div>
        <div className="flex flex-col justify-center items-center">
          <Circle ref={div3Ref} className="bg-red-500 ">
            <CircleSlash className="text-black" />
          </Circle>
          <h4>Pattern Exclude Check</h4>
        </div>
        <div className="flex flex-col justify-center items-center">
          <Circle ref={div4Ref} className="bg-green-500">
            <BadgeCheck className="text-black" />
          </Circle>
          <h4>Pattern Match Check</h4>
        </div>
        <div className="flex flex-col justify-center items-center">
          <Circle ref={div5Ref}>
            <Rocket className="text-black" />
          </Circle>
          <h4>Start Execution</h4>
        </div>
        <div className="flex flex-col justify-center items-center">
          <Circle ref={div6Ref}>
            <Forklift className="text-black" />
          </Circle>
          <h4>{action.name}</h4>
        </div>
      </div>

      <AnimatedBeam
        duration={5}
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
      />
      <AnimatedBeam
        duration={5}
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div3Ref}
      />
      <AnimatedBeam
        duration={5}
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        duration={5}
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div5Ref}
      />
      <AnimatedBeam
        duration={5}
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
        curvature={-25}
      />
      <AnimatedBeam
        duration={5}
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div5Ref}
        reverse
        curvature={25}
      />
    </div>
  )
}