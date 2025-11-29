import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.countries;

export default function CountriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
