import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { MobileCallBar } from "@/components/marketing/MobileCallBar";
import { LocalBusinessSchema } from "@/components/marketing/LocalBusinessSchema";
import { PendingFactsBanner } from "@/components/marketing/PendingFactsBanner";
import { getTenant } from "@/lib/tenant";
import { isPlaceholder } from "@/config/types";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = getTenant();
  // The header is a client component (scroll state), so the phone number is
  // resolved on the server and passed down rather than read from env there.
  const phone = isPlaceholder(t.contact.phone) ? null : t.contact.phone;

  return (
    <>
      <LocalBusinessSchema />
      <PendingFactsBanner />
      <Header phone={phone} />
      <main>{children}</main>
      <Footer />
      <MobileCallBar />
    </>
  );
}
