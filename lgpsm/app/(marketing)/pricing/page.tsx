import React from "react";
import TopBanner from "../../components/TopBanner";
import Navbar from "../../navbar/Navbar";
import PricingSection from "../../components/PricingSection";
import PricingFaqSection from "../../components/PricingFaqSection";
import Footer from "../../components/Footer";
import SmoothScroll from "../../components/SmoothScroll";

export default function PricingPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-white">
        <TopBanner />
        <Navbar />
        <main className="flex-1">
          <PricingSection />
          <PricingFaqSection />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
