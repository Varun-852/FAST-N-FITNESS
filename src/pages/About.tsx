import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FitnessIcon } from "@/components/FitnessIcon";

const About = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <header className="border-b bg-background sticky top-0 z-10">
            <div className="flex items-center h-16 px-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold ml-4">About</h1>
            </div>
          </header>

          <div className="p-6 space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <FitnessIcon size={64} />
                </div>
                <CardTitle className="text-2xl">Fast N Fitness</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  A quick and simple way to record your program and follow your body and exercise progression.
                </p>
                <p className="text-sm text-muted-foreground">
                  Version 1.0.0
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default About;
