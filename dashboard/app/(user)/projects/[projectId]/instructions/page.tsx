import CopyBtn from "@/components/copy-btn";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Code,
  FileCode,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const page = ({
  params,
}: {
  params: {
    projectId: string;
  };
}) => {
  if (!params.projectId) return <div>Invalid Project ID</div>;
  if (!process.env.WIDGET_URL) return <div>Missing WIDGET_URL</div>;

  const widgetCode = `<my-widget project-id="${params.projectId}"></my-widget>`;
  const scriptCode = `<script src="${process.env.WIDGET_URL}/widget.umd.js"></script>`;
  const fullCode = `${widgetCode}\n${scriptCode}`;

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 max-w-4xl">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
          <Link
            href="/dashboard"
            className="hover:text-indigo-600 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <span>/</span>
          <Link
            href={`/projects/${params.projectId}`}
            className="hover:text-indigo-600"
          >
            Project
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Embed Code</span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
          <Code className="w-8 h-8 text-indigo-600" />
          Installation Guide
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Follow these steps to add the feedback widget to your website
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4 sm:space-y-6">
        {/* Step 1 */}
        <Card className="overflow-x-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                1
              </div>
              <CardTitle>Add the Widget Element</CardTitle>
            </div>
            <CardDescription>
              Copy and paste this code where you want the feedback button to
              appear on your site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 p-2 sm:p-4 rounded-lg relative group overflow-x-auto">
              <code className="text-green-400 text-xs sm:text-sm font-mono block break-words whitespace-pre-wrap">
                {widgetCode}
              </code>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyBtn text={widgetCode} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="overflow-x-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                2
              </div>
              <CardTitle>Include the Script</CardTitle>
            </div>
            <CardDescription>
              Add this script tag before the closing &lt;/body&gt; tag of your
              HTML
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 p-2 sm:p-4 rounded-lg relative group overflow-x-auto">
              <code className="text-blue-400 text-xs sm:text-sm font-mono block break-words whitespace-pre-wrap">
                {scriptCode}
              </code>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyBtn text={scriptCode} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Full Code Example */}
        <Card className="border-indigo-200 bg-indigo-50/50 overflow-x-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                3
              </div>
              <CardTitle>Complete Example</CardTitle>
            </div>
            <CardDescription>
              Here is how your HTML should look with both elements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 p-2 sm:p-4 rounded-lg relative overflow-x-auto">
              <code className="text-gray-300 text-xs sm:text-sm font-mono block whitespace-pre break-words">
                {`<!DOCTYPE html>
<html>
<head>
  <title>Your Site</title>
</head>
<body>
  <!-- Your website content -->
  
  <!-- Widget button will appear here -->
  ${widgetCode}
  
  <!-- Widget script (place before </body>) -->
  ${scriptCode}
</body>
</html>`}
              </code>
              <div className="absolute top-2 right-2">
                <CopyBtn text={fullCode} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Alert */}
        <Alert className="bg-yellow-50 border-yellow-200 text-xs sm:text-sm">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Pro Tips</AlertTitle>
          <AlertDescription className="text-yellow-700">
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                The widget works with any website - React, Vue, vanilla HTML,
                etc.
              </li>
              <li>You can place multiple widgets on the same page if needed</li>
              <li>The feedback will automatically appear in your dashboard</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Success/Verification Alert */}
        <Alert className="bg-green-50 border-green-200 text-xs sm:text-sm">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">All Set!</AlertTitle>
          <AlertDescription className="text-green-700">
            Once you have added the code, visit your website to see the feedback
            button. Test it by submitting a test feedback.
          </AlertDescription>
        </Alert>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
        <Link href={`/projects/${params.projectId}`} className="flex-1 min-w-0">
          <Button
            variant="outline"
            className="w-full text-xs sm:text-sm py-2 sm:py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Button>
        </Link>
        <Link href="/dashboard" className="flex-1 min-w-0">
          <Button
            variant="outline"
            className="w-full text-xs sm:text-sm py-2 sm:py-3"
          >
            <Globe className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
