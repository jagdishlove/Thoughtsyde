import CodeBlock from "@/components/copyCode";
import { Code } from "lucide-react";

const page = ({
  params,
}: {
  params: {
    projectId: string;
  };
}) => {
  const widgetUrl = process.env.WIDGET_URL;

  if (!params.projectId)
    return (
      <div>
        <h1>Invalid project ID</h1>
      </div>
    );
  if (!process.env.WIDGET_URL)
    return (
      <div>
        <h1>Missing widget URL</h1>
      </div>
    );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center mb-4">
        <Code className="h-6 w-6 text-gray-600 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Start Collecting Feedback
        </h2>
      </div>
      <p className="text-gray-600 mb-4">
        Embed this code into your website to activate the feedback widget.
      </p>
      <CodeBlock projectId={params.projectId} widgetUrl={widgetUrl} />
    </div>
  );
};
export default page;
