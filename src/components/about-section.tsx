import Link from "next/link";
import { RevealGroup } from "@/components/motion/reveal";

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-32">
      <RevealGroup stagger={0.15} className="mx-auto max-w-3xl px-6">
        <h2 className="eyebrow font-body text-[13px] text-vivid-blue">
          What I do
        </h2>

        <p className="mt-8 font-body text-xl leading-relaxed text-silver md:text-2xl">
          My whole thing is bridging media and software: the storytelling that makes people care, and the code and AI that gives it real leverage. That intersection is the most exciting place to be right now.
        </p>

        <p className="mt-6 font-body text-xl leading-relaxed text-silver md:text-2xl">
          <Link
            href="https://www.boldane.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vivid-blue underline decoration-vivid-blue/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            Boldane
          </Link>{" "}
          is that idea as a company: you have the stories worth telling, we turn them into a presence your market trusts and buys from. One real conversation a week, all from what you said.
        </p>

        <p className="mt-6 font-body text-xl leading-relaxed text-silver md:text-2xl">
          I share how I build there on YouTube, teaching Claude Code and AI for marketing.
        </p>

        <p className="mt-6 font-body text-xl leading-relaxed text-silver md:text-2xl">
          Before this, I used AI to build trading algorithms at a hedge fund in amsterdam. Then I left to build my own company.
        </p>
      </RevealGroup>
    </section>
  );
}
