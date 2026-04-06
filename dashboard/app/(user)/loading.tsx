import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 md:mt-6 justify-items-center">
      {[1, 2, 3].map((_, idx) => (
        <div className="flex flex-col space-y-3 items-center" key={idx}>
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2 flex flex-col items-center">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
