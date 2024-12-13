import { Divider, Spacer } from "@nextui-org/react";

import DocContent from "@/components/dashboard/docs/doc/content";
import DocHeader from "@/components/dashboard/docs/doc/header";
import GetDoc from "@/lib/fetch/docs/doc";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import ErrorCard from "@/components/error/ErrorCard";

export default async function DocPage({ params }: { params: { id: string } }) {
  const docData = GetDoc(params.id);
  const userDetailsData = GetUserDetails();

  const [doc, userDetails] = await Promise.all([docData, userDetailsData]);

  return (
    <main>
      {doc.success && userDetails.success ? (
        <>
          <DocHeader doc={doc.data.doc} user={userDetails.data.user} />
          <Spacer y={2} />
          <Divider className="mb-4" />
          <DocContent doc={doc.data.doc} />
        </>
      ) : (
        <ErrorCard
          error={
            ("error" in doc ? doc.error : "") ||
            ("error" in userDetails ? userDetails.error : "")
          }
          message={
            ("message" in doc ? doc.message : "") ||
            ("message" in userDetails ? userDetails.message : "")
          }
        />
      )}
    </main>
  );
}
