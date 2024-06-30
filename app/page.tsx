import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";

import { title, subtitle } from "@/components/primitives";
import HomeFeatures from "@/components/home/Features";
import { Navbar } from "@/components/navbar";
import HomeTerraform from "@/components/home/Terraform";
import HomeSecurity from "@/components/home/Security";
import HomeSelfhosting from "@/components/home/Selfhosting";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-2 px-6 flex-grow">
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            <h1 className={title()}>Make&nbsp;</h1>
            <h1 className={title({ color: "blue" })}>AlertFlow&nbsp;</h1>
            <br />
            <h1 className={title()}>your personal Monitoring Assistant.</h1>
            <h2 className={subtitle({ class: "mt-4" })}>
              Automated, performant and there when you need it.
            </h2>
          </div>

          <div className="mt-8">
            <Snippet hideCopyButton hideSymbol size="lg" variant="flat">
              <span>
                Coming <Code color="primary">Soon.</Code>
              </span>
            </Snippet>
          </div>

          <div className="mt-8">
            <HomeFeatures />
          </div>
        </section>
        <section className="flex flex-col gap-4 py-8 md:py-10">
          <HomeTerraform />
          <div className="mt-32">
            <HomeSecurity />
          </div>
          <div className="mt-32">
            <HomeSelfhosting />
          </div>
        </section>
      </main>
    </>
  );
}
