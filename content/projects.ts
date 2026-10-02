export type Media =
  | { kind: "image"; src: string; alt: string }
  | { kind: "field"; tone: "moss" | "steel" | "cashmere" | "ink" | "sand"; label: string };

export type ProjectCategory = "shopify" | "branding"

export type Project = {
  slug: string
  title: string
  client: string
  industry: string
  summary: string
  intro: string
  services: string[]
  technologies: string[]
  liveUrl?: string
  featured: boolean
  category: ProjectCategory
  hero: Media
  gallery: Media[]
  overview: string
  challenge: string
  solution: string
  development: string
  results?: string[]
  quote?: { text: string; attribution: string }
}

export const projects: Project[] = [
  {
    slug: "hylo-athletics",
    title: "Hylo Athletics",
    client: "Hylo Athletics",
    industry: "Performance footwear",
    summary:
      "Ongoing Shopify Plus partnership with the British running shoe company — new features, fresh design and performance work that keeps the store moving.",
    intro:
      "Working on Shopify Plus with British running shoe company Hylo Athletics.",
    services: ["Shopify Plus", "Custom features", "Store optimisation"],
    technologies: ["Shopify Plus", "Liquid", "Custom sections", "Collection merchandising"],
    liveUrl: "https://hyloathletics.com/",
    featured: true,
    category: "shopify",
    hero: {
      kind: "image",
      src: "/images/projects/hylo-2.jpg",
      alt: "Hylo Athletics campaign imagery",
    },
    gallery: [
      {
        kind: "image",
        src: "/images/projects/hylo-1.jpg",
        alt: "Hylo Athletics storefront still",
      },
    ],
    overview:
      "We’ve worked with Hylo on their Shopify Plus store for years, ensuring it consistently has the freshest design, cutting-edge features, and optimised performance. Our collaboration has helped maintain their brand’s competitive edge in the market.",
    challenge:
      "A live Shopify Plus storefront for a performance brand that cannot stand still. Hylo needed a partner who could keep shipping new merchandising ideas without compromising the quality of the existing experience.",
    solution:
      "A long-term development relationship rather than a one-off rebuild. We stay inside the live Plus store, introducing new features and unique sections while protecting performance and brand consistency.",
    development:
      "We’ve introduced new features like rolling collection pages and unique sections to keep the Hylo website at the forefront, ensuring it remains fresh and innovative.",
    quote: {
      text: "Super quick and efficient work from Josh. Couldn't be happier!",
      attribution: "Hylo",
    },
  },
  {
    slug: "project-cosmetics",
    title: "Project Cosmetics",
    client: "Project Cosmetics",
    industry: "Beauty",
    summary:
      "Full WooCommerce to Shopify migration — products, customers and subscriptions — followed by a store experience that doubled conversion rate.",
    intro:
      "Full migration from WooCommerce to Shopify for Project Cosmetics.",
    services: ["Shopify migration", "Subscriptions", "Shopify development"],
    technologies: ["Shopify", "Subscriptions", "Customer data migration", "Product catalogue"],
    liveUrl: "https://www.projectlip.com/",
    featured: true,
    category: "shopify",
    hero: {
      kind: "image",
      src: "/images/projects/project-cosmetics-1.jpg",
      alt: "Project Cosmetics lip gloss campaign",
    },
    gallery: [
      {
        kind: "image",
        src: "/images/projects/project-cosmetics-2.jpg",
        alt: "Project Cosmetics lip gloss campaign",
      },
    ],
    overview:
      "We successfully moved a website from WooCommerce to Shopify, bringing over all products, customers, and subscription data. We carefully exported the products and customer info, making sure everything—from images to purchase histories—transferred smoothly.",
    challenge:
      "An established beauty catalogue already living on WooCommerce, with customers and active subscriptions that could not be left behind. The move had to feel invisible to returning buyers.",
    solution:
      "A structured migration: products and customer records exported with images and purchase histories intact, then subscription data mapped onto Shopify so continuity was preserved on the new platform.",
    development:
      "For subscriptions, we mapped the data to Shopify’s system, ensuring a seamless transition. Now, everything’s running perfectly on the new platform.",
    results: [
      "100% increase in conversion rates after moving to Shopify.",
    ],
  },
  {
    slug: "amy-lynn",
    title: "Amy Lynn",
    client: "Amy Lynn",
    industry: "Luxury womenswear",
    summary:
      "A new Shopify storefront on Prestige for the luxury fashion designer — custom theme work built to convert, with a measurable lift after launch.",
    intro:
      "Custom theme development on Shopify for luxury fashion and womenswear designer.",
    services: ["Shopify development", "Custom theme", "Conversion"],
    technologies: ["Shopify", "Prestige theme", "Custom features", "Theme development"],
    liveUrl: "https://www.amylynn.co.uk/",
    featured: true,
    category: "shopify",
    hero: {
      kind: "image",
      src: "/images/projects/amy-lynn-1.jpg",
      alt: "Amy Lynn campaign imagery",
    },
    gallery: [],
    overview:
      "Working with the team at Amy Lynn we built a brand new Shopify website to showcase their products and gain a higher conversion rate. Working with the Prestige theme we designed and developed a stand out website with loads of custom features to expand the already strong Prestige theme.",
    challenge:
      "A luxury womenswear brand needed a store that could carry the clothes properly — not a stock theme drop, and not a fragile custom build. The existing catalogue needed a sharper presentation and a clearer path to purchase.",
    solution:
      "A new Shopify storefront based on Prestige, extended with custom features so the theme could hold a more distinctive, higher-converting experience.",
    development:
      "Theme customisation, new sections and functionality layered onto Prestige, designed around how Amy Lynn actually merchandises and sells.",
    results: [
      "Total sales increased by 60%.",
      "Total sessions increased by 55%.",
      "Total orders increased by 40%.",
    ],
  },
  {
    slug: "maeving",
    title: "Maeving",
    client: "Maeving",
    industry: "Electric motorcycles",
    summary:
      "Ongoing Shopify development for Maeving — new features, issue resolution, and care for the bike customiser that lets customers build their own electric bike.",
    intro:
      "Ongoing Shopify development and customiser support for Maeving.",
    services: ["Shopify development", "Custom functionality", "Retainer"],
    technologies: ["Shopify", "Custom product customiser", "Frontend development"],
    liveUrl: "https://maeving.com/",
    featured: true,
    category: "shopify",
    hero: { kind: "field", tone: "steel", label: "Maeving" },
    gallery: [],
    overview:
      "We’ve been working with Maeving for quite a while now helping with new features, fixing issues and more. We didn’t build the original site but we’ve made sure it keeps working as required.",
    challenge:
      "A live store with a distinctive product customiser already in market. Maeving needed a development partner who could extend the site and keep a complex buying tool reliable.",
    solution:
      "An ongoing engineering relationship: new features and fixes shipped against the existing store, with particular attention on the customiser experience.",
    development:
      "One great feature on the Maeving site is their unique Bike Customiser, where customers can create their perfect electric bike. We worked with Maeving to keep this working as required and to make sure customers have the perfect experience.",
  },
  {
    slug: "studio-163",
    title: "Studio 163",
    client: "Studio 163",
    industry: "Cashmere knitwear",
    summary:
      "A complete Shopify Plus rebuild for a cashmere knitwear brand — from an outdated site to a cleaner, more modern store built for luxury retail.",
    intro: "Shopify Plus store development for a cashmere knitwear brand.",
    services: ["Shopify Plus", "Store rebuild", "UX"],
    technologies: ["Shopify Plus", "Custom theme work", "Navigation & merchandising"],
    liveUrl: "https://studio163.de/",
    featured: true,
    category: "shopify",
    hero: {
      kind: "image",
      src: "/images/projects/studio-163-1.jpg",
      alt: "Studio 163 campaign portrait",
    },
    gallery: [],
    overview:
      "The client sought to completely revamp their outdated website, aiming to create a more modern and user-friendly experience. The objectives were to enhance user satisfaction through a visually appealing design and intuitive navigation while aligning with current luxury fashion trends.",
    challenge:
      "An ageing storefront that no longer matched a cashmere brand’s standard. The brief was a full refresh: calmer design, clearer navigation, and a buying experience that felt as considered as the product.",
    solution:
      "A fresh, clean Shopify Plus store that transformed the site’s aesthetic and made the catalogue easier to move through.",
    development:
      "A complete rebuild focused on luxury presentation, intuitive navigation and a more contemporary Shopify Plus storefront.",
    results: [
      "Improved user engagement and conversion rates following the rebuild.",
    ],
  },
  {
    slug: "fit-n-fresh",
    title: "Fit N Fresh",
    client: "Fit N Fresh",
    industry: "Protein & wellness",
    summary:
      "Fit N Fresh offer handmade and tastiest ideal protein bars with low-calorie and high-protein to meet various dietary needs. Delivered right to your door.",
    intro:
      "Shopify store for Fit N Fresh — handmade high-protein, low-calorie bars delivered to your door.",
    services: ["Shopify development", "Store design", "E-commerce"],
    technologies: ["Shopify", "Custom theme work", "Product merchandising"],
    featured: true,
    category: "shopify",
    hero: {
      kind: "image",
      src: "/images/projects/fit-n-fresh-1.jpg",
      alt: "Fit N Fresh campaign imagery",
    },
    gallery: [],
    overview:
      "Fit N Fresh make handmade protein bars built for real dietary needs — high protein, low calorie, and delivered straight to the door. We built a Shopify experience that puts the product and the promise front and centre.",
    challenge:
      "A growing food brand needed a store that felt as fresh as the product, with a clear path from discovery to subscription-style repeat buying.",
    solution:
      "A clean Shopify storefront focused on the bars, dietary messaging, and a simple, confident checkout journey.",
    development:
      "Theme work, product presentation and merchandising structure tailored to a direct-to-door protein brand.",
  },
  {
    slug: "north-form",
    title: "North Form",
    client: "North Form",
    industry: "Brand identity",
    summary:
      "A full visual identity for a contemporary product studio — wordmark, type system, colour and brand applications.",
    intro: "Brand identity and art direction for North Form.",
    services: ["Brand identity", "Art direction", "Guidelines"],
    technologies: ["Identity", "Typography", "Brand guidelines"],
    featured: true,
    category: "branding",
    hero: { kind: "field", tone: "ink", label: "North Form" },
    gallery: [],
    overview:
      "We built a clear, flexible identity system that works across packaging, digital and print touchpoints.",
    challenge:
      "A young studio needed a mark and system that felt established without looking generic.",
    solution:
      "A restrained identity built around a distinctive wordmark, a tight type pairing, and a palette that holds up in both print and screen.",
    development:
      "Deliverables included the core mark, type and colour rules, plus a short guideline set for everyday use.",
  },
  {
    slug: "harbour-goods",
    title: "Harbour Goods",
    client: "Harbour Goods",
    industry: "Packaging & brand",
    summary:
      "Packaging and brand design for a lifestyle goods label — tactile print systems with a calm, coastal tone.",
    intro: "Packaging and brand systems for Harbour Goods.",
    services: ["Packaging", "Brand design", "Print"],
    technologies: ["Packaging", "Print design", "Visual system"],
    featured: true,
    category: "branding",
    hero: { kind: "field", tone: "steel", label: "Harbour Goods" },
    gallery: [],
    overview:
      "We designed packaging and supporting brand assets that feel premium on shelf and consistent online.",
    challenge:
      "The product range needed a unified look without losing the character of individual lines.",
    solution:
      "A modular packaging system with shared structure, type and colour — flexible enough for new SKUs.",
    development:
      "Print-ready artwork, dielines and a simple brand kit for future packaging updates.",
  },
  {
    slug: "signal-studio",
    title: "Signal Studio",
    client: "Signal Studio",
    industry: "Visual identity",
    summary:
      "A sharp visual identity and social system for a creative studio — built to move across campaigns and channels.",
    intro: "Visual identity and social design for Signal Studio.",
    services: ["Visual identity", "Social design", "Art direction"],
    technologies: ["Identity", "Social templates", "Campaign design"],
    featured: true,
    category: "branding",
    hero: { kind: "field", tone: "moss", label: "Signal Studio" },
    gallery: [],
    overview:
      "We created an identity and template system that keeps Signal looking distinct across every channel.",
    challenge:
      "Fast-moving social and campaign work needed a system that stayed consistent under pressure.",
    solution:
      "A bold mark, layout rules and reusable templates that the team can apply without losing quality.",
    development:
      "Core identity, social templates and a lightweight brand guide for day-to-day production.",
  },
]

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export function getFeaturedProjects(category?: ProjectCategory) {
  return projects.filter(
    (project) => project.featured && (!category || project.category === category),
  )
}

export function getRelatedProjects(slug: string, limit = 2) {
  const current = getProject(slug)
  return projects
    .filter(
      (project) =>
        project.slug !== slug &&
        (!current || project.category === current.category),
    )
    .slice(0, limit)
}
