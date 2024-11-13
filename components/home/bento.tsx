"use client";

import React from "react";
import { Image, Tooltip } from "@nextui-org/react";
import createGlobe from "cobe";
import { useEffect, useRef, forwardRef } from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";

import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { cn } from "@/lib/utils";

import { title } from "../primitives";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Combine everything in Projects",
      description:
        "Projects are the key part of AlertFlow. Here you manage User Access, assign Flows and more.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Easy Access & Navigation",
      description:
        "With our easy to use interface and shortcut based search, you can navigate through your projects, flows, etc. with ease.",
      skeleton: <SkeletonFour />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Enterprise ready",
      description:
        "With the enterprise plan we offer oAuth, unlimited projects and more.",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r  dark:border-neutral-800",
    },
    {
      title: "Automate your needs",
      description:
        "With Flow Actions you can define automations for your alarms. For one Alarm, or just all of them.",
      skeleton: <SkeletonTwo />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];

  return (
    <div className="relative z-20 max-w-7xl mx-auto">
      <div className="px-8">
        <div className="text-center">
          <h1 className={title({ size: "lg" })}>
            Packed with{" "}
            <h1 className={title({ color: "green", size: "lg" })}>
              fundamental features.
            </h1>{" "}
          </h1>
        </div>

        <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
          From sending emails to trigger ansible playbooks. AlertFlow offers you
          many ways to react on your Infrastructure Alarms. You say what you
          need, we do the rest.
        </p>
      </div>

      <div className="relative ">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className=" h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="font-bold max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base  max-w-4xl text-left mx-auto",
        "text-neutral-500 text-center font-normal dark:text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2",
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  const { theme } = useTheme();
  const isSSR = useIsSSR();

  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto bg-transparent group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
          <Image
            alt="header"
            className="h-full w-full aspect-square object-cover object-left-top rounded-sm"
            height={400}
            src={`/images/project_${theme === "light" || isSSR ? "white" : "dark"}.png`}
            width={800}
          />
        </div>

        <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
        <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
      </div>
    </div>
  );
};

// eslint-disable-next-line react/display-name
const Circle = forwardRef<
  // eslint-disable-next-line no-undef
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-12 w-12 items-center justify-center rounded-full bg-default p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

export const SkeletonTwo = () => {
  // eslint-disable-next-line no-undef
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line no-undef
  const div1Ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line no-undef
  const div2Ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line no-undef
  const div3Ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line no-undef
  const div6Ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line no-undef
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden p-10",
      )}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}>
            <Tooltip color="primary" content="Incoming Payloads" offset={16}>
              <Icon icon="solar:letter-opened-broken" width={24} />
            </Tooltip>
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-16">
            <Tooltip color="primary" content="Flow Actions" offset={16}>
              <Icon icon="solar:bolt-broken" width={32} />
            </Tooltip>
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-10">
          <Circle ref={div1Ref}>
            <Tooltip color="primary" content="Send an Email" offset={16}>
              <Icon icon="solar:mailbox-broken" width={32} />
            </Tooltip>
          </Circle>
          <Circle ref={div2Ref}>
            <Tooltip color="primary" content="Trigger an Webhook" offset={16}>
              <Icon icon="solar:global-broken" width={32} />
            </Tooltip>
          </Circle>
          <Circle ref={div3Ref}>
            <Tooltip
              color="primary"
              content="Trigger an Push Notification"
              offset={16}
            >
              <Icon icon="solar:smartphone-vibration-broken" width={32} />
            </Tooltip>
          </Circle>
        </div>
      </div>

      {/* AnimatedBeams */}
      <AnimatedBeam
        containerRef={containerRef}
        duration={3}
        fromRef={div1Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        duration={3}
        fromRef={div2Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        duration={3}
        fromRef={div3Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        duration={3}
        fromRef={div6Ref}
        toRef={div7Ref}
      />
    </div>
  );
};

export const SkeletonThree = () => {
  const { theme } = useTheme();
  const isSSR = useIsSSR();

  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
        <Image
          alt="header"
          className="h-full w-full aspect-square object-cover object-left-top rounded-sm"
          height={250}
          src={`/images/plan_${theme === "light" || isSSR ? "white" : "dark"}.png`}
          width={800}
        />
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const SkeletonFour = () => {
  const { theme } = useTheme();
  const isSSR = useIsSSR();

  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
        <Image
          alt="header"
          className="h-full w-full aspect-square object-cover object-left-top rounded-sm"
          height={250}
          src={`/images/command_${theme === "light" || isSSR ? "white" : "dark"}.png`}
          width={800}
        />
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  // eslint-disable-next-line no-undef
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        // longitude latitude
        { location: [37.7595, -122.4367], size: 0.1 },
        { location: [40.7128, -74.006], size: 0.1 },
        // Germany
        { location: [51.4765, 10.3531], size: 0.1 },
        // China
        { location: [33.425, 103.1216], size: 0.1 },
        // Philippines
        { location: [14.5995, 120.9842], size: 0.1 },
        // Australia
        { location: [-33.8688, 151.2093], size: 0.1 },
        // Africa
        { location: [11.0063, 20.0358], size: 0.1 },
        // Indonesia
        { location: [-6.1751, 106.8276], size: 0.1 },
        // Canada
        { location: [56.1304, -106.3468], size: 0.1 },
        // Brazil
        { location: [-14.235, -51.9253], size: 0.1 },
      ],
      onRender: (state: any) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
    />
  );
};
