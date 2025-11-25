import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FitnessIcon } from "@/components/FitnessIcon";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <FitnessIcon size={80} className="mx-auto shadow-2xl" />
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground">
            Fast N Fitness
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-xl mx-auto">
            Welcome to Fast N Fitness. A quick and simple way to record your program and follow your body and exercise progression.
          </p>
        </div>

        <Button 
          size="lg"
          variant="secondary"
          onClick={() => navigate('/auth')}
          className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
