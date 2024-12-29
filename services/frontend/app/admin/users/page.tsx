import { UsersList } from "@/components/admin/users/list";
import ErrorCard from "@/components/error/ErrorCard";
import AdminGetUsers from "@/lib/fetch/admin/users";
import PageGetPlans from "@/lib/fetch/page/plans";

export default async function AdminUsersPage() {
  const userData = AdminGetUsers();
  const plansData = PageGetPlans();

  const [user, plans] = (await Promise.all([userData, plansData])) as any;

  return (
    <>
      {user.success && plans.success ? (
        <UsersList plans={plans.data.plans} users={user.data.users} />
      ) : (
        <ErrorCard
          error={user.error || plans.error}
          message={user.message || plans.message}
        />
      )}
    </>
  );
}
