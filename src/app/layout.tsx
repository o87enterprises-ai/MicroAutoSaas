import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { getTenant, isLiveSite } from "@/lib/tenant";
import { orTBD } from "@/config/types";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export function generateMetadata(): Metadata {
  const t = getTenant();
  const domain = orTBD(t.domain, "localhost:3000");
  const primaryCity = t.serviceArea[0];

  return {
    title: {
      default: `${t.businessName} — Electrician in ${primaryCity}, ${t.address.state}`,
      template: `%s | ${t.shortName}`,
    },
    description: t.description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? `https://${domain}`,
    ),
    openGraph: {
      title: `${t.businessName} — Electrician in ${primaryCity}, ${t.address.state}`,
      description: t.description,
      type: "website",
      locale: "en_US",
    },
    robots: {
      // Nothing gets indexed until the site is genuinely live on its own
      // domain. Preview deploys must never compete with the real site.
      index: isLiveSite(),
      follow: isLiveSite(),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${archivo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
