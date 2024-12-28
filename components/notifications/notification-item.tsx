"use client";

import { Icon } from "@iconify/react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Spacer,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import ReactTimeago from "react-timeago";

import UnreadUserNotification from "@/lib/fetch/user/PUT/unreadNotification";
import UnarchiveUserNotification from "@/lib/fetch/user/PUT/unarchiveNotification";
import ReadUserNotification from "@/lib/fetch/user/PUT/readNotification";
import ArchiveUserNotification from "@/lib/fetch/user/PUT/archiveNotification";

export default function NotificationItem({ notification }: any) {
  const router = useRouter();

  return (
    <div className="mb-3">
      <Card
        className={`border-1 ${notification.is_read ? "border-default" : "border-primary-200"}`}
      >
        <CardBody>
          <div className="flex items-center gap-3">
            <div className="relative flex-none">
              <Badge
                color="primary"
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
                    fallback={<Icon icon={notification.icon} width={20} />}
                    size="sm"
                  />
                )}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-bold text-default-500">
                {notification.title}
              </p>
              <p>{notification.body}</p>
            </div>
          </div>
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
          <Spacer y={1} />
          <div className="flex items-center gap-3">
            <time className="text-tiny text-default-400">
              <ReactTimeago date={notification.created_at} />
            </time>
            {notification.is_read ? (
              <Button
                size="sm"
                variant="bordered"
                onPress={() => {
                  UnreadUserNotification(notification.id);
                  router.refresh();
                }}
              >
                Unread
              </Button>
            ) : (
              <Button
                color="primary"
                size="sm"
                variant="bordered"
                onPress={() => {
                  ReadUserNotification(notification.id);
                  router.refresh();
                }}
              >
                Read
              </Button>
            )}
            {notification.is_archived ? (
              <Button
                color="secondary"
                size="sm"
                variant="bordered"
                onPress={() => {
                  UnarchiveUserNotification(notification.id);
                  router.refresh();
                }}
              >
                Unarchive
              </Button>
            ) : (
              <Button
                size="sm"
                variant="bordered"
                onPress={() => {
                  ArchiveUserNotification(notification.id);
                  router.refresh();
                }}
              >
                Archive
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
