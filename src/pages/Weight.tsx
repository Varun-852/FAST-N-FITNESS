import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, TrendingDown, TrendingUp } from "lucide-react";

const Weight = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadProfile();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
    }
  };

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (data) setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <header className="border-b bg-background sticky top-0 z-10">
            <div className="flex items-center h-16 px-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold ml-4">Weight Track</h1>
            </div>
          </header>

          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Weight Tracking</h2>
              <p className="text-muted-foreground">Monitor your weight progress over time</p>
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
                      <Scale className="h-5 w-5 text-primary" />
                      Current Weight
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center py-6">
                        <p className="text-5xl font-bold text-primary">{profile?.weight}</p>
                        <p className="text-muted-foreground mt-2">kilograms</p>
                      </div>
                      <div className="text-sm text-muted-foreground text-center">
                        Last updated: {new Date(profile?.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Fitness Goal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile?.fitness_goal ? (
                      <div className="flex items-start gap-3">
                        {profile.fitness_goal.toLowerCase().includes('lose') ? (
                          <TrendingDown className="h-5 w-5 text-primary mt-1" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-primary mt-1" />
                        )}
                        <div>
                          <p className="font-medium">{profile.fitness_goal}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Keep tracking your workouts to achieve your goal!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No fitness goal set</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Update your weight in the Profile section to track your progress
                      </p>
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

export default Weight;
