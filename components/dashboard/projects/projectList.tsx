'use server';
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
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
import Link from "next/link"
import { Heading } from '@/components/ui/heading';
import { Eye, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cookies } from 'next/headers'
import { FetchFailedAlert } from "@/components/alerts/fetchFail";
import AvatarCircles from "@/components/magicui/avatar-circles";
import { CreateProject } from "./projectCreateDialog";

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
      <div className="grid grid-cols-2 justify-between items-center">
        <div className="col-span-1 justify-self-start">
          <Heading
            title={`Projects (${projects.projects.length})`}
            description="Manage projects"
          />
        </div>
        <div className="col-span-1 justify-self-end">
          <CreateProject />
        </div>
      </div>
      <Separator />
      {projectFetchFailed && <FetchFailedAlert />}
      <div className="grid lg:grid-cols-4 gap-4">
        {projects.projects?.map((project: any) => (
          <Card key={project.id} className="w-full">
            <CardHeader>
              <div className="grid grid-cols-2">
                <div className="grid-span-1 justify-self-start">
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <div className="grid-span-1 justify-self-end">
                  <div className="flex flex-row items-center justify-left w-full">
                    <AvatarCircles people={project.members} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button className="text-xs md:text-sm" variant="secondary" asChild>
                <Link href={`/dashboard/projects/${project.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
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
                    <Button variant="destructive" onClick={() => deleteProject(project.id)}>Delete Project</Button>
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