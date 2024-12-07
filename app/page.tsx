import { Spacer } from "@nextui-org/react";
import { cookies } from "next/headers";
import { Icon } from "@iconify/react";

import Navbar from "@/components/navbar";
import AdminGetSettings from "@/lib/fetch/page/settings";
import { FeaturesSectionDemo } from "@/components/home/bento";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { cn } from "@/lib/utils";
import HomeShowcase from "@/components/home/Showcase";
import HomeTerraform from "@/components/home/Terraform";
import HomeRunners from "@/components/home/Runners";
import HomeFlows from "@/components/home/Flows";
import Footer from "@/components/footer/Footer";

export default async function Home() {
  const cookieStore = await cookies();
  const user = JSON.parse(cookieStore.get("user")?.value || "{}");
  const session = cookieStore.get("session")?.value;
  const settings = await AdminGetSettings();

  return (
    <>
      <Navbar session={session} settings={settings} user={user} />
      <HomeShowcase />
      <Spacer y={28} />
      <main className="container mx-auto w-full pt-2 px-6 flex-grow">
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
