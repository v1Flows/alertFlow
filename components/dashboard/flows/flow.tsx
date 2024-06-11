'use server';
import { Heading } from '@/components/ui/heading';
import { Button } from "@/components/ui/button"
import { Separator } from '@/components/ui/separator';
import { Plus, Rocket, Wand, Library } from 'lucide-react';
import { cookies } from 'next/headers'
import { FetchFailedAlert } from "@/components/alerts/fetchFail";
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

let flowFetchFailed = false
let projectFetchFailed = false

async function getFlow(flowId: any) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return { error: "No token found" }
  }

  const res = await fetch(`http://localhost:8080/api/flows/${flowId}`, {
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
  const data = await res.json()
  return data.flow
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

export async function Flow({ flowId }: any) {
  'use client'
  const flow = await getFlow(flowId)
  const projects = await getProjects()
  console.log(flow)

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6 justify-between">
          <Heading
            title={`${flow.name}`}
            description={`${flow.description}`}
          />
          <Badge className="mt-2">Flow ID: {flowId}</Badge>
        </div>
        <Button
          className="text-xs md:text-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      {(flowFetchFailed || projectFetchFailed) && <FetchFailedAlert />}
      <div className="flex gap-4 justify-between">
        <Card className="w-[550px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Project</CardTitle>
                <CardDescription>Project the flow belongs to</CardDescription>
              </div>
              <h4>{projects.projects?.find((project: any) => project.id === flow.project_id)?.name}</h4>
            </div>
          </CardHeader>
        </Card>
        <Card className="w-[550px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Status</CardTitle>
                <CardDescription>Current Flow Status</CardDescription>
              </div>
              <h4 style={{ color: flow.active ? "green" : "red" }}>{flow.active ? "Active" : "Inactive"}</h4>
            </div>
          </CardHeader>
        </Card>
        <Card className="w-[550px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Created At</CardTitle>
                <CardDescription>Date the flow was created</CardDescription>
              </div>
              <h4>{new Date(flow.created_at).toLocaleString()}</h4>
            </div>
          </CardHeader>
        </Card>
        <Card className="w-[550px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Updated At</CardTitle>
                <CardDescription>Date the flow was last updated</CardDescription>
              </div>
              <h4>{flow.updated_at ? new Date(flow.updated_at).toLocaleString() : "-"}</h4>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div>
        <Tabs defaultValue="actions" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="actions">
              <Wand className="mr-2 h-4 w-4" />
              Actions
            </TabsTrigger>
            <TabsTrigger value="executions">
              <Rocket className="mr-2 h-4 w-4" />
              Executions
            </TabsTrigger>
            <TabsTrigger value="payloads">
              <Library className="mr-2 h-4 w-4" />
              Payloads
            </TabsTrigger>
          </TabsList>
          <TabsContent value="actions">Make changes to your account here.</TabsContent>
          <TabsContent value="executions">Change your password here.</TabsContent>
          <TabsContent value="payloads">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </>
  )
}