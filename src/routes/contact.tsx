import { createFileRoute } from "@tanstack/react-router";
import { PageScaffold } from "@/components/page-scaffold";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact us | LUXE" }, { name: "description", content: "Get in touch with the LUXE team." }, { property: "og:title", content: "Contact us | LUXE" }, { property: "og:description", content: "Get in touch with the LUXE team." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <PageScaffold title="We're here to help" note="Our team would love to hear from you." />,
});