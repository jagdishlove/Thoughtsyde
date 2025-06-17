import { Suspense } from "react";
import Loading from "./loading";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto w-full ">
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
}
