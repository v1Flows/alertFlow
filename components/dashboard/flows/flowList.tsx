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
import { Heading } from '@/components/ui/heading';
import { Plus, Eye, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from "@/components/ui/badge"
import { cookies } from 'next/headers'
import Link from "next/link"
import { FetchFailedAlert } from "@/components/alerts/fetchFail";

let flowFetchFailed = false
let projectFetchFailed = false

async function getFlows() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return { error: "No token found" }
  }

  const res = await fetch("http://localhost:8080/api/flows/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
  })

  if (!res.ok) {
    flowFetchFailed = true
    return { error: "Failed to fetch data" }
  }

  flowFetchFailed = false
  return res.json()
}

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

export async function FlowList() {
  'use client'
  const flows = await getFlows()
  const projects = await getProjects()

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Flows (${flows.flows.length})`}
          description="Manage flows"
        />
        <Button
          className="text-xs md:text-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      {(flowFetchFailed || projectFetchFailed) && <FetchFailedAlert />}
      <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4">
        {flows.flows?.map((flow: any) => (
          <Card key={flow.id} className="w-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{flow.name}</CardTitle>
                  <CardDescription>{flow.description}</CardDescription>
                </div>
                <Badge style={{ color: flow.active ? "green" : "red" }} variant={"outline"}>{flow.active ? "Active" : "Inactive"}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-1">
                <div className="flex justify-left gap-2">
                  <p className="text-sm font-medium">
                    Project:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {projects.projects.find((project: any) => project.id === flow.project_id)?.name}
                  </p>
                </div>
                <div className="flex justify-left gap-2">
                  <p className="text-sm font-medium">
                    Last Update:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {flow.updated_at ? new Date(flow.updated_at).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="text-xs md:text-sm" variant="secondary" asChild>
                <Link href={`/dashboard/flows/${flow.id}`}>
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