import { createFileRoute } from "@tanstack/react-router";
import { PageScaffold } from "@/components/page-scaffold";

export const Route = createFileRoute("/product/$slug")({
  head: () => ({ meta: [{ title: "A considered find | LUXE" }, { name: "description", content: "Discover a considered piece from LUXE." }, { property: "og:title", content: "A considered find | LUXE" }, { property: "og:description", content: "Discover a considered piece from LUXE." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <PageScaffold title="A considered find" note="Thoughtfully chosen. Made to be loved." />,
});