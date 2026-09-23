import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { MobileCallBar } from "@/components/marketing/MobileCallBar";
import { LocalBusinessSchema } from "@/components/marketing/LocalBusinessSchema";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LocalBusinessSchema />
      <Header />
      <main>{children}</main>
      <Footer />
      <MobileCallBar />
    </>
  );
}
