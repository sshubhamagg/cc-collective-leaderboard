import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Creator Leaderboard",
  description: "Daily creator leaderboard for Conscious Chemist Creator OS.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps): ReactElement {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
