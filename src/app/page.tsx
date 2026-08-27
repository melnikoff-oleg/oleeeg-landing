import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ResultsSection } from "@/components/results-section";
import { VideoSection } from "@/components/video-section";
import { ConnectSection } from "@/components/connect-section";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/json-ld";

export default function Home() {
  return (
    <>
      {/* The entity every Article on the site points its author block at. It
          lives on the homepage because that is the page Google treats as the
          entity's home, and without it "Oleg Melnikov" is 35 unconnected
          author strings rather than one person. */}
      <PersonJsonLd />
      <WebSiteJsonLd />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ResultsSection />
        <VideoSection />
        <ConnectSection />
      </main>
    </>
  );
}
