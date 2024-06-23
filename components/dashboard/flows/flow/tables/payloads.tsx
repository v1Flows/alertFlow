import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Chip,
  Tooltip,
} from "@nextui-org/react";

import { DeleteIcon } from "@/components/icons";

import PayloadModal from "../modals/payload";

export default function PayloadsTable({ payloads }: any) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(payloads.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return payloads.slice(start, end);
  }, [page, payloads]);

  const renderCell = React.useCallback((key: any, columnKey: any) => {
    const cellValue = key[columnKey];

    switch (columnKey) {
      case "created_at":
        return new Date(key.created_at).toLocaleString();
      case "payload":
        return <PayloadModal payload={key} />;
      case "execution_id":
        return (
          <div>
            {!key.execution_id ? (
              <Chip color="warning" size="sm" variant="light">
                No Execution Found
              </Chip>
            ) : (
              <Chip isDisabled color="primary" size="sm">
                {key.execution_id}
              </Chip>
            )}
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip color="danger" content="Delete payload">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <main>
      <Table
        aria-label="Example table with client side pagination"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              isDisabled={payloads.length === 0}
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="id">ID</TableColumn>
          <TableColumn key="payload" align="start">
            PAYLOAD
          </TableColumn>
          <TableColumn key="execution_id" align="start">
            EXECUTION
          </TableColumn>
          <TableColumn key="created_at" align="start">
            CREATED AT
          </TableColumn>
          <TableColumn key="actions" align="center">
            ACTIONS
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent="No payloads found" items={items}>
          {(item: any) => (
            <TableRow key={item.name}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
}
