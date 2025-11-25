import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Dumbbell, Plus } from "lucide-react";

const workoutTypes = [
  { name: "Running", calories: 10 },
  { name: "Cycling", calories: 8 },
  { name: "Walking", calories: 4 },
  { name: "Yoga", calories: 3 },
  { name: "Weight Training", calories: 6 },
  { name: "Swimming", calories: 12 },
  { name: "HIIT", calories: 15 },
  { name: "Dancing", calories: 7 },
];

const Exercises = () => {
  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
    loadRecentWorkouts();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
    }
  };

  const loadRecentWorkouts = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) setRecentWorkouts(data);
  };

  const calculateCalories = (type: string, mins: number) => {
    const workout = workoutTypes.find(w => w.name === type);
    return workout ? workout.calories * mins : 0;
  };

  const handleAddWorkout = async () => {
    if (!selectedWorkout || !duration) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const durationNum = parseInt(duration);
      const calories = calculateCalories(selectedWorkout, durationNum);

      const { error } = await supabase.from('workouts').insert({
        user_id: session.user.id,
        workout_type: selectedWorkout,
        duration_minutes: durationNum,
        calories_burned: calories,
      });

      if (error) throw error;

      // Check for achievements
      const { data: workouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', session.user.id);

      if (workouts) {
        const totalWorkouts = workouts.length;
        const totalCalories = workouts.reduce((sum, w) => sum + w.calories_burned, 0);

        // First workout achievement
        if (totalWorkouts === 1) {
          await supabase.from('achievements').insert({
            user_id: session.user.id,
            achievement_type: 'first_workout',
            achievement_name: 'First Workout Completed',
          });
        }

        // 100 calories achievement
        if (totalCalories >= 100) {
          const { data: existing } = await supabase
            .from('achievements')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('achievement_type', '100_calories');

          if (!existing || existing.length === 0) {
            await supabase.from('achievements').insert({
              user_id: session.user.id,
              achievement_type: '100_calories',
              achievement_name: '100 Calories Burned',
            });
            toast({
              title: "🎉 Achievement Unlocked!",
              description: "100 Calories Burned",
            });
          }
        }
      }

      toast({
        title: "Workout added!",
        description: `${calories} calories burned`,
      });

      setSelectedWorkout("");
      setDuration("");
      loadRecentWorkouts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
              <h1 className="text-xl font-bold ml-4">Exercises</h1>
            </div>
          </header>

          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Exercise Library</h2>
              <p className="text-muted-foreground">Track your workouts and burn those calories!</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Log a Workout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Workout Type</Label>
                  <Select value={selectedWorkout} onValueChange={setSelectedWorkout}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select workout type" />
                    </SelectTrigger>
                    <SelectContent>
                      {workoutTypes.map((type) => (
                        <SelectItem key={type.name} value={type.name}>
                          {type.name} ({type.calories} cal/min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                  />
                </div>

                {selectedWorkout && duration && (
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm font-medium">
                      Estimated calories: <span className="text-primary text-lg">{calculateCalories(selectedWorkout, parseInt(duration))}</span>
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleAddWorkout}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Adding..." : "Add Workout"}
                </Button>
              </CardContent>
            </Card>

            {recentWorkouts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Workouts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentWorkouts.map((workout) => (
                      <div key={workout.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Dumbbell className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{workout.workout_type}</p>
                            <p className="text-sm text-muted-foreground">
                              {workout.duration_minutes} min • {workout.calories_burned} cal
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(workout.workout_date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Exercises;
