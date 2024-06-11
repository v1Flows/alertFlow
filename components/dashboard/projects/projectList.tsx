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
  AlertDialogAction,
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
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Label } from "@/components/ui/label"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { cookies } from 'next/headers'
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

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
    return { error: "Failed to fetch data" }
  }

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
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Project data was not able to be fetched.
        </AlertDescription>
      </Alert>
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
                    <AnimatedTooltip items={project.members.map((member: any, index: number) => ({ ...member, id: index, name: member.email, designation: member.role, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80" }))} />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Flows</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Delete</Button>
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
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button>View</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}