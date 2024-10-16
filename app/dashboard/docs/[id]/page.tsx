import { Divider, Spacer } from "@nextui-org/react";

import DocContent from "@/components/dashboard/docs/doc/content";
import DocHeader from "@/components/dashboard/docs/doc/header";
import GetDoc from "@/lib/fetch/docs/doc";
import GetUserDetails from "@/lib/fetch/user/getDetails";

export default async function DocPage({ params }: { params: { id: string } }) {
  const doc = await GetDoc(params.id);
  const userDetails = await GetUserDetails();

  return (
    <main>
      <DocHeader doc={doc} user={userDetails} />
      <Spacer y={2} />
      <Divider className="mb-4" />
      <DocContent doc={doc} />
    </main>
  );
}
