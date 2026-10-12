import { createFileRoute } from "@tanstack/react-router";
import { PageScaffold } from "@/components/page-scaffold";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "Our story | LUXE" }, { name: "description", content: "The considered approach behind LUXE." }, { property: "og:title", content: "Our story | LUXE" }, { property: "og:description", content: "The considered approach behind LUXE." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <PageScaffold title="Our story" note="Thoughtful things for the way you live. Made to be loved, chosen to last." />,
});