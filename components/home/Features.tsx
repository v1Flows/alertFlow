import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";

import { IconWrapper } from "@/lib/IconWrapper";
import { CalendarIcon } from "@/components/icons";

export default function HomeFeatures() {
  return (
    <main>
      <div className="grid lg:grid-cols-4 items-center justify-between gap-4">
        <Card fullWidth>
          <CardHeader className="justify-start gap-2 items-center">
            <IconWrapper className="bg-secondary/10 text-secondary">
              <CalendarIcon className="text-lg" />
            </IconWrapper>
            <p className="text-md font-bold">Projects</p>
          </CardHeader>
        </Card>
        <Card fullWidth>
          <CardHeader className="justify-start gap-2 items-center">
            <IconWrapper className="bg-secondary/10 text-secondary">
              <CalendarIcon className="text-lg" />
            </IconWrapper>
            <p className="text-md font-bold">Flows</p>
          </CardHeader>
        </Card>
        <Card className="h-[300px]">
          <CardHeader className="absolute z-10 top-1 flex-col !items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">
              Self-Hosted
            </p>
            <h4 className="text-white font-medium text-large">
              Host runners on your own infrastructure
            </h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Card background"
            className="z-0 w-full h-full object-cover filter brightness-50"
            src="https://cdn.pixabay.com/photo/2023/04/29/16/40/ai-generated-7958926_1280.jpg"
          />
        </Card>
        <Card fullWidth>
          <CardHeader className="justify-start gap-2 items-center">
            <IconWrapper className="bg-secondary/10 text-secondary">
              <CalendarIcon className="text-lg" />
            </IconWrapper>
            <p className="text-md font-bold">Plugins</p>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
