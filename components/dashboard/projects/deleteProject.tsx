'use client'

import { Button } from "@/components/ui/button"
import DeleteProject from "@/lib/backendCalls/project/delete"

export function DeleteProjectButton({ id }: any) {
  console.log(id)
  return (
    <Button variant="destructive" onClick={() => DeleteProject(id)}>Delete Project</Button>
  )
}