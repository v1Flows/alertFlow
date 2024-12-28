import { Spacer } from "@nextui-org/react";
import { cookies } from "next/headers";

import Footer from "@/components/footer/Footer";
import { FeaturesSectionDemo } from "@/components/home/bento";
import HomeFlows from "@/components/home/Flows";
import HomeRunners from "@/components/home/Runners";
import HomeShowcase from "@/components/home/Showcase";
import HomeTerraform from "@/components/home/Terraform";
import Navbar from "@/components/navbar";
import PageGetSettings from "@/lib/fetch/page/settings";

export default async function Home() {
  const cookieStore = await cookies();
  const user = JSON.parse(cookieStore.get("user")?.value || "{}");
  const session = cookieStore.get("session")?.value;
  const settingsData = PageGetSettings();

  const [settings] = await Promise.all([settingsData]);

  return (
    <>
      {settings.success ? (
        <Navbar
          session={session}
          settings={settings.data.settings}
          user={user}
        />
      ) : null}
      <HomeShowcase />
      <Spacer y={28} />
      <main className="container mx-auto w-full grow px-6 pt-2">
        <section>
          <FeaturesSectionDemo />
        </section>
        <Spacer y={28} />
        <section>
          <HomeFlows />
        </section>
        <Spacer y={28} />
        <section>
          <HomeRunners />
        </section>
        <Spacer y={28} />
        <section>
          <HomeTerraform />
        </section>
      </main>
      <Footer />
    </>
  );
}
