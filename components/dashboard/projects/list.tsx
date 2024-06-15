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
import AvatarCircles from "@/components/magicui/avatar-circles";
import { CreateProject } from "./createDialog";
import GetProjects from "@/lib/backendCalls/getProjects"

export async function ProjectList() {
  const projects = await GetProjects();

  return (
    <>
      <div className="grid grid-cols-2 justify-between items-center">
        <div className="col-span-1 justify-self-start">
          <Heading
            title={`Projects (${projects.length})`}
            description="Manage projects"
          />
        </div>
        <div className="col-span-1 justify-self-end">
          <CreateProject />
        </div>
      </div>
      <Separator />
      <div className="grid lg:grid-cols-4 gap-4">
        {projects.map((project: any) => (
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