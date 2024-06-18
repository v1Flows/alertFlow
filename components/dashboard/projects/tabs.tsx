"use client";
import React from "react";
import { Tabs, Tab } from "@nextui-org/react";

import { GalleryIcon, MusicIcon, VideoIcon } from "@/components/icons";

export default function ProjectTabs({ project, runners, apiKeys }: any) {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options" color="primary" variant="underlined">
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <GalleryIcon />
              <span>Members</span>
            </div>
          }
        />
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <MusicIcon />
              <span>Runners</span>
            </div>
          }
        />
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              <VideoIcon />
              <span>ApiKeys</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
