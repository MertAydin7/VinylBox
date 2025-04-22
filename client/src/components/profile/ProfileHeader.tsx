import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserProfile } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface ProfileHeaderProps {
  profile: UserProfile;
  isCurrentUser: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isCurrentUser }) => {
  const { toast } = useToast();
  
  const followMutation = useMutation({
    mutationFn: async () => {
      if (profile.isFollowing) {
        await apiRequest("DELETE", `/api/follows/${profile.id}`);
      } else {
        await apiRequest("POST", "/api/follows", { followerId: 1, followedId: profile.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${profile.id}`] });
      toast({
        title: profile.isFollowing ? "Unfollowed" : "Now following",
        description: profile.isFollowing 
          ? `You've unfollowed ${profile.displayName}`
          : `You're now following ${profile.displayName}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    }
  });
  
  const handleFollowClick = () => {
    followMutation.mutate();
  };
  
  const joinedDate = profile.createdAt 
    ? new Date(profile.createdAt) 
    : new Date();
    
  const joinedText = `Joined ${formatDistanceToNow(joinedDate, { addSuffix: true })}`;
  
  return (
    <Card className="overflow-hidden mb-6">
      <div className="h-40 bg-gradient-to-r from-surfaceLight to-primary/30 relative"></div>
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background">
            <AvatarImage src={profile.profileImage} alt={profile.displayName} />
            <AvatarFallback className="text-3xl">{profile.displayName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h1 className="font-header text-2xl font-bold">{profile.displayName}</h1>
                <p className="text-muted-foreground">
                  @{profile.username} • {joinedText}
                </p>
              </div>
              <div className="flex gap-3">
                {isCurrentUser ? (
                  <Button>Edit Profile</Button>
                ) : (
                  <Button 
                    variant={profile.isFollowing ? "secondary" : "default"}
                    onClick={handleFollowClick}
                    disabled={followMutation.isPending}
                  >
                    {profile.isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
                <Button variant="secondary">Share</Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex items-center gap-8">
          <div className="text-center">
            <div className="text-xl font-medium">{profile.albumCount || 0}</div>
            <div className="text-sm text-muted-foreground">Albums</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-medium">{profile.reviewCount || 0}</div>
            <div className="text-sm text-muted-foreground">Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-medium">{profile.followingCount || 0}</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-medium">{profile.followerCount || 0}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </div>
        </div>
        
        {profile.bio && (
          <div className="mt-6 text-muted-foreground">
            <p>{profile.bio}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileHeader;
