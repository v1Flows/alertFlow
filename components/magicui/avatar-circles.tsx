"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  people?: {
    role: string;
    email: string;
  }[];
}

let maxAvatarPeople = 5;

export default function AvatarCircles({
  people,
  className,
}: AvatarCirclesProps) {
  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {people?.slice(0, maxAvatarPeople).map((person, index) => (
        <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800" key={index}>
          <AvatarImage
            src={person.image ?? ''}
            alt={person.email ?? ''}
          />
          <AvatarFallback>{person.email[0]}</AvatarFallback>
        </Avatar>
      ))}

      {people?.length > maxAvatarPeople && (
        <a className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black">
          +{people?.length - maxAvatarPeople}
        </a>
      )}
    </div>
  );
}
