import React from "react";

import { cn } from "@/components/functions/cn/cn";

const CellWrapper = React.forwardRef<
  // eslint-disable-next-line no-undef
  HTMLDivElement,
  // eslint-disable-next-line no-undef
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between gap-2 rounded-medium bg-content2 p-4",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));

CellWrapper.displayName = "CellWrapper";

export default CellWrapper;
