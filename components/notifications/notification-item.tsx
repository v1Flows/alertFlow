"use client";

import React from "react";
import { Avatar, Badge } from "@nextui-org/react";

import { cn } from "@/components/functions/cn/cn";

export default function NotificationItem({ notification }: any) {
  return (
    <div
      className={cn("flex gap-3 border-b border-divider px-6 py-4", {
        "bg-primary-50/50": !notification.is_read,
      })}
    >
      <div className="relative flex-none">
        <Badge
          color="primary"
          content=""
          isInvisible={notification.is_read}
          placement="bottom-right"
          shape="circle"
        >
          <Avatar color="default" size="sm" src="/images/af_logo_white.png" />
        </Badge>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-small text-foreground">
          <strong className="font-medium">{notification.title}</strong>
        </p>
        <p>{notification.body}</p>
        <time className="text-tiny text-default-400">
          {new Date(notification.created_at).toLocaleString()}
        </time>
      </div>
    </div>
  );
}
