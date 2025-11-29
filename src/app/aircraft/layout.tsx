import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.aircraft;

export default function AircraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
