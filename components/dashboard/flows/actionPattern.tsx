"use client";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import React, { forwardRef, useRef } from "react";
import { Library, CircleSlash, BadgeCheck, Rocket, Forklift, Combine } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Separator } from '@/components/ui/separator';
import { Badge } from "@/components/ui/badge"

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
      className="relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-background border p-10 md:shadow-xl"
      style={{ backgroundColor: "#2c3035" }}
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-row flex-wrap items-stretch justify-between gap-10">
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
        <Drawer>
          <DrawerTrigger asChild>
            <div className="flex flex-col justify-center items-center">
              <Circle ref={div3Ref} className="bg-red-500 ">
                <CircleSlash className="text-black" />
              </Circle>
              <h4>Pattern Exclude Check</h4>
            </div>
          </DrawerTrigger>
          <DrawerContent className="mb-10 items-center">
            <DrawerHeader>
              <DrawerTitle>
                <div className="flex gap-2 items-center">
                  <CircleSlash style={{ color: 'red' }} />
                  Exclude Patterns ({action.patterns.exclude.length})
                </div>
              </DrawerTitle>
            </DrawerHeader>
            <div>
              <Table className="mt-2 w-[600px]">
                <TableCaption>A list of your Flows exclude patterns.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>React On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {action.patterns.exclude.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.group}</TableCell>
                      <TableCell>{item.key}</TableCell>
                      <TableCell>{item.value}</TableCell>
                      <TableCell>{item.react_on}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DrawerContent>
        </Drawer>
        <Drawer>
          <DrawerTrigger asChild>
            <div className="flex flex-col justify-center items-center">
              <Circle ref={div4Ref} className="bg-green-500">
                <BadgeCheck className="text-black" />
              </Circle>
              <h4>Pattern Match Check</h4>
            </div>
          </DrawerTrigger>
          <DrawerContent className="mb-10 items-center">
            <DrawerHeader>
              <DrawerTitle>
                <div className="flex gap-2 items-center">
                  <BadgeCheck style={{ color: 'green' }} />
                  Match Patterns ({action.patterns.match.length})
                </div>
              </DrawerTitle>
            </DrawerHeader>
            <div>
              <Table className="mt-2 w-[600px]">
                <TableCaption>A list of your Flows match patterns.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>React On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {action.patterns.match.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.group}</TableCell>
                      <TableCell>{item.key}</TableCell>
                      <TableCell>{item.value}</TableCell>
                      <TableCell>{item.react_on}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DrawerContent>
        </Drawer>
        <div className="flex flex-col justify-center items-center">
          <Circle ref={div5Ref}>
            <Rocket className="text-black" />
          </Circle>
          <h4>Start Execution</h4>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex flex-col justify-center items-center">
              <Circle ref={div6Ref}>
                <Forklift className="text-black" />
              </Circle>
              <h4>{action.name}</h4>
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <div className="flex gap-2 items-center">
                  {action.name}
                  <Badge style={{ backgroundColor: action.active ? 'green' : 'red' }}>{action.active ? 'Active' : 'Inactive'}</Badge>
                </div>
              </SheetTitle>
              <SheetDescription>
                {action.description}
              </SheetDescription>
            </SheetHeader>
            <Separator />
            <div className="grid gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Action Type</p>
                <Label>{action.type}</Label>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Params</p>
                <Label>action params</Label>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <AnimatedBeam
        duration={5}
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        pathWidth={4}
      />
      <AnimatedBeam
        duration={5}
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div3Ref}
        pathWidth={4}
      />
      <AnimatedBeam
        duration={5}
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        pathWidth={4}
      />
      <AnimatedBeam
        duration={5}
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div5Ref}
        pathWidth={4}
      />
      <AnimatedBeam
        duration={5}
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
        curvature={-25}
        pathWidth={4}
      />
      <AnimatedBeam
        duration={5}
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div5Ref}
        reverse
        curvature={25}
        pathWidth={4}
      />
    </div>
  )
}