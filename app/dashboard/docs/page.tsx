import DashboardDocsHeader from "@/components/dashboard/docs/header";
import DocsList from "@/components/dashboard/docs/list";
import ErrorCard from "@/components/error/ErrorCard";
import GetDocs from "@/lib/fetch/docs/docs";
import GetUserDetails from "@/lib/fetch/user/getDetails";

export default async function DashboardDocsPage() {
  const userDetailsData = GetUserDetails();
  const docsData = GetDocs();

  const [userDetails, docs] = await Promise.all([userDetailsData, docsData]);

  return (
    <>
      {userDetails.success && docs.success ? (
        <>
          <DashboardDocsHeader userDetails={userDetails.data.user} />
          <DocsList docs={docs.data.docs} />
        </>
      ) : (
        <ErrorCard
          error={('error' in userDetails ? userDetails.error : '') || ('error' in docs ? docs.error : '')}
          message={('message' in userDetails ? userDetails.message : '') || ('message' in docs ? docs.message : '')}
        />
      )}
    </>
  );
}
