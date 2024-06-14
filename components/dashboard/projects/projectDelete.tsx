export async function ProjectDelete({ projectId }: any) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return { error: "No token found" }
  }

  const res = fetch(`http://localhost:8080/api/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
  })

  if (!res.ok) {
    return { error: "Failed to delete project" }
  }

  return res
}