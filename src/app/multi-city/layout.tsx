import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.multiCity;

export default function MultiCityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
