import { Heading } from '@/components/ui/heading';
import { Badge } from "@/components/ui/badge"
import { Separator } from '@/components/ui/separator';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Icons
import { KeySquare, Play, User, PencilRuler } from 'lucide-react';

import GetProject from '@/lib/backendCalls/project/data';
import GetProjectApiKeys from '@/lib/backendCalls/project/apiKeys';
import GetProjectRunners from '@/lib/backendCalls/project/runners';
import { RunnerList } from './runnerList';

export async function Project({ projectId }: any) {
  const project = await GetProject(projectId)
  const api_keys = await GetProjectApiKeys(projectId)
  const runners = await GetProjectRunners(projectId)

  return (
    <>
      <div className="flex items-start gap-6">
        <Heading
          title={`${project.name}`}
          description={`${project.description}`}
        />
        <Badge className="mt-2">Project ID: {projectId}</Badge>
      </div>
      <Separator />
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <div className="col-span-1">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start gap-4">
                  <User />
                  <div>
                    <CardTitle>Members</CardTitle>
                    <CardDescription>Amount of Members</CardDescription>
                  </div>
                </div>
                <h4>{project.members.length}</h4>
              </div>
            </CardHeader>
          </Card>
        </div>
        <div className="col-span-1">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start gap-4">
                  <Play />
                  <div>
                    <CardTitle>Runners</CardTitle>
                    <CardDescription>Available Runners</CardDescription>
                  </div>
                </div>
                <h4>{project.alertflow_runners ? runners.length : runners.filter((runner: any) => !runner.alertflow_runner).length}</h4>
              </div>
            </CardHeader>
          </Card>
        </div>
        <div className="col-span-1">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start gap-4">
                  <KeySquare />
                  <div>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Active API Keys</CardDescription>
                  </div>
                </div>
                <h4>{api_keys.length}</h4>
              </div>
            </CardHeader>
          </Card>
        </div>
        <div className="col-span-1">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start gap-4">
                  <PencilRuler />
                  <div>
                    <CardTitle>Created At</CardTitle>
                    <CardDescription>Creation Date of Project</CardDescription>
                  </div>
                </div>
                <h4>{new Date(project.created_at).toLocaleString()}</h4>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
      <div>
        <Tabs defaultValue="members">
          <TabsList>
            <TabsTrigger value="members">
              <User className="mr-2 h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="runners">
              <Play className="mr-2 h-4 w-4" />
              Runners
            </TabsTrigger>
            <TabsTrigger value="apikeys">
              <KeySquare className="mr-2 h-4 w-4" />
              API Keys
            </TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <Badge variant={"secondary"} className="mb-4 mt-2">
              <PencilRuler className="mr-1 h-4 w-4" />
              Hint: you can click on some circles
            </Badge>
          </TabsContent>
          <TabsContent value="runners">
            <RunnerList runners={project.alertflow_runners ? runners : runners.filter((runner: any) => !runner.alertflow_runner)} alertflow_runners={project.alertflow_runners} />
          </TabsContent>
          <TabsContent value="apikeys">
            asdasd
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}