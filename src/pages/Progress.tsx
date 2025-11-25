import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Image as ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const Progress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
    }
    setLoading(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <header className="border-b bg-background sticky top-0 z-10">
            <div className="flex items-center h-16 px-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold ml-4">Progress Images</h1>
            </div>
          </header>

          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Progress Gallery</h2>
              <p className="text-muted-foreground">Track your transformation with photos</p>
            </div>

            {loading ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Loading...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-primary" />
                      Upload Progress Photo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12">
                      <div className="text-center space-y-4">
                        <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                        <div>
                          <p className="font-medium">Photo upload coming soon</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Take progress photos regularly to track your transformation
                          </p>
                        </div>
                        <Button disabled className="mt-4">
                          Upload Photo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      Your Progress Photos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 space-y-4">
                      <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto" />
                      <div>
                        <p className="font-medium">No photos yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Start uploading progress photos to see your transformation journey
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold">📸 Photo Tips:</h3>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Take photos in the same lighting and location</li>
                        <li>Use the same pose for consistency</li>
                        <li>Take photos weekly or monthly</li>
                        <li>Include front, side, and back views</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Progress;
