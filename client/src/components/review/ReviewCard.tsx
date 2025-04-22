import React from "react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import StarRating from "@/components/ui/star-rating";
import { ReviewWithUser } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ReviewCardProps {
  review: ReviewWithUser;
  showAlbum?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, showAlbum = false }) => {
  const { toast } = useToast();
  
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (review.userLiked) {
        await apiRequest("DELETE", `/api/likes/${review.id}`);
      } else {
        await apiRequest("POST", "/api/likes", { userId: 1, reviewId: review.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/albums/${review.albumId}/reviews`] });
      toast({
        title: review.userLiked ? "Like removed" : "Review liked",
        description: review.userLiked 
          ? "You've removed your like from this review"
          : "You've liked this review",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  });
  
  const handleLikeClick = () => {
    likeMutation.mutate();
  };
  
  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Link href={`/profile/${review.user.username}`}>
            <a className="shrink-0">
              <Avatar className="w-10 h-10">
                <AvatarImage src={review.user.profileImage} alt={review.user.displayName} />
                <AvatarFallback>{review.user.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
            </a>
          </Link>
          
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <Link href={`/profile/${review.user.username}`}>
                  <a className="font-medium hover:underline">{review.user.displayName}</a>
                </Link>
                <div className="flex mt-1">
                  <StarRating rating={review.rating} size="sm" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </span>
            </div>
            
            {showAlbum && review.album && (
              <div className="flex items-start gap-3">
                <Link href={`/albums/${review.album.id}`}>
                  <a className="shrink-0">
                    <img 
                      src={review.album.coverImage} 
                      alt={review.album.title} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  </a>
                </Link>
                
                <div>
                  <Link href={`/albums/${review.album.id}`}>
                    <a className="font-medium hover:underline">{review.album.title}</a>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {review.album.artist} ({review.album.releaseYear})
                  </p>
                </div>
              </div>
            )}
            
            <p className={review.content && review.content.length > 300 ? "line-clamp-4" : ""}>
              {review.content}
            </p>
            
            {review.content && review.content.length > 300 && (
              <Link href={`/reviews/${review.id}`}>
                <a className="text-primary text-sm font-medium hover:underline">Read full review</a>
              </Link>
            )}
            
            <div className="flex gap-4 text-sm">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`${review.userLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                onClick={handleLikeClick}
                disabled={likeMutation.isPending}
              >
                <Heart className={`mr-1.5 h-4 w-4 ${review.userLiked ? 'fill-primary' : ''}`} />
                <span>{review.likeCount || 0}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-primary"
                onClick={() => {
                  // Handle comment action
                }}
              >
                <MessageSquare className="mr-1.5 h-4 w-4" />
                <span>{review.commentCount || 0}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
