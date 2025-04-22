import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface RatingDistributionProps {
  distribution: {
    [key: string]: number;
  };
  totalRatings: number;
}

const RatingDistribution: React.FC<RatingDistributionProps> = ({ 
  distribution,
  totalRatings
}) => {
  // Create ordered rating buckets
  const ratingBuckets = [
    { label: "5★", rating: 5 },
    { label: "4.5★", rating: 4.5 },
    { label: "4★", rating: 4 },
    { label: "3.5★", rating: 3.5 },
    { label: "3★", rating: 3 },
    { label: "2.5★", rating: 2.5 },
    { label: "2★", rating: 2 },
    { label: "1.5★", rating: 1.5 },
    { label: "1★", rating: 1 },
    { label: "0.5★", rating: 0.5 },
  ];
  
  // Calculate percentages
  const getBucketPercentage = (rating: number) => {
    if (totalRatings === 0) return 0;
    const count = distribution[rating] || 0;
    return Math.round((count / totalRatings) * 100);
  };
  
  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <h3 className="font-header text-lg font-bold mb-3">Rating Distribution</h3>
        
        {totalRatings === 0 ? (
          <p className="text-center text-muted-foreground py-2">
            No ratings yet
          </p>
        ) : (
          <div className="space-y-2">
            {ratingBuckets.map((bucket) => {
              const percentage = getBucketPercentage(bucket.rating);
              return (
                <div key={bucket.rating} className="flex items-center gap-2">
                  <div className="w-8 text-right text-sm font-medium">{bucket.label}</div>
                  <div className="flex-1 h-5 bg-surfaceLight rounded-sm overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-right text-sm text-muted-foreground">{percentage}%</div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingDistribution;
