"use client";

import type { UseDisclosureReturn } from "@heroui/use-disclosure";

import { Icon } from "@iconify/react";
import {
  Button,
  Chip,
  ScrollShadow,
  Tab,
  Tabs,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";

import ReadUserNotification from "@/lib/fetch/user/PUT/readNotification";
import ArchiveUserNotification from "@/lib/fetch/user/PUT/archiveNotification";

import NotificationItem from "./notification-item";

enum NotificationTabs {
  All = "all",
  Unread = "unread",
  Archive = "archive",
}

export default function Notifications({
  disclosure,
  incNotifications,
}: {
  disclosure: UseDisclosureReturn;
  incNotifications: any;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<NotificationTabs>(
    NotificationTabs.Unread,
  );

  const { isOpen, onOpenChange } = disclosure;

  async function ReadAll() {
    for (const n of incNotifications) {
      await ReadUserNotification(n.id);
    }
    router.refresh();
  }

  async function ArchiveAll() {
    for (const n of incNotifications) {
      if (n.is_read) {
        await ArchiveUserNotification(n.id);
      }
    }
    router.refresh();
  }

  return (
    <>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold">Notifications</h3>
                <Chip size="sm" variant="flat">
                  {incNotifications.filter((n: any) => !n.is_read).length}
                </Chip>
              </DrawerHeader>
              <DrawerBody>
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
                          {
                            incNotifications.filter((n: any) => !n.is_archived)
                              .length
                          }
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
                          {
                            incNotifications.filter((n: any) => !n.is_read)
                              .length
                          }
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
                          {
                            incNotifications.filter((n: any) => n.is_archived)
                              .length
                          }
                        </Chip>
                      </div>
                    }
                  />
                </Tabs>
                <ScrollShadow className="h-[500px] w-full">
                  {activeTab === NotificationTabs.All &&
                    incNotifications
                      .filter((n: any) => !n.is_archived)
                      .map((notification: any) => (
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
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button variant="flat">Settings</Button>
                {activeTab === NotificationTabs.Unread && (
                  <Button
                    color="primary"
                    startContent={
                      <Icon icon="solar:check-read-linear" width={24} />
                    }
                    variant="solid"
                    onPress={() => ReadAll()}
                  >
                    Mark all as read
                  </Button>
                )}
                {activeTab === NotificationTabs.All && (
                  <Button
                    color="primary"
                    startContent={
                      <Icon
                        icon="solar:archive-down-minimlistic-broken"
                        width={20}
                      />
                    }
                    variant="solid"
                    onPress={() => ArchiveAll()}
                  >
                    Archive All
                  </Button>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
