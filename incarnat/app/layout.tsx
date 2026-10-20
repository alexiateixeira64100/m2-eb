import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "INCARNAT — L'intensité à fleur de peau",
  description: "Un nouveau parfum. Une présence qui reste. Découvrez INCARNAT, le 20 décembre 2026.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
