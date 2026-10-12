import { createFileRoute } from "@tanstack/react-router";
import { PageScaffold } from "@/components/page-scaffold";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "Frequently asked questions | LUXE" }, { name: "description", content: "Answers to common LUXE shopping questions." }, { property: "og:title", content: "Frequently asked questions | LUXE" }, { property: "og:description", content: "Answers to common LUXE shopping questions." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <PageScaffold title="Frequently asked questions" note="A few helpful answers about shopping with LUXE." />,
});