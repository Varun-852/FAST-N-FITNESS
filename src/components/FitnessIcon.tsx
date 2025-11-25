import { Dumbbell } from "lucide-react";

interface FitnessIconProps {
  size?: number;
  className?: string;
}

export const FitnessIcon = ({ size = 64, className = "" }: FitnessIconProps) => {
  return (
    <div className={`bg-primary rounded-2xl p-4 shadow-xl ${className}`}>
      <Dumbbell size={size} className="text-primary-foreground" strokeWidth={2.5} />
    </div>
  );
};
