export default function Logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
}