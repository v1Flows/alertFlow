/* eslint-disable no-undef */
import React, { forwardRef, useRef } from "react";
import {
  Library,
  Rocket,
  Combine,
  CircleSlash,
  BadgeCheck,
  Forklift,
} from "lucide-react";
import {
  Card,
  CardBody,
  cn,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { AnimatedBeam } from "@/components/magicui/animated-beam";

// eslint-disable-next-line react/display-name
const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

export default function FlowPattern({ action }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <Card className="mb-6 w-full">
        <CardBody className="mb-2">
          <div
            ref={containerRef}
            className="relative flex h-full w-full justify-between"
          >
            <div className="grid lg:grid-cols-6 w-full h-full gap-8">
              <div className="flex flex-col justify-center items-center">
                <Circle ref={div1Ref} className="bg-default">
                  <Icon
                    className="text-foreground"
                    icon="solar:letter-opened-broken"
                    width={24}
                  />
                </Circle>
                <h4>Incoming Payload</h4>
              </div>
              <div className="flex flex-col justify-center items-center">
                <Circle ref={div2Ref} className="bg-default">
                  <Icon
                    className="text-foreground"
                    icon="solar:reorder-line-duotone"
                    width={24}
                  />
                </Circle>
                <h4>Start Execution</h4>
              </div>
              <div className="flex flex-col justify-center items-center">
                <Circle ref={div3Ref} className="bg-default">
                  <Combine className="text-foreground" />
                </Circle>
                <h4>Get Action Patterns</h4>
              </div>
              <Popover backdrop="opaque" offset={10} placement="top">
                <PopoverTrigger>
                  <div className="flex flex-col justify-center items-center">
                    <Circle ref={div4Ref} className="bg-danger">
                      <CircleSlash className="text-black" />
                    </Circle>
                    <h4>Pattern Exclude Check</h4>
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <Table aria-label="Action Patterns" className="w-full">
                    <TableHeader>
                      <TableColumn>GROUP</TableColumn>
                      <TableColumn>KEY</TableColumn>
                      <TableColumn>VALUE</TableColumn>
                      <TableColumn>REACT ON</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {action.exclude_patterns &&
                        action.exclude_patterns.map(
                          (pattern: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{pattern.group}</TableCell>
                              <TableCell>{pattern.key}</TableCell>
                              <TableCell>{pattern.value}</TableCell>
                              <TableCell>{pattern.react_on}</TableCell>
                            </TableRow>
                          ),
                        )}
                    </TableBody>
                  </Table>
                </PopoverContent>
              </Popover>
              <Popover showArrow backdrop="opaque" offset={10} placement="top">
                <PopoverTrigger>
                  <div className="flex flex-col justify-center items-center">
                    <Circle ref={div5Ref} className="bg-green-500">
                      <BadgeCheck className="text-black" />
                    </Circle>
                    <h4>Pattern Match Check</h4>
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <Table aria-label="Action Patterns" className="w-full">
                    <TableHeader>
                      <TableColumn>GROUP</TableColumn>
                      <TableColumn>KEY</TableColumn>
                      <TableColumn>VALUE</TableColumn>
                      <TableColumn>REACT ON</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {action.match_patterns &&
                        action.match_patterns.map(
                          (pattern: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{pattern.group}</TableCell>
                              <TableCell>{pattern.key}</TableCell>
                              <TableCell>{pattern.value}</TableCell>
                              <TableCell>{pattern.react_on}</TableCell>
                            </TableRow>
                          ),
                        )}
                    </TableBody>
                  </Table>
                </PopoverContent>
              </Popover>
              <Popover showArrow backdrop="opaque" offset={10} placement="top">
                <PopoverTrigger>
                  <div className="flex flex-col justify-center items-center">
                    <Circle ref={div6Ref} className="bg-default">
                      <Forklift className="text-foreground" />
                    </Circle>
                    <h4>{action.name}</h4>
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex flex-col justify-start items-start">
                    <h3 className="text-lg">{action.name}</h3>
                    <p className="text-sm text-default-500">
                      {action.description}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <AnimatedBeam
              containerRef={containerRef}
              duration={5}
              fromRef={div1Ref}
              pathWidth={4}
              toRef={div2Ref}
            />
            <AnimatedBeam
              containerRef={containerRef}
              duration={5}
              fromRef={div2Ref}
              pathWidth={4}
              toRef={div3Ref}
            />
            <AnimatedBeam
              containerRef={containerRef}
              duration={5}
              fromRef={div3Ref}
              pathWidth={4}
              toRef={div4Ref}
            />
            <AnimatedBeam
              containerRef={containerRef}
              duration={5}
              fromRef={div4Ref}
              pathWidth={4}
              toRef={div5Ref}
            />
            <AnimatedBeam
              containerRef={containerRef}
              duration={5}
              fromRef={div5Ref}
              pathWidth={4}
              toRef={div6Ref}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
}
