import { InferSelectModel } from "drizzle-orm";
import { projects } from "@/db/schema";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
type Project = InferSelectModel<typeof projects>;

type Props = { projects: Project[] };

const ProjectList = (props: Props) => {
  return (
    <div className="px-4 py-6">
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:w-3xl md:w-full">
        {props.projects.map((project: any) => (
          <Card
            key={project.id}
            className="flex flex-col justify-between w-full mx-auto"
          >
            <CardHeader className="text-center md:text-left">
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>
                {project.description || "No description provided."}
              </CardDescription>
            </CardHeader>

            <CardFooter className="justify-center md:justify-start">
              <Link href={`/projects/${project.id}`}>
                <Button>View Project</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
