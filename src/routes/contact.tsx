import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Clock, MessageSquare, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoreLayout } from "@/components/storefront";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Client Concierge & Boutiques | LUXE Atelier" },
      {
        name: "description",
        content:
          "Connect with our private client concierge or discover our international ateliers in Paris, New York, and Tokyo.",
      },
      { property: "og:title", content: "Client Concierge & Boutiques | LUXE Atelier" },
      {
        property: "og:description",
        content:
          "Connect with our private client concierge or discover our international ateliers in Paris, New York, and Tokyo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Garment & Sizing Consultation");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all requested fields.");
      return;
    }
    setSubmitted(true);
    toast.success("Your inquiry has been received by our private client advisor.");
  };

  return (
    <StoreLayout>
      <section className="page-width pb-24 pt-10 sm:pb-32 sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Private Client Relations
          </p>
          <h1 className="mt-3 font-serif text-5xl font-light tracking-tight text-foreground sm:text-6xl">
            Atelier Concierge
          </h1>
          <p className="mt-4 text-xs leading-6 text-muted-foreground sm:text-sm">
            Whether inquiring regarding garment silhouettes, bespoke gift packaging, or private
            viewing appointments, our client relations team attends to every request with care.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Contact Form */}
          <div className="border border-border/80 bg-card p-8 sm:p-10">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-secondary text-foreground">
                  <Check className="size-6 stroke-[1.5]" />
                </div>
                <h2 className="mt-4 font-serif text-3xl font-light">Message Received</h2>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  Thank you, {name}. A dedicated client advisor will respond to {email} within 24
                  hours.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-none text-xs uppercase tracking-wider"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage("");
                  }}
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-medium text-foreground"
                  >
                    Your Name
                  </label>
                  <Input
                    id="contact-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Margaux Dupont"
                    className="mt-2 h-11 rounded-none bg-background text-xs"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-medium text-foreground"
                  >
                    Email Address
                  </label>
                  <Input
                    id="contact-email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="margaux@example.com"
                    className="mt-2 h-11 rounded-none bg-background text-xs"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-medium text-foreground"
                  >
                    Subject of Inquiry
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-2 h-11 w-full border border-border bg-background px-3 text-xs text-foreground"
                  >
                    <option>Garment & Sizing Consultation</option>
                    <option>Bespoke Packaging & Gifting</option>
                    <option>Order & Dispatch Assistance</option>
                    <option>Atelier Appointment Booking</option>
                    <option>Press & Editorial Inquiries</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-medium text-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How may our atelier assist you today?"
                    className="mt-2 w-full border border-border bg-background p-3 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  />
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full rounded-none bg-primary text-[10px] uppercase tracking-[0.18em]"
                >
                  Transmit Message to Concierge
                </Button>
              </form>
            )}
          </div>

          {/* Boutiques & Hours */}
          <div className="space-y-8">
            <div className="border border-border/80 bg-card p-8">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                International Boutiques
              </span>
              <div className="mt-6 space-y-6 divide-y divide-border/60">
                <div className="pt-4 first:pt-0">
                  <h3 className="font-serif text-xl font-normal text-foreground">
                    Maison Saint-Honoré · Paris
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    28 Rue du Faubourg Saint-Honoré, 75008 Paris
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Tuesday–Saturday · 10:00–19:00
                  </p>
                </div>

                <div className="pt-4">
                  <h3 className="font-serif text-xl font-normal text-foreground">
                    Madison Studio · New York
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    740 Madison Avenue, New York, NY 10065
                  </p>
                  <p className="text-[11px] text-muted-foreground">Monday–Saturday · 11:00–18:30</p>
                </div>

                <div className="pt-4">
                  <h3 className="font-serif text-xl font-normal text-foreground">
                    Ginza Sanctuary · Tokyo
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    6-10-1 Ginza, Chuo-ku, Tokyo 104-0061
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Wednesday–Sunday · 11:00–20:00
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-border/80 bg-card p-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Clock className="size-4 text-champagne" />
                <span>Concierge Response Standards</span>
              </div>
              <p className="mt-2 text-xs leading-5">
                Inquiries are answered in order of receipt within 24 hours. For urgent order
                modifications, please mark your subject with your <code>LX-</code> reference number.
              </p>
            </div>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
