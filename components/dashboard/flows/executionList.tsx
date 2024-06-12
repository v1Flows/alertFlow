"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EyeIcon } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { CopyBlock, dracula } from "react-code-blocks";

export function ExecutionList({ executions }: any) {
  return (
    <div>
      <ScrollArea className="w-full h-[800px] mt-4">
        <Table>
          <TableCaption>A list of payloads assigned to this Flow.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">ID</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Execution</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {executions.map((payload: any) => (
              <TableRow key={payload.id}>
                <TableCell className="font-medium">{payload.id}</TableCell>
                <TableCell>{new Date(payload.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground">
                    {payload.execution_id ? payload.execution_id : "None"}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant={"outline"}>
                        <EyeIcon className="mr-2 h-4 w-4" /> Show Payload
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom">
                      <SheetHeader>
                        <SheetTitle>{payload.id}</SheetTitle>
                      </SheetHeader>
                      <Separator className="mb-4" />
                      <ScrollArea className="w-full h-[600px]">
                        <CopyBlock
                          text={JSON.stringify(payload.payload, null, 2)}
                          language='json'
                          showLineNumbers
                          theme={dracula}
                        />
                      </ScrollArea>
                      <SheetFooter className="mt-4">
                        <SheetClose asChild>
                          <Button variant={"secondary"} className="w-full">Close</Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
