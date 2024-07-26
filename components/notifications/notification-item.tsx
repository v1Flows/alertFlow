"use client";

import React from "react";
import { Avatar, Badge, Button, Tooltip } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import { cn } from "@/components/functions/cn/cn";
import ReadUserNotification from "@/lib/fetch/user/readNotification";
import UnreadUserNotification from "@/lib/fetch/user/unreadNotification";
import ArchiveUserNotification from "@/lib/fetch/user/archiveNotification";
import UnarchiveUserNotification from "@/lib/fetch/user/unarchiveNotification";

function notifyIcon(type: string) {
  switch (type) {
    case "adminMessage":
      return <Icon height={24} icon="solar:shield-warning-broken" width={24} />;
    case "project":
      return <Icon height={24} icon="solar:box-broken" width={24} />;
    case "success":
      return <Icon height={24} icon="mdi:check-circle-outline" width={24} />;
    case "info":
      return <Icon height={24} icon="mdi:information-outline" width={24} />;
    default:
      return <Icon height={24} icon="mdi:alert-circle-outline" width={24} />;
  }
}

function notifyColor(type: string) {
  switch (type) {
    case "adminMessage":
      return "danger";
    case "project":
      return "primary";
    case "success":
      return "success";
    case "info":
      return "secondary";
    default:
      return "primary";
  }
}

export default function NotificationItem({ notification }: any) {
  const router = useRouter();

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
          <Avatar
            color={notifyColor(notification.type)}
            fallback={notifyIcon(notification.type)}
            size="sm"
          />
          {notification.type === "" && (
            <Avatar color="default" size="sm" src="/images/af_logo_white.png" />
          )}
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
      <div className="grid grid-rows-2 items-center">
        {notification.is_read ? (
          <>
            <Tooltip content="Mark as unread">
              <Button
                isIconOnly
                color="default"
                size="sm"
                variant="light"
                onPress={() => {
                  UnreadUserNotification(notification.id);
                  router.refresh();
                }}
              >
                <Icon icon="solar:chat-round-unread-broken" width={24} />
              </Button>
            </Tooltip>
            {notification.is_archived ? (
              <Tooltip content="Remove from Archive">
                <Button
                  isIconOnly
                  color="secondary"
                  size="sm"
                  variant="light"
                  onPress={() => {
                    UnarchiveUserNotification(notification.id);
                    router.refresh();
                  }}
                >
                  <Icon icon="solar:archive-up-minimlistic-broken" width={24} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip content="Archive">
                <Button
                  isIconOnly
                  color="default"
                  size="sm"
                  variant="light"
                  onPress={() => {
                    ArchiveUserNotification(notification.id);
                    router.refresh();
                  }}
                >
                  <Icon
                    icon="solar:archive-down-minimlistic-broken"
                    width={24}
                  />
                </Button>
              </Tooltip>
            )}
          </>
        ) : (
          <Tooltip content="Mark as read">
            <Button
              isIconOnly
              color="success"
              size="sm"
              variant="light"
              onPress={() => {
                ReadUserNotification(notification.id);
                router.refresh();
              }}
            >
              <Icon icon="solar:check-read-bold" width={24} />
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
