import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar } from "lucide-react";

const Programs = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadWorkouts();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
    }
  };

  const loadWorkouts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('workout_date', { ascending: false })
        .limit(20);

      if (data) setWorkouts(data);
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupByDate = (workouts: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    workouts.forEach(workout => {
      const date = new Date(workout.workout_date).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(workout);
    });
    return grouped;
  };

  const groupedWorkouts = groupByDate(workouts);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <header className="border-b bg-background sticky top-0 z-10">
            <div className="flex items-center h-16 px-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold ml-4">Program List</h1>
            </div>
          </header>

          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Workout History</h2>
              <p className="text-muted-foreground">Review your training program and workout history</p>
            </div>

            {loading ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Loading...</p>
                </CardContent>
              </Card>
            ) : workouts.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-semibold">No workouts yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Start tracking your workouts in the Exercises section
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedWorkouts).map(([date, dateWorkouts]) => (
                  <Card key={date}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                        {date}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dateWorkouts.map((workout) => (
                          <div key={workout.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <Activity className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">{workout.workout_type}</p>
                                <p className="text-sm text-muted-foreground">
                                  {workout.duration_minutes} minutes
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary">{workout.calories_burned}</p>
                              <p className="text-xs text-muted-foreground">calories</p>
                            </div>
                          </div>
                        ))}
                        <div className="pt-2 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total for {date}:</span>
                            <span className="font-semibold">
                              {dateWorkouts.reduce((sum, w) => sum + w.calories_burned, 0)} calories
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Programs;
