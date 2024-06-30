import { UsersList } from "@/components/admin/users/list";
import AdminGetUsers from "@/lib/fetch/admin/users";

export default async function AdminUsersPage() {
  const user = await AdminGetUsers();

  return (
    <>
      <UsersList users={user} />
    </>
  );
}
