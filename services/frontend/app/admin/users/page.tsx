import { UsersList } from "@/components/admin/users/list";
import ErrorCard from "@/components/error/ErrorCard";
import AdminGetUsers from "@/lib/fetch/admin/users";

export default async function AdminUsersPage() {
  const userData = AdminGetUsers();

  const [user] = (await Promise.all([userData])) as any;

  return (
    <>
      {user.success ? (
        <UsersList users={user.data.users} />
      ) : (
        <ErrorCard error={user.error} message={user.message} />
      )}
    </>
  );
}
