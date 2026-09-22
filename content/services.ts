export type Service = {
  slug: string
  number: string
  title: string
  short: string
  intro: string
  description: string
  capabilities: string[]
  process: { title: string; body: string }[]
  relatedProjects: string[]
}

export const services: Service[] = [
  {
    slug: "shopify-development",
    number: "01",
    title: "Shopify Development",
    short: "New store builds, optimisation and custom features.",
    intro:
      "We design and build Shopify websites for established businesses and upcoming brands — stores that simplify the complex for customers and for the teams who run them.",
    description:
      "At Lab 13 we create Shopify and Shopify Plus websites that look considered and behave correctly. That means new store builds, performance-minded theme work, and the custom features most themes will not give you out of the box.",
    capabilities: [
      "New Shopify store builds",
      "Store optimisation",
      "Custom features and sections",
      "Theme design and development",
      "Shopify website updates",
      "Subscription experiences",
    ],
    process: [
      {
        title: "Understand the store",
        body: "We start with how you sell, what the theme needs to do, and where the current experience is getting in the way.",
      },
      {
        title: "Design the build",
        body: "Structure, merchandising and the custom pieces that actually need to be built — before we write Liquid.",
      },
      {
        title: "Develop on Shopify",
        body: "Theme work, custom functionality and integrations, built to be maintained rather than handed over as a black box.",
      },
      {
        title: "Launch and refine",
        body: "Go-live support, then the updates and optimisation that keep a store moving after launch.",
      },
    ],
    relatedProjects: ["amy-lynn", "hylo-athletics", "maeving"],
  },
  {
    slug: "shopify-plus",
    number: "02",
    title: "Shopify Plus",
    short: "Development, migration and growth on Plus.",
    intro:
      "Make the switch to Shopify Plus — or get more from the Plus store you already run — with a studio that works on Plus every week.",
    description:
      "Lab 13 is a small family-run studio building Shopify Plus stores and custom apps. We help brands move onto Plus, develop against it, and keep growing the store after launch.",
    capabilities: [
      "Shopify Plus development",
      "Shopify Plus migrations",
      "Plus store growth",
      "Checkout and merchandising work",
      "Ongoing Plus retainers",
    ],
    process: [
      {
        title: "Map the Plus move",
        body: "What needs to come across, what should be rebuilt, and which Plus capabilities the brand will actually use.",
      },
      {
        title: "Build the store",
        body: "A Shopify Plus storefront designed around the catalogue, the team and the way customers buy.",
      },
      {
        title: "Migrate with care",
        body: "Products, customers and history moved without theatre — and without leaving the old store half-alive.",
      },
      {
        title: "Grow on Plus",
        body: "New features, optimisation and a development partner who already knows the store.",
      },
    ],
    relatedProjects: ["hylo-athletics", "studio-163"],
  },
  {
    slug: "shopify-migrations",
    number: "03",
    title: "Shopify Migrations",
    short: "From other platforms, or up to Shopify Plus.",
    intro:
      "We make Shopify migrations measured and complete. Whether you are leaving another platform or upgrading an existing Shopify store, we handle the heavy lifting.",
    description:
      "A migration is only successful if customers, products and history arrive intact. We have moved stores including WooCommerce catalogues with live subscriptions, mapping data so the new Shopify store opens ready to trade.",
    capabilities: [
      "WooCommerce to Shopify",
      "Platform to Shopify moves",
      "Shopify to Shopify Plus upgrades",
      "Product and customer data",
      "Subscription mapping",
      "Purchase history continuity",
    ],
    process: [
      {
        title: "Audit the source",
        body: "Catalogue, customers, orders, subscriptions and content — what must move, and what should be redesigned on the way.",
      },
      {
        title: "Map the data",
        body: "Products, images, customers and histories exported carefully, then shaped for Shopify.",
      },
      {
        title: "Rebuild the storefront",
        body: "A Shopify experience that is not just a lift-and-shift of the old templates.",
      },
      {
        title: "Cut over cleanly",
        body: "Redirects, QA and a launch where the new store is the store — not a parallel experiment.",
      },
    ],
    relatedProjects: ["project-cosmetics"],
  },
  {
    slug: "shopify-app-development",
    number: "04",
    title: "Shopify App Development",
    short: "Custom apps, integrations and embedded apps.",
    intro:
      "Upgrade a Shopify store with the right app — or the one that does not exist yet. Guided by a team that builds custom, embedded and integrated Shopify apps.",
    description:
      "When a public app is the wrong shape, we build the one the store actually needs. Custom apps, embedded admin experiences and integrations that sit cleanly inside Shopify rather than around it.",
    capabilities: [
      "Custom Shopify apps",
      "Embedded apps",
      "Integrations",
      "Store-specific tooling",
      "App-led workflows",
    ],
    process: [
      {
        title: "Define the gap",
        body: "What the theme, admin or operations cannot do today — and whether an app is the right place to solve it.",
      },
      {
        title: "Shape the product",
        body: "A focused app, not a platform. Clear jobs, a Shopify-native interface, no unused surface area.",
      },
      {
        title: "Build and embed",
        body: "Custom and embedded apps, wired into the store and the tools the team already uses.",
      },
      {
        title: "Support the live app",
        body: "Changes, fixes and the next integration as the store grows.",
      },
    ],
    relatedProjects: ["maeving", "hylo-athletics"],
  },
  {
    slug: "shopify-retainers",
    number: "05",
    title: "Shopify Retainers",
    short: "Support, continuous improvement, a dedicated team.",
    intro:
      "Drive continuous growth and improvement on your Shopify store with a development retainer — support when you need it, from people who already know the build.",
    description:
      "Most stores do not need a new agency every quarter. They need a dedicated team who can ship the next feature, fix what broke, and keep improving conversion after launch.",
    capabilities: [
      "Ongoing Shopify support",
      "Continuous improvement",
      "Dedicated development time",
      "Store updates and new functionality",
      "Performance and UX iteration",
    ],
    process: [
      {
        title: "Get inside the store",
        body: "We learn the theme, the apps and the way your team actually works — so requests do not start from zero.",
      },
      {
        title: "Keep a backlog moving",
        body: "Support tickets, small features and the improvements that never make it into a big rebuild.",
      },
      {
        title: "Ship in the live environment",
        body: "Careful releases on a trading store, with the context of someone who has been there before.",
      },
      {
        title: "Improve continuously",
        body: "Retainers exist so the store gets better every month, not only when something is on fire.",
      },
    ],
    relatedProjects: ["hylo-athletics", "maeving"],
  },
  {
    slug: "custom-shopify-functionality",
    number: "06",
    title: "Custom Shopify Functionality",
    short: "Themes, features and the pieces a template will not do.",
    intro:
      "Custom Shopify themes and functionality for brands that have already outgrown a stock setup.",
    description:
      "From unique sections to product customisers, we build the parts of a Shopify store that have to be specific. If the theme is close but not enough, we extend it. If the buying journey needs its own logic, we write it.",
    capabilities: [
      "Custom Shopify themes",
      "Bespoke sections and landing pages",
      "Product customisers",
      "Subscription experiences",
      "Theme extensions on Prestige and custom bases",
    ],
    process: [
      {
        title: "Find the real requirement",
        body: "The feature the brand is describing, and the Shopify-native way to build it so it still belongs in the admin.",
      },
      {
        title: "Prototype the interaction",
        body: "Especially for customisers and unusual merchandising — prove the journey before it is wired into checkout.",
      },
      {
        title: "Build into the theme",
        body: "Liquid, sections, apps and storefront logic that a merchant can still operate.",
      },
      {
        title: "Keep it working",
        body: "The unglamorous part: updates, edge cases and the next version of the same feature.",
      },
    ],
    relatedProjects: ["maeving", "amy-lynn", "hylo-athletics"],
  },
]

export function getService(slug: string) {
  return services.find((service) => service.slug === slug)
}
