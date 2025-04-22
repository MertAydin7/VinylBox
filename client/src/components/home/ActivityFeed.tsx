import React from "react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import StarRating from "@/components/ui/star-rating";
import { useQuery } from "@tanstack/react-query";

// Simple Activity Feed Loading Skeleton
function ActivityFeedLoading() {
  return (
    <div className="space-y-6">
      <h2 className="font-header text-xl font-bold">Activity Feed</h2>
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="h-5 w-40 bg-muted rounded"></div>
                  <div className="h-4 w-10 bg-muted rounded"></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 bg-muted rounded"></div>
                  <div className="space-y-1">
                    <div className="h-5 w-32 bg-muted rounded"></div>
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-4 w-16 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-6 w-16 bg-muted rounded"></div>
                  <div className="h-6 w-16 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Simple Empty State Component
function ActivityFeedEmpty({ networkOnly }: { networkOnly?: boolean }) {
  return (
    <div className="space-y-6">
      <h2 className="font-header text-xl font-bold">Activity Feed</h2>
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No activity yet</p>
          {networkOnly && (
            <p className="mt-2 text-sm">
              Follow other users to see their ratings and reviews here
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Activity Card Component
function ActivityCard({ 
  activity, 
  user, 
  album 
}: { 
  activity: any; 
  user: any;
  album: any;
}) {
  const timestamp = activity.createdAt || new Date().toISOString();
  
  let activityType;
  if (activity.type === 'rating') {
    activityType = 'rated an album';
  } else if (activity.type === 'review') {
    activityType = 'reviewed an album';
  } else {
    activityType = 'added to favorites';
  }

  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Link href={`/profile/${user.username}`}>
            <div className="shrink-0">
              <Avatar className="w-10 h-10">
                <AvatarImage 
                  src={user.profileImage || undefined} 
                  alt={user.displayName || 'User'} 
                />
                <AvatarFallback>
                  {user.displayName ? user.displayName.charAt(0) : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </Link>
          
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <Link href={`/profile/${user.username}`}>
                  <span className="font-medium hover:underline">
                    {user.displayName}
                  </span>
                </Link>
                <span className="text-muted-foreground"> {activityType}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
              </span>
            </div>
            
            <div className="flex items-start gap-3">
              <Link href={`/albums/${album.id}`}>
                <div className="shrink-0">
                  <img 
                    src={album.coverImage} 
                    alt={album.title} 
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              </Link>
              
              <div>
                <Link href={`/albums/${album.id}`}>
                  <span className="font-medium hover:underline">{album.title}</span>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {album.artist} ({album.releaseYear})
                </p>
                {activity.rating && (
                  <StarRating rating={activity.rating} className="mt-1" />
                )}
              </div>
            </div>
            
            {activity.type === 'review' && (
              <Link href={`/albums/${album.id}`}>
                <span className="text-primary text-sm font-medium hover:underline">
                  Read review
                </span>
              </Link>
            )}
            
            <div className="flex gap-4 text-sm">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-primary"
              >
                <Heart className="mr-1.5 h-4 w-4" />
                <span>{activity.likeCount || 0}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-primary"
              >
                <MessageSquare className="mr-1.5 h-4 w-4" />
                <span>{activity.commentCount || 0}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Activity Feed Component
function ActivityFeed({ networkOnly = false }: { networkOnly?: boolean }) {
  // Queries
  const feedQuery = useQuery({
    queryKey: [networkOnly ? "/api/feed/network" : "/api/feed"],
  });
  
  const userQuery = useQuery({
    queryKey: ["/api/users/me"],
  });
  
  const albumsQuery = useQuery({
    queryKey: ["/api/albums/popular"],
  });
  
  // Handle loading state
  if (feedQuery.isLoading || userQuery.isLoading || albumsQuery.isLoading) {
    return <ActivityFeedLoading />;
  }
  
  // Handle error state
  if (feedQuery.isError || userQuery.isError || albumsQuery.isError) {
    return (
      <div className="space-y-6">
        <h2 className="font-header text-xl font-bold">Activity Feed</h2>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Error loading activity feed</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Handle empty activities
  const activities = feedQuery.data || [];
  if (!activities || activities.length === 0) {
    return <ActivityFeedEmpty networkOnly={networkOnly} />;
  }
  
  // Get user and albums data
  const user = userQuery.data;
  const albums = albumsQuery.data || [];
  
  // Create albums lookup map
  const albumsMap: Record<number, any> = {};
  for (const album of albums) {
    if (album && album.id) {
      albumsMap[album.id] = album;
    }
  }
  
  return (
    <div className="space-y-6">
      <h2 className="font-header text-xl font-bold">Activity Feed</h2>
      
      {activities.map((activity: any) => {
        // Check if we have all the data we need
        const album = activity.albumId ? albumsMap[activity.albumId] : null;
        if (!album || !user) return null;
        
        return (
          <ActivityCard 
            key={`${activity.type}-${activity.id}`}
            activity={activity}
            user={user}
            album={album}
          />
        );
      })}
      
      <div className="text-center pt-4">
        <Button variant="link" className="text-primary">Load more</Button>
      </div>
    </div>
  );
}

export default ActivityFeed;