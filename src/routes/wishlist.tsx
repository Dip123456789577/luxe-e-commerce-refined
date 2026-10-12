import { createFileRoute } from "@tanstack/react-router";
import { PageScaffold } from "@/components/page-scaffold";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Your wishlist | LUXE" }, { name: "description", content: "Keep your LUXE favourites close." }, { property: "og:title", content: "Your wishlist | LUXE" }, { property: "og:description", content: "Keep your LUXE favourites close." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <PageScaffold title="Your wishlist" note="The pieces you've saved for later." />,
});