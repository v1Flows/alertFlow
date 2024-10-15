import { Icon } from "@iconify/react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Input,
  Pagination,
  Spacer,
} from "@nextui-org/react";

export default function DocsList({ docs }: any) {
  return (
    <div>
      <Spacer y={4} />
      <Input
        label="Search"
        placeholder="Search..."
        radius="sm"
        startContent={<Icon icon="eva:search-outline" />}
        type="text"
        variant="bordered"
      />
      <Spacer y={2} />
      <div className="flex flex-wrap items-center gap-2">
        <Chip radius="sm" variant="faded">
          <p className="text-sm font-bold">All Documents</p>
        </Chip>
        <Chip radius="sm" variant="faded">
          <p className="text-sm font-bold">Get-Started</p>
        </Chip>
      </div>
      <Spacer y={4} />
      {/* List of documents */}
      {docs.count === 0 && (
        <div className="flex justify-center">
          <p className="text-lg text-default-500">No documents found</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {docs.docs.map((doc: any, index: number) => (
          <Card
            key={index}
            isHoverable
            isPressable
            className="shadow shadow-primary-200"
          >
            <CardHeader>
              <div className="flex items-center space-x-2 text-start">
                <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                  <Icon icon="solar:bell-broken" width={20} />
                </div>
                <p className="text-md font-bold">
                  Get started with using AlertFlow
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-default-500">
                Learn how to use AlertFlow to manage your alerts and
                notifications.
              </p>
            </CardBody>
            <CardFooter>
              <div className="flex flex-wrap gap-2 items-center">
                <Chip color="primary" radius="sm" variant="flat">
                  Category: Get-Started
                </Chip>
                <Chip color="success" radius="sm" variant="flat">
                  Published
                </Chip>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Spacer y={4} />
      <div className="flex justify-center">
        <Pagination showControls initialPage={1} total={10} />
      </div>
    </div>
  );
}
