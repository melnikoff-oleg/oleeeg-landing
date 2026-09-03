import { ResourcePageShell } from "@/components/resource-page-shell";
import { Block, Out } from "@/components/guide";

// Companion page for the Fable 5.1 video: rebuild a local business website
// with Claude Code in one prompt and sell it. The page is the setup guide from
// the video and nothing else, on Oleg's instruction (2026-09-03).

const PDF = "https://drive.google.com/file/d/1GNnx1Ka269RQCdzRmb5UEYyRVKwEN704/view";

const PROMPT = `Take this website, and rebuild it from scratch. Right now it's terrible.

Focus on 2 things:
- Make it look beautiful, premium, top .1% design quality
- Make it 200% optimized for conversions

Our goal is to make the owner of this business super rich.

Use the same color palette as original website. Just change how it looks.

So study everything about this brand, their website, instagram, google maps reviews.

Collect all the social proof, case studies, credibility numbers, etc.

Read $100M Offers by Hormozi (attached) and apply it's advice to write the super convesion optimized copy.

All links and API keys below.

Firecrawl to scrape the website.

Apify to scrape instagram and google maps.

Kie AI (gpt-image-2) to generate images if needed. But you can use existing images of theirs as well. From existing website and instagram. You might crop them or regenerate something similar if needed. All final visuals should look top tier premium.

Think very deeply about the customer, reverse engineer their needs and make them buy.

https://www.moltocare.ae/
https://www.instagram.com/moltocare/
https://maps.app.goo.gl/usMRrR85CjKVNdjr8

FIRECRAWL_API_KEY=PASTE_YOUR_FIRECRAWL_KEY_HERE
APIFY_API_KEY=PASTE_YOUR_APIFY_KEY_HERE
KIE_API_KEY=PASTE_YOUR_KIE_KEY_HERE

Your total budget accross Apify, Kie and Firecrawl is $3. So be very wise and efficient and careful.
Don't scrape or generate too much before you've done a cheap test.

Don't touch source materials folder. Create everything inside the higher side-hustle-1 folder.`;

const steps = [
  {
    title: "Install Visual Studio Code",
    content: (
      <ul>
        <li>
          Download it here: <Out href="https://code.visualstudio.com">code.visualstudio.com</Out>
        </li>
        <li>Install it and open it.</li>
      </ul>
    ),
  },
  {
    title: "Add Claude Code",
    content: (
      <ul>
        <li>
          Get the Claude Pro plan (about $20 a month): <Out href="https://claude.ai">claude.ai</Out>
        </li>
        <li>In Visual Studio Code, click the Extensions icon on the left (four little cubes).</li>
        <li>Search: Claude Code. Install the one made by Anthropic.</li>
        <li>Click the new Claude icon on the left and log in.</li>
      </ul>
    ),
  },
  {
    title: "Make the project folder",
    content: (
      <ul>
        <li>On your Desktop, make a folder called: side-hustle-1</li>
        <li>Inside it, make a folder called: source materials</li>
        <li>
          Download the book and put it in source materials: <Out href={PDF}>$100M Offers (PDF)</Out>
        </li>
        <li>In source materials, make a text file called: idea.md</li>
        <li>Paste the prompt from step 5 into idea.md.</li>
        <li>In Visual Studio Code: File, Open Folder, pick side-hustle-1.</li>
      </ul>
    ),
  },
  {
    title: "Get your three API keys",
    content: (
      <ul>
        <li>
          <Out href="https://firecrawl.dev">Firecrawl</Out>. Make a free account. Settings, API Keys, copy the key (starts with fc-). Free plan is enough.
        </li>
        <li>
          <Out href="https://apify.com">Apify</Out>. Make a free account. You get $5 of free credits every month, enough for many websites. Profile picture, Settings, API &amp; Integrations, copy the token (starts with apify_api_).
        </li>
        <li>
          <Out href="https://kie.ai">Kie AI</Out>. Make an account, add about $5 of credit (around 100 images). Open the API Key page and copy the key.
        </li>
        <li>In idea.md, replace the three PASTE_YOUR_..._KEY_HERE lines with your keys. Never share this file.</li>
      </ul>
    ),
  },
  {
    title: "The prompt",
    content: (
      <div className="space-y-3">
        <p>
          Paste this into idea.md. Change the three links (website, Instagram, Google Maps) to the business you picked.
        </p>
        <Block>{PROMPT}</Block>
      </div>
    ),
  },
  {
    title: "Run it",
    content: (
      <ul>
        <li>Click the Claude icon, then New Session.</li>
        <li>Type: Read source materials/idea.md and do everything it says.</li>
        <li>Wait. It took about one hour for me.</li>
        <li>When it is done, type: Run the website locally so I can open it in my browser.</li>
        <li>Open the link it gives you (like http://localhost:3000).</li>
        <li>If something looks wrong, tell it in plain words. Example: The page scrolls left and right, fix it.</li>
      </ul>
    ),
  },
  {
    title: "Find businesses and reach out",
    content: (
      <ul>
        <li>
          Type: Use my Apify key and the Google Maps scraper to find 10 businesses in [city] doing [service] with 4.5+ stars and a bad website. Give me name, website, phone and email.
        </li>
        <li>
          Message them: Hi, I built a new website for you. Would you like to see it? If you like it, I will sell it to you. If not, no problem.
        </li>
      </ul>
    ),
  },
  {
    title: "Cost",
    content: (
      <ul>
        <li>Claude Pro: about $20 a month. One website uses a small part of your weekly limit.</li>
        <li>Firecrawl: free. Apify: about 10 cents per business, covered by the free $5. Kie AI: about 50 cents per website.</li>
        <li>Total: about $1 per website.</li>
        <li>Cheaper: build only the top section first and show that. Ask Claude Code to make templates you reuse.</li>
      </ul>
    ),
  },
];

export default function FableMoneyPage() {
  return (
    <ResourcePageShell
      slug="fable-money"
      eyebrow="Fable 5.1"
      title="Website Rebuild Setup Guide"
      subhead="The setup from the video, step by step. Rebuild a local business website with Claude Code in one prompt, then sell it."
      steps={steps}
      jsonLd={{
        title: "Website Rebuild Setup Guide",
        description:
          "Rebuild a local business website with Claude Code and Fable 5.1 in one prompt, then sell it. The exact setup, the prompt, the three API keys and the cost.",
        url: "https://www.oleg.ae/fable-money",
        datePublished: "2026-09-03",
        dateModified: "2026-09-03",
      }}
    />
  );
}
