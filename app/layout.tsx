import type { Metadata } from "next";
import "./globals.css";
import { CheckoutProvider } from "@/context/CheckoutContext";

export const metadata: Metadata = {
  title: "Ecoyaan – Sustainable Checkout",
  description: "Checkout for eco-friendly products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CheckoutProvider>
          <div className="page-shell">{children}</div>
        </CheckoutProvider>
      </body>
    </html>
  );
}
