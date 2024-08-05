import { Image } from "@nextui-org/react";

import { BorderBeam } from "@/components/magicui/border-beam";

export default function HomeShowcase() {
  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      <div className="flex flex-1 w-full h-full flex-col space-y-2 rounded-md">
        <Image
          isBlurred
          alt="..."
          className="w-full h-full object-cover rounded-md"
          loading="lazy"
          src="images/full_project.png"
        />
        <BorderBeam delay={9} duration={12} size={300} />
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
    </div>
  );
}
