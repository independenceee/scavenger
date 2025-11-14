import Provider from "@/providers";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GlacierDrop - Scavenger Mine",
  description: "Mine NIGHT tokens by solving cryptographic challenges.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
