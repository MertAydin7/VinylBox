import React from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const PeopleToFollow = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["/api/users/suggested"],
  });
  
  const { toast } = useToast();
  
  const followMutation = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest("POST", "/api/follows", { followerId: 1, followedId: userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/suggested"] });
      toast({
        title: "Success",
        description: "You're now following this user",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to follow user",
        variant: "destructive",
      });
    },
  });
  
  const handleFollow = (userId: number) => {
    followMutation.mutate(userId);
  };
  
  return (
    <div>
      <h2 className="font-header text-xl font-bold mb-4">People to Follow</h2>
      <Card className="shadow-md">
        <CardContent className="p-4">
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surfaceLight rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-5 bg-surfaceLight rounded w-24"></div>
                      <div className="h-3 bg-surfaceLight rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-surfaceLight rounded"></div>
                </div>
              ))
            ) : suggestedUsers && suggestedUsers.length > 0 ? (
              // Actual content
              suggestedUsers.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link href={`/profile/${user.username}`}>
                      <a className="shrink-0">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.profileImage} alt={user.displayName} />
                          <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </a>
                    </Link>
                    <div>
                      <Link href={`/profile/${user.username}`}>
                        <a className="font-medium hover:underline">{user.displayName}</a>
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {user.reviewCount || 0} reviews
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => handleFollow(user.id)}
                    disabled={followMutation.isPending}
                  >
                    Follow
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-2">No suggestions available</p>
            )}
            
            <Link href="/members">
              <a className="block text-center text-sm text-primary font-medium hover:underline pt-2">
                Find more people to follow
              </a>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeopleToFollow;
