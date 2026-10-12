import { createFileRoute } from "@tanstack/react-router";
import { PageScaffold } from "@/components/page-scaffold";

export const Route = createFileRoute("/shop")({
  head: () => ({ meta: [{ title: "Shop the collection | LUXE" }, { name: "description", content: "Discover thoughtful fashion and lifestyle pieces from LUXE." }, { property: "og:title", content: "Shop the collection | LUXE" }, { property: "og:description", content: "Discover thoughtful fashion and lifestyle pieces from LUXE." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <PageScaffold title="The collection" note="A considered edit of everyday favourites." />,
});