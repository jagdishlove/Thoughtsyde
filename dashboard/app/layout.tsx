import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import PageHeader from "@/components/page-header";
import Footer from "@/app/landing-page/footer";

export const metadata = {
  title: "Feedloop - Collect Customer Feedback Seamlessly",
  description:
    "Easily integrate our feedback widget and start collecting valuable feedback from your users today.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body className="antialiased min-h-screen flex flex-col bg-white">
          <PageHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
