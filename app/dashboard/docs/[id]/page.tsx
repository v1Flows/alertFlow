import { Divider, Spacer } from "@nextui-org/react";

import DocContent from "@/components/dashboard/docs/doc/content";
import DocHeader from "@/components/dashboard/docs/doc/header";
import GetDoc from "@/lib/fetch/docs/doc";

export default async function DocPage({ params }: { params: { id: string } }) {
  const doc = await GetDoc(params.id);

  return (
    <main>
      <DocHeader doc={doc} />
      <Spacer y={2} />
      <Divider className="mb-4" />
      <DocContent doc={doc} />
    </main>
  );
}
