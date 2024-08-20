"use client";

import React from "react";
import { Avatar, Badge, Button, Spacer, Tooltip } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import ReactTimeago from "react-timeago";

import { cn } from "@/components/functions/cn/cn";
import ReadUserNotification from "@/lib/fetch/user/readNotification";
import UnreadUserNotification from "@/lib/fetch/user/unreadNotification";
import ArchiveUserNotification from "@/lib/fetch/user/archiveNotification";
import UnarchiveUserNotification from "@/lib/fetch/user/unarchiveNotification";

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
          color="success"
          content=""
          isInvisible={notification.is_read}
          placement="bottom-right"
          shape="circle"
        >
          {notification.icon === "" ? (
            <Avatar
              color={notification.color || "default"}
              size="sm"
              src="/images/af_logo_white.png"
            />
          ) : (
            <Avatar
              color={notification.color || "default"}
              fallback={<Icon icon={notification.icon} width={22} />}
              size="sm"
            />
          )}
        </Badge>
      </div>
      <div className="flex flex-col gap-1">
        <div>
          <p className="text-sm text-default-500 font-bold">
            {notification.title}
          </p>
          <p>{notification.body}</p>
        </div>
        <time className="text-tiny text-default-400">
          <ReactTimeago date={notification.created_at} />
        </time>
        {notification.link && (
          <>
            <Spacer y={1} />
            <Button
              size="sm"
              variant="flat"
              onPress={() => {
                router.push(notification.link);
              }}
            >
              {notification.link_text || "View"}
            </Button>
          </>
        )}
      </div>

      <div className="flex flex-col flex-grow items-end justify-center">
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
