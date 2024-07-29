import { UsersList } from "@/components/admin/users/list";
import AdminGetUsers from "@/lib/fetch/admin/users";
import PageGetPlans from "@/lib/fetch/page/plans";

export default async function AdminUsersPage() {
  const user = await AdminGetUsers();
  const plans = await PageGetPlans();

  return (
    <>
      <UsersList plans={plans} users={user} />
    </>
  );
}
