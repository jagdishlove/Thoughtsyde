import CodeBlock from "@/components/copyCode";

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
    <div>
      <h1>Start collecting feedback</h1>
      <p>Embed the code in our site</p>
      <CodeBlock projectId={params.projectId} widgetUrl={widgetUrl} />
    </div>
  );
};
export default page;
