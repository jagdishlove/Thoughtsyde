import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import PageHeader from "@/components/page-header";
import Footer from "@/app/landing-page/footer";
import { ToasterProvider } from "@/components/ui/toaster";

export const metadata = {
  title: "Feedloop - Collect Customer Feedback Seamlessly",
  description:
    "Easily integrate our feedback widget and start collecting valuable feedback from your users today.",
  icons: {
    icon: [{ url: "/favicon.png" }],
    shortcut: "/favicon.png",
    apple: [{ url: "/favicon.png" }],
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
          <ToasterProvider />
          <PageHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
