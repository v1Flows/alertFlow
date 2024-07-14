"use client";

import type { CardProps } from "@nextui-org/react";

import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Tabs,
  Tab,
  ScrollShadow,
  CardFooter,
} from "@nextui-org/react";

import NotificationItem from "./notification-item";

type Notification = {
  id: string;
  isRead?: boolean;
  avatar: string;
  description: string;
  name: string;
  time: string;
  type?: "default" | "request" | "file";
};

enum NotificationTabs {
  All = "all",
  Unread = "unread",
  Archive = "archive",
}

export default function Notifications({
  props,
  incNotifications,
}: {
  props: CardProps;
  incNotifications: any;
}) {
  const [activeTab, setActiveTab] = React.useState<NotificationTabs>(
    NotificationTabs.All,
  );

  return (
    <Card className="w-full max-w-[420px]" {...props}>
      <CardHeader className="flex flex-col px-0 pb-0">
        <div className="flex w-full items-center justify-between px-5 py-2">
          <div className="inline-flex items-center gap-1">
            <h4 className="inline-block align-middle text-large font-medium">
              Notifications
            </h4>
            <Chip size="sm" variant="flat">
              {incNotifications.length}
            </Chip>
          </div>
          <Button
            className="h-8 px-3"
            color="primary"
            radius="full"
            variant="light"
          >
            Mark all as read
          </Button>
        </div>
        <Tabs
          aria-label="Notifications"
          classNames={{
            base: "w-full",
            tabList:
              "gap-6 px-6 py-0 w-full relative rounded-none border-b border-divider",
            cursor: "w-full",
            tab: "max-w-fit px-2 h-12",
          }}
          color="primary"
          selectedKey={activeTab}
          variant="underlined"
          onSelectionChange={(selected) =>
            setActiveTab(selected as NotificationTabs)
          }
        >
          <Tab
            key="all"
            title={
              <div className="flex items-center space-x-2">
                <span>All</span>
                <Chip size="sm" variant="flat">
                  {incNotifications.length}
                </Chip>
              </div>
            }
          />
          <Tab
            key="unread"
            title={
              <div className="flex items-center space-x-2">
                <span>Unread</span>
                <Chip size="sm" variant="flat">
                  {incNotifications.filter((n: any) => !n.is_read).length}
                </Chip>
              </div>
            }
          />
          <Tab
            key="archive"
            title={
              <div className="flex items-center space-x-2">
                <span>Archive</span>
                <Chip size="sm" variant="flat">
                  {incNotifications.filter((n: any) => n.is_archived).length}
                </Chip>
              </div>
            }
          />
        </Tabs>
      </CardHeader>
      <CardBody className="w-full gap-0 p-0">
        <ScrollShadow className="h-[500px] w-full">
          {activeTab === NotificationTabs.All &&
            incNotifications.map((notification: any) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          {activeTab === NotificationTabs.Unread &&
            incNotifications
              .filter((n: any) => !n.is_read)
              .map((notification: any) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
          {activeTab === NotificationTabs.Archive &&
            incNotifications
              .filter((n: any) => n.is_archived)
              .map((notification: any) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
        </ScrollShadow>
      </CardBody>
      <CardFooter className="justify-end gap-2 px-4">
        <Button
          variant={activeTab === NotificationTabs.Archive ? "flat" : "light"}
        >
          Settings
        </Button>
        {activeTab !== NotificationTabs.Archive && (
          <Button variant="flat">Archive All</Button>
        )}
      </CardFooter>
    </Card>
  );
}
