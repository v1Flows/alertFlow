'use server';
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Heading } from '@/components/ui/heading';
import { Plus, Eye, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Label } from "@/components/ui/label"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { cookies } from 'next/headers'
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { FetchFailedAlert } from "@/components/alerts/fetchFail";
import AvatarCircles from "@/components/magicui/avatar-circles";

let projectFetchFailed = false

async function getProjects() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return { error: "No token found" }
  }

  const res = await fetch("http://localhost:8080/api/projects/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
  })

  if (!res.ok) {
    projectFetchFailed = true
    return { error: "Failed to fetch data" }
  }

  projectFetchFailed = false
  return res.json()
}

export async function ProjectList() {
  'use client'
  const projects = await getProjects()

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Projects (${projects.projects.length})`}
          description="Manage projects"
        />
        <Button
          className="text-xs md:text-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      {projectFetchFailed && <FetchFailedAlert />}
      <div className="flex gap-4">
        {projects.projects?.map((project: any) => (
          <Card key={project.id} className="w-[350px]">
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Members</Label>
                  <div className="flex flex-row items-center justify-left mb-10 w-full">
                    <AvatarCircles people={project.members} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="text-xs md:text-sm" variant="secondary">
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      project and remove all data related to it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button variant="destructive">Delete Project</Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}