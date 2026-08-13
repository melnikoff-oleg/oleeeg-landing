import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ResultsSection } from "@/components/results-section";
import { VideoSection } from "@/components/video-section";
import { ConnectSection } from "@/components/connect-section";
import { FreeCallCta } from "@/components/free-call-cta";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ResultsSection />
        {/* Straight after the proof, before the video, so it is met mid-page
            rather than after the "cheers, oleg" sign-off the page ends on.
            Remove after 2026-08-23, see src/lib/free-call.ts. */}
        <FreeCallCta className="pb-16 md:pb-24" />
        <VideoSection />
        <ConnectSection />
      </main>
    </>
  );
}
