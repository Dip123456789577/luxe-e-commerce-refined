import { createFileRoute } from "@tanstack/react-router";
import { PageScaffold } from "@/components/page-scaffold";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Your account | LUXE" }, { name: "description", content: "Your LUXE account and order history." }, { property: "og:title", content: "Your account | LUXE" }, { property: "og:description", content: "Your LUXE account and order history." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <PageScaffold title="Your account" note="Your details and recent orders." />,
});