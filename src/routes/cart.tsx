import { createFileRoute } from "@tanstack/react-router";
import { PageScaffold } from "@/components/page-scaffold";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your shopping bag | LUXE" }, { name: "description", content: "Review your LUXE shopping bag." }, { property: "og:title", content: "Your shopping bag | LUXE" }, { property: "og:description", content: "Review your LUXE shopping bag." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <PageScaffold title="Your bag" note="Your considered finds, all in one place." />,
});