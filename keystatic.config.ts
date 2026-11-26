import { collection, config, fields, singleton } from "@keystatic/core";
import { cloudProject, useCloud } from "./lib/cms-storage";

const portfolioImage = (label: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: "public/images/portfolio",
    publicPath: "/images/portfolio/",
  });

const longText = (label: string, description?: string) =>
  fields.text({ label, description, multiline: true });

const tagList = (label: string, description: string, itemLabel: string) =>
  fields.array(fields.text({ label: itemLabel }), {
    label,
    description,
    itemLabel: (props) => props.value || itemLabel,
  });

export default config({
  storage: useCloud ? { kind: "cloud" } : { kind: "local" },
  ...(cloudProject ? { cloud: { project: cloudProject } } : {}),
  ui: {
    brand: { name: "Lab 13" },
    navigation: {
      Work: ["portfolio"],
      Site: ["settings", "about", "loader"],
    },
  },
  collections: {
    portfolio: collection({
      label: "Portfolio",
      slugField: "title",
      path: "content/portfolio/*",
      format: { data: "yaml" },
      columns: ["client", "order"],
      schema: {
        title: fields.slug({
          name: { label: "Project name" },
          slug: {
            label: "Slug",
            description: "Generated from the name. Best left as it is.",
          },
        }),
        featured: fields.checkbox({
          label: "Show on homepage",
          description: "Untick to hide this project without deleting it.",
          defaultValue: true,
        }),
        order: fields.integer({
          label: "Position",
          description: "Lower numbers appear first. Use gaps (10, 20, 30…) so it's easy to slot projects in.",
          defaultValue: 100,
        }),
        plus: fields.checkbox({
          label: "Shopify Plus badge",
          description: "Shows the Shopify Plus logo on the card.",
          defaultValue: false,
        }),
        client: fields.text({ label: "Client" }),
        industry: fields.text({ label: "Industry" }),

        cardImage: portfolioImage(
          "Card image",
          "Shown on the homepage card. Landscape, roughly 16:10, at least 1600px wide.",
        ),
        cardVideo: fields.file({
          label: "Card video (optional)",
          description: "Short MP4 loop that plays on the card instead of the image. Keep it under 10 MB.",
          directory: "public/videos/portfolio",
          publicPath: "/videos/portfolio/",
        }),
        tone: fields.text({
          label: "Card background colour",
          description: "Hex colour shown behind the card while media loads, e.g. #1a1916",
          defaultValue: "#1a1916",
        }),

        liveUrl: fields.url({
          label: "Live site URL",
          description: "Adds a link button, and shows the screenshot below in a browser frame.",
        }),
        liveShot: portfolioImage(
          "Live site screenshot",
          "Full-length page screenshot shown in the popup. Leave empty to show “Preview coming soon”.",
        ),
        frames: fields.array(portfolioImage("Image"), {
          label: "Gallery images",
          description: "Shown in the popup instead of the live site, when there's no live site URL.",
          itemLabel: (props) => props.value?.filename ?? "Image",
        }),

        intro: longText("Intro", "Opening line at the top of the popup."),
        services: tagList(
          "Tags",
          "Shown as pills under the intro, next to the client and industry.",
          "Tag",
        ),
        overview: longText("Overview"),
        challenge: longText("Challenge"),
        solution: longText("Solution"),
        development: longText("Development"),
        results: tagList("Results", "Optional. One line per result.", "Result"),
        quote: fields.object(
          {
            text: longText("Quote", "Leave empty to hide the quote."),
            attribution: fields.text({ label: "Attributed to" }),
          },
          { label: "Client quote (optional)" },
        ),
        technologies: tagList("Technologies", "Shown at the bottom of the popup.", "Technology"),
      },
    }),
  },
  singletons: {
    settings: singleton({
      label: "Site text & settings",
      path: "content/settings",
      format: { data: "json" },
      schema: {
        siteName: fields.text({ label: "Site name", defaultValue: "Lab 13" }),
        wordmark: fields.text({
          label: "Wordmark",
          description: "Top-left logo text on the homepage and loader.",
          defaultValue: "LAB×13",
        }),
        email: fields.text({ label: "Contact email", defaultValue: "info@lab-13.co.uk" }),
        tagline: fields.text({
          label: "Homepage tagline",
          description: "Bottom-left of the homepage and loader.",
          defaultValue: "We know Shopify",
        }),
        aboutLabel: fields.text({ label: "About button", defaultValue: "About" }),
        contactLabel: fields.text({ label: "Contact button", defaultValue: "Contact" }),
        contactHeading: fields.text({ label: "Contact heading", defaultValue: "Get in touch" }),
        seoTitle: fields.text({
          label: "Google title",
          description: "The page title shown in Google and browser tabs.",
        }),
        seoDescription: longText(
          "Google description",
          "The description shown under the title in Google and when the link is shared.",
        ),
      },
    }),
    about: singleton({
      label: "About & team",
      path: "content/about",
      format: { data: "json" },
      schema: {
        about: longText("About text", "Shown in the middle of the About circle."),
        people: fields.array(
          fields.object({
            name: fields.text({ label: "Name" }),
            role: fields.text({ label: "Role" }),
            portrait: fields.image({
              label: "Portrait",
              description: "Optional. Clicking the name shows this photo in the circle.",
              directory: "public/images/team",
              publicPath: "/images/team/",
            }),
          }),
          {
            label: "Team",
            itemLabel: (props) => props.fields.name.value || "Person",
          },
        ),
      },
    }),
    loader: singleton({
      label: "Loader",
      path: "content/loader",
      format: { data: "json" },
      schema: {
        enabled: fields.checkbox({
          label: "Show loader",
          description: "Untick to open the site straight away.",
          defaultValue: true,
        }),
        style: fields.select({
          label: "Loader",
          description: "Lines is the wave ribbon. Text fills the sentence in as the site loads.",
          options: [
            { label: "Lines", value: "lines" },
            { label: "Text", value: "text" },
          ],
          defaultValue: "lines",
        }),
        duration: fields.number({
          label: "Minimum time (seconds)",
          description: "How long the loader runs at minimum. The lines draw, or the sentence fills, over this time.",
          defaultValue: 2.8,
          step: 0.1,
          validation: { min: 0.5, max: 10 },
        }),
        hold: fields.number({
          label: "Hold time (seconds)",
          description: "How long the finished loader stays before the site appears.",
          defaultValue: 0.7,
          step: 0.1,
          validation: { min: 0, max: 5 },
        }),
        message: fields.text({
          label: "Sentence",
          description: "Text loader only. The sentence itself is the loader: it fills in as the site loads.",
          multiline: true,
          defaultValue:
            "We work with wellbeing, food & drink, health and fashion Shopify stores to take them to the next level of conversion, style and usability.",
        }),
        lines: fields.integer({
          label: "Number of lines",
          description: "Line loader only.",
          defaultValue: 22,
          validation: { min: 4, max: 60 },
        }),
        brightness: fields.number({
          label: "Line brightness",
          description: "Line loader only. 1 is the default. Higher is brighter.",
          defaultValue: 1,
          step: 0.1,
          validation: { min: 0.2, max: 2 },
        }),
        label: fields.text({
          label: "Top-right text",
          description: "Line loader only.",
          defaultValue: "Loading",
        }),
      },
    }),
  },
});
