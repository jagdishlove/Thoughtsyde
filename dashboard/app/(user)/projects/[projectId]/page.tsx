import { db } from "@/db";
import { eq, or, isNull } from "drizzle-orm";
import { projects as dbProjects } from "@/db/schema";
import Link from "next/link";
import { Globe, ChevronLeft, Code, Settings, BarChart3, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/animated-section";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async ({ params }: {
  params: {
    projectId: string
  }
}) => {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  if (!params.projectId) return (<div>Invalid Project ID</div>);

  const isNumericId = /^\d+$/.test(params.projectId);
  
  let project;
  if (isNumericId) {
    const numericId = parseInt(params.projectId, 10);
    const projectList = await db.query.projects.findMany({
      where: eq(dbProjects.id, numericId),
      with: { feedbacks: true }
    });
    project = projectList[0];
  } else {
    const projectList = await db.query.projects.findMany({
      where: eq(dbProjects.uuid, params.projectId),
      with: { feedbacks: true }
    });
    project = projectList[0];
  }

  if (!project) {
    return redirect("/dashboard?error=not_found");
  }
  
  if (project.userId !== userId) {
    return redirect("/dashboard?error=unauthorized");
  }

  const feedbackCount = project.feedbacks?.length || 0;

  return (
    <div className="section-container py-8">
      {/* Breadcrumb */}
      <AnimatedSection animation="fade-in">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-all duration-300 hover:translate-x-[-4px] text-sm group">
            <ChevronLeft className="h-4 w-4 mr-1 group-hover:animate-bounce" />
            Back to projects
          </Link>
        </div>
      </AnimatedSection>

      {/* Header Section */}
      <AnimatedSection animation="fade-in-up" delay={100}>
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge variant="secondary" className="badge-smooth">
                <MessageSquare className="w-3 h-3 mr-1" />
                {feedbackCount} feedback{feedbackCount !== 1 ? 's' : ''}
              </Badge>
            </div>
            <p className="text-gray-600 text-lg">{project.description || "No description provided"}</p>
            
            {project.url && (
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mt-2 text-sm group"
              >
                <Globe className="h-4 w-4 mr-1 transition-transform group-hover:scale-110" />
                {project.url}
                <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="btn-secondary">
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Site
                </Button>
              </a>
            )}
            
            <Link href={`/projects/${params.projectId}/instructions`}>
              <Button className="btn-primary">
                <Code className="h-4 w-4 mr-2" />
                Get Embed Code
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Quick Setup Card (Show if no feedbacks yet) */}
      {feedbackCount === 0 && (
        <AnimatedSection animation="scale-in" delay={200}>
          <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-900">
                <BarChart3 className="h-5 w-5" />
                Ready to Collect Feedback?
              </CardTitle>
              <CardDescription className="text-indigo-700">
                Your project is set up but has not received any feedback yet. 
                Install the widget on your website to start collecting valuable insights from your users.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Link href={`/projects/${params.projectId}/instructions`}>
                <Button className="btn-primary">
                  <Code className="h-4 w-4 mr-2" />
                  View Installation Guide
                </Button>
              </Link>
            </CardContent>
          </Card>
        </AnimatedSection>
      )}

      {/* Feedback Section with Analytics */}
      <AnimatedSection animation="fade-in-up" delay={300}>
        <div className="mt-8">
          <Table data={project.feedbacks} />
        </div>
      </AnimatedSection>

      {/* Settings / Instructions Footer */}
      <AnimatedSection animation="fade-in" delay={400}>
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-medium text-gray-900">Need to update your widget?</h3>
              <p className="text-gray-600 text-sm">
                View installation instructions or get the embed code again.
              </p>
            </div>
            <Link href={`/projects/${params.projectId}/instructions`}>
              <Button variant="outline" className="btn-secondary">
                <Settings className="h-4 w-4 mr-2" />
                Widget Settings
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}

export default page;