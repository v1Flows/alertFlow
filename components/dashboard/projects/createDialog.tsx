import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Plus } from 'lucide-react';
import { CreateProjectForm } from "./createForm"
import { cookies } from 'next/headers'

export function CreateProject() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="text-xs md:text-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create a new project to get started
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm token={token} />
      </DialogContent>
    </Dialog>
  )
}