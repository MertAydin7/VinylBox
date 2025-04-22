import React, { useState } from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  precision?: 0.5 | 1;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  maxRating = 5,
  precision = 0.5,
  size = "md",
  interactive = false,
  onChange,
  className,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  const sizeClass = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };
  
  const activeRating = hoverRating !== null ? hoverRating : rating;
  
  const renderStar = (index: number) => {
    const value = index + 1;
    const isActive = activeRating >= value;
    const isHalfActive = !isActive && activeRating >= value - 0.5 && precision === 0.5;
    
    return (
      <div 
        key={index}
        className={cn(
          "cursor-default flex items-center justify-center",
          interactive && "cursor-pointer",
        )}
        onClick={() => {
          if (interactive && onChange) {
            // Toggle between full, half, and zero based on precision
            if (precision === 0.5) {
              if (rating === value) onChange(value - 1);
              else if (rating === value - 0.5) onChange(value);
              else onChange(value - 0.5);
            } else {
              if (rating === value) onChange(0);
              else onChange(value);
            }
          }
        }}
        onMouseEnter={() => {
          if (interactive) {
            if (precision === 0.5) {
              setHoverRating(value - 0.5);
            } else {
              setHoverRating(value);
            }
          }
        }}
        onMouseMove={(e) => {
          if (interactive && precision === 0.5) {
            const rect = e.currentTarget.getBoundingClientRect();
            const halfWidth = rect.width / 2;
            const mouseX = e.clientX - rect.left;
            
            if (mouseX <= halfWidth) {
              setHoverRating(value - 0.5);
            } else {
              setHoverRating(value);
            }
          }
        }}
        onMouseLeave={() => {
          if (interactive) {
            setHoverRating(null);
          }
        }}
      >
        {isActive ? (
          <Star 
            className={cn(
              sizeClass[size], 
              "fill-primary text-primary"
            )} 
          />
        ) : isHalfActive ? (
          <div className="relative">
            <Star className={cn(sizeClass[size], "text-muted")} />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className={cn(sizeClass[size], "fill-primary text-primary")} />
            </div>
          </div>
        ) : (
          <Star className={cn(sizeClass[size], "text-muted")} />
        )}
      </div>
    );
  };
  
  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: maxRating }).map((_, index) => renderStar(index))}
    </div>
  );
};

export default StarRating;
