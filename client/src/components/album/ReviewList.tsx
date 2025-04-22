import React from "react";
import { ReviewWithUser } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReviewCard from "@/components/review/ReviewCard";

interface ReviewListProps {
  reviews: ReviewWithUser[];
  title?: string;
  showWriteReviewButton?: boolean;
  onWriteReviewClick?: () => void;
  loading?: boolean;
  limitInitial?: boolean;
  onLoadMore?: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews = [],
  title = "Popular Reviews",
  showWriteReviewButton = true,
  onWriteReviewClick,
  loading = false,
  limitInitial = true,
  onLoadMore
}) => {
  // Show only first 2 reviews initially if limited
  const displayedReviews = limitInitial ? reviews.slice(0, 2) : reviews;
  const hasMoreReviews = limitInitial && reviews.length > 2;
  
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-header text-xl font-bold">{title}</h2>
          {showWriteReviewButton && (
            <div className="h-8 w-24 bg-surfaceLight rounded animate-pulse"></div>
          )}
        </div>
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="animate-pulse p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-surfaceLight"></div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <div className="h-6 w-32 bg-surfaceLight rounded"></div>
                    <div className="h-4 w-20 bg-surfaceLight rounded"></div>
                  </div>
                  <div className="h-4 w-24 bg-surfaceLight rounded"></div>
                  <div className="h-20 bg-surfaceLight rounded"></div>
                  <div className="flex gap-4">
                    <div className="h-6 w-16 bg-surfaceLight rounded"></div>
                    <div className="h-6 w-16 bg-surfaceLight rounded"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-header text-xl font-bold">{title}</h2>
        {showWriteReviewButton && (
          <Button variant="link" className="text-primary text-sm" onClick={onWriteReviewClick}>
            Write a Review
          </Button>
        )}
      </div>
      
      {reviews.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No reviews yet</p>
          {showWriteReviewButton && (
            <Button 
              className="mt-4"
              onClick={onWriteReviewClick}
            >
              Be the first to review
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          
          {hasMoreReviews && (
            <div className="text-center pt-2">
              <Button 
                variant="link" 
                className="text-primary font-medium hover:underline"
                onClick={onLoadMore}
              >
                View all {reviews.length} reviews
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
