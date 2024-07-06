import SignUp from "@/components/auth/signup";
import PageGetSettings from "@/lib/fetch/page/settings";

export default async function SignUpPage() {
  var settings = await PageGetSettings();

  return (
    <>
      <SignUp settings={settings} />
    </>
  );
}
