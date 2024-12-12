import DashboardDocsHeader from "@/components/dashboard/docs/header";
import DocsList from "@/components/dashboard/docs/list";
import GetDocs from "@/lib/fetch/docs/docs";
import GetUserDetails from "@/lib/fetch/user/getDetails";

export default async function DashboardDocsPage() {
  const userDetailsData = GetUserDetails();
  const docsData = GetDocs();

  const [userDetails, docs] = await Promise.all([userDetailsData, docsData]);

  return (
    <>
      <DashboardDocsHeader userDetails={userDetails} />
      <DocsList docs={docs} />
    </>
  );
}
