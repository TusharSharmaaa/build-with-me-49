import { Helmet } from "react-helmet-async";

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}

// Website schema for home page
export function WebsiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "AI Tools List",
        url: window.location.origin,
        description: "Discover free AI tools for your profession with transparent pricing and usage limits",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${window.location.origin}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

// Software application schema for tool detail pages
export function ToolSchema({ tool }: { tool: any }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.description,
        applicationCategory: tool.category || "Utility",
        offers: {
          "@type": "Offer",
          price: tool.free_tier ? "0" : undefined,
          priceCurrency: tool.free_tier ? "USD" : undefined,
        },
        aggregateRating: tool.rating && tool.reviews_count > 0 ? {
          "@type": "AggregateRating",
          ratingValue: tool.rating,
          reviewCount: tool.reviews_count,
          bestRating: 5,
          worstRating: 1,
        } : undefined,
        operatingSystem: "Web",
        url: tool.website_url,
      }}
    />
  );
}

// ItemList schema for category pages
export function CategorySchema({ categoryName, tools }: { categoryName: string; tools: any[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${categoryName} AI Tools`,
        description: `Curated list of AI tools for ${categoryName}`,
        numberOfItems: tools.length,
        itemListElement: tools.slice(0, 10).map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "SoftwareApplication",
            name: tool.name,
            description: tool.description,
            url: `${window.location.origin}/tool/${tool.id}`,
          },
        })),
      }}
    />
  );
}
