import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="grid my-30 grid-cols-1 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="flex flex-col justify-between">
          <CardHeader>
            <Skeleton className="h-10 w-3/4 mb-2" />
          </CardHeader>
          <CardFooter>
            <Skeleton className="h-8 w-24 rounded" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Loading;
