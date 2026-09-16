import Navbar from "./navbar/Navbar";
import HeroSection from "./components/HeroSection";
import SubHeroIntro from "./components/SubHeroIntro";
import ApplicationSection from "./components/ApplicationSection";
import FeaturesSection from "./components/FeaturesSection";
import PricingSection from "./components/PricingSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <SubHeroIntro />
          <ApplicationSection />
          <FeaturesSection />
          <PricingSection />
          <TestimonialsSection />
          <FaqSection />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}

