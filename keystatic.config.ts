import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: { name: "Lab 13" },
  },
  collections: {
    portfolio: collection({
      label: "Portfolio",
      slugField: "title",
      path: "content/portfolio/*",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        client: fields.text({ label: "Client" }),
        industry: fields.text({ label: "Industry" }),
        category: fields.select({
          label: "Portfolio",
          options: [
            { label: "Shopify", value: "shopify" },
            { label: "Branding", value: "branding" },
          ],
          defaultValue: "shopify",
        }),
        summary: fields.text({ label: "Popup summary", multiline: true }),
        result: fields.text({
          label: "Popup result line",
          description: "Optional highlight shown under the summary",
          multiline: true,
        }),
        services: fields.array(fields.text({ label: "Service" }), {
          label: "Services",
          itemLabel: (props) => props.value || "Service",
        }),
        liveUrl: fields.url({ label: "Live URL" }),
        featured: fields.checkbox({
          label: "Show on homepage wave",
          defaultValue: true,
        }),
        order: fields.integer({
          label: "Order",
          description: "Lower numbers appear first",
          defaultValue: 100,
        }),
        tone: fields.text({
          label: "Fallback tone colour",
          description: "Hex colour used before the card image loads",
          defaultValue: "#1a1916",
        }),
        cardImage: fields.image({
          label: "Card image",
          description: "Main carousel card",
          directory: "public/images/projects/previews",
          publicPath: "/images/projects/previews/",
        }),
        cardVideo: fields.file({
          label: "Card video (optional)",
          description: "MP4 shown on the card instead of / with the image",
          directory: "public/videos",
          publicPath: "/videos/",
        }),
        frames: fields.array(
          fields.image({
            label: "Frame",
            directory: "public/images/projects",
            publicPath: "/images/projects/",
          }),
          {
            label: "Popup gallery frames",
            description: "Images shown in the project popup",
            itemLabel: (props) =>
              (typeof props.value === "string" ? props.value : null) || "Frame",
          },
        ),
      },
    }),
  },
});
