"use client";

import { Icon } from "@iconify/react";
import {
  Card,
  CardBody,
  CardFooter,
  Chip,
  Input,
  Pagination,
  Spacer,
} from "@nextui-org/react";
import React, { useMemo } from "react";

export default function DocsList({ docs }: any) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 15;

  function getUniqueCategories(docs: any) {
    const categories = docs.map((doc: any) => doc.category);

    return [
      ...Array.from(
        new Set(categories.filter((category: any) => category !== null)),
      ),
    ];
  }

  function getDocsCountByCategory(category: string) {
    if (category === "All") {
      return docs.docs.length;
    }

    return docs.docs.filter((doc: any) => doc.category === category).length;
  }

  function handleSearchChange(e: any) {
    setSearchQuery(e);
  }

  function searchDocs(query: string, category: string) {
    let filteredDocs = docs.docs;

    if (category !== "All") {
      filteredDocs = filteredDocs.filter(
        (doc: any) => doc.category === category,
      );
    }

    if (query !== "") {
      filteredDocs = filteredDocs.filter((doc: any) =>
        doc.title.toLowerCase().includes(query.toLowerCase()),
      );
    }

    return filteredDocs;
  }

  const filteredDocs = searchDocs(searchQuery, selectedCategory);
  const pages = Math.ceil(filteredDocs.length / rowsPerPage);
  const paginatedDocs = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredDocs.slice(start, end);
  }, [page, filteredDocs]);

  function getCategoryIcon(category: string) {
    switch (category) {
      case "Getting Started":
        return "solar:map-broken";
      case "Flows":
        return "solar:book-bookmark-broken";
      case "Projects":
        return "solar:box-broken";
      case "Runners":
        return "solar:rocket-2-broken";
      case "Payloads":
        return "solar:letter-opened-broken";
      case "Executions":
        return "solar:reorder-line-duotone";
      case "Actions":
        return "solar:bolt-broken";
      case "Common":
        return "solar:notebook-bookmark-bold-duotone";
      default:
        return "solar:notebook-bookmark-bold-duotone";
    }
  }

  return (
    <div>
      <Spacer y={4} />
      <Input
        label="Search"
        placeholder="Search..."
        radius="sm"
        startContent={<Icon icon="eva:search-outline" />}
        type="text"
        value={searchQuery}
        variant="bordered"
        onValueChange={(v) => handleSearchChange(v)}
      />
      <Spacer y={2} />
      <div className="flex flex-wrap items-center gap-2">
        <Chip
          color={selectedCategory === "All" ? "primary" : "default"}
          endContent={<p className="text-default-500">({docs.docs.length})</p>}
          radius="sm"
          variant={selectedCategory === "All" ? "solid" : "faded"}
          onClick={() => setSelectedCategory("All")}
        >
          <p className="text-sm font-bold">All</p>
        </Chip>
        {getUniqueCategories(docs.docs).map((category: any, index: number) => (
          <Chip
            key={index}
            color={category === selectedCategory ? "primary" : "default"}
            endContent={
              <p className="text-default-500">
                ({getDocsCountByCategory(category)})
              </p>
            }
            radius="sm"
            variant={category === selectedCategory ? "solid" : "faded"}
            onClick={() => setSelectedCategory(category)}
          >
            <p className="text-sm font-bold">{category}</p>
          </Chip>
        ))}
      </div>
      <Spacer y={4} />
      {/* List of documents */}
      {docs.count === 0 && (
        <div className="flex justify-center">
          <p className="text-lg text-default-500">No documents found</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {paginatedDocs.map((doc: any) => (
          <Card
            key={doc.id}
            isHoverable
            isPressable
            className="shadow shadow-primary-200"
          >
            <CardBody className="flex items-center gap-2">
              <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-14 h-14">
                <Icon icon={getCategoryIcon(doc.category)} width={30} />
              </div>
              <p className="text-md font-bold">{doc.title}</p>
            </CardBody>
            <CardFooter>
              <div className="flex flex-wrap gap-2 items-center">
                <Chip color="primary" radius="sm" variant="flat">
                  Category: {doc.category}
                </Chip>
                {doc.hidden ? (
                  <Chip color="danger" radius="sm" variant="flat">
                    Hidden
                  </Chip>
                ) : (
                  <Chip color="success" radius="sm" variant="flat">
                    Published
                  </Chip>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Spacer y={4} />
      <div className="flex justify-center">
        <Pagination
          showControls
          showShadow
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
    </div>
  );
}
