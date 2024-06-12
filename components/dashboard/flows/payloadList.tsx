"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { EyeIcon } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";

export function PayloadList({ payloads }: any) {
  const sortedPayloads = payloads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div>
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
          {sortedPayloads.map((payload: any) => (
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
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{payload.id}</SheetTitle>
                    </SheetHeader>
                    <Separator className="mb-4" />
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      {JSON.stringify(payload.payload, null, 10)}
                    </code>
                  </SheetContent>
                </Sheet>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
