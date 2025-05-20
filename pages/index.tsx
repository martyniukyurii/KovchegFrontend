import DefaultLayout from "@/layouts/default";
import { ImagesSliderDemo } from "@/components/home/images-slider-demo";
import { TopOffers } from "@/components/home/top-offers";
import { WhyUs } from "@/components/home/why-us";
import { FAQ } from "@/components/home/faq";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div>
        <section className="h-screen">
          <ImagesSliderDemo />
        </section>
        <main className="-mt-1">
          <TopOffers />
          <WhyUs />
          <FAQ />
        </main>
      </div>
    </DefaultLayout>
  );
}
