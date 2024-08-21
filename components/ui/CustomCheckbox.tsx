import React from "react";
import { Checkbox, cn } from "@nextui-org/react";

export const CustomCheckbox = ({ action }: { action: any }) => {
  return (
    <Checkbox
      aria-label={action.name}
      classNames={{
        base: cn(
          "inline-flex w-full bg-content1 m-0",
          "hover:bg-content2 items-center justify-start",
          "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
          "border-2 border-default",
        ),
        label: "w-full",
      }}
      value={action.name}
    >
      <div className="w-full flex flex-col justify-between gap-1">
        <p>{action.name}</p>
        <p className="text-default-500">{action.description}</p>
      </div>
    </Checkbox>
  );
};
