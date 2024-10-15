import DashboardDocsHeader from "@/components/dashboard/docs/header";
import DocsList from "@/components/dashboard/docs/list";
import GetDocs from "@/lib/fetch/docs/docs";
import GetUserDetails from "@/lib/fetch/user/getDetails";

export default async function DashboardDocsPage() {
  const userDetails = await GetUserDetails();
  const docs = await GetDocs();

  return (
    <>
      <DashboardDocsHeader userDetails={userDetails} />
      <DocsList docs={docs} />
    </>
  );
}
