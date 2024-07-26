"use client";

import React from "react";
import { Avatar, cn } from "@nextui-org/react";

import CellWrapper from "./cell-wrapper";

// eslint-disable-next-line no-undef
export type UserCellProps = React.HTMLAttributes<HTMLDivElement> & {
  avatar: string;
  name: string;
  permission: string;
};

// eslint-disable-next-line no-undef
const UserCell = React.forwardRef<HTMLDivElement, UserCellProps>(
  ({ avatar, name, permission, className, ...props }, ref) => (
    <CellWrapper
      ref={ref}
      className={cn("bg-transparent px-3 py-1", className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Avatar showFallback name={avatar} size="sm" src={avatar} />
        <p className="text-small text-default-500">{name}</p>
      </div>
      <p className="text-small text-default-400">{permission}</p>
    </CellWrapper>
  ),
);

UserCell.displayName = "UserCell";

export default UserCell;
