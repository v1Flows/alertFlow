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
import Link from "next/link"
import GetProjects from "@/lib/backendCalls/project/all";
import GetFlows from "@/lib/backendCalls/flow/all";

export async function FlowList() {
  const flows = await GetFlows()
  const projects = await GetProjects()

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Flows (${flows.length})`}
          description="Manage flows"
        />
        <Button
          className="text-xs md:text-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4">
        {flows?.map((flow: any) => (
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
                    {projects.find((project: any) => project.id === flow.project_id)?.name}
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