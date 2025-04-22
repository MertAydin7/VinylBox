import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Search, Loader2 } from "lucide-react";

const Members: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { toast } = useToast();
  
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["/api/users/suggested", { limit: 12 }],
  });
  
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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to follow user",
        variant: "destructive",
      });
    },
  });
  
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // In a real app, would call an API to search users
      setSearchResults([]);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleFollow = (userId: number) => {
    followMutation.mutate(userId);
  };
  
  // Decide which users to display
  const displayUsers = searchQuery.trim() ? searchResults : suggestedUsers || [];
  const isLoaded = !isLoading && !isSearching;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="font-header text-2xl font-bold">Community Members</h1>
        
        <form onSubmit={handleSearchSubmit} className="w-full md:w-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-surfaceLight text-white md:w-64 pl-10"
            />
            <button 
              type="submit" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              disabled={isSearching}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>
      </div>
      
      {isLoading || isSearching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-surfaceLight rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-5 bg-surfaceLight rounded w-32"></div>
                      <div className="h-4 bg-surfaceLight rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-9 w-20 bg-surfaceLight rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : displayUsers.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-2">
            {searchQuery.trim() 
              ? `No members found matching "${searchQuery}"` 
              : "No suggested members at this time"}
          </p>
          {searchQuery.trim() && (
            <Button 
              variant="link" 
              onClick={() => setSearchQuery("")}
              className="text-primary"
            >
              Clear search
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayUsers.map((user: any) => (
            <Card key={user.id} className="shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link href={`/profile/${user.username}`}>
                      <a>
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.profileImage} alt={user.displayName} />
                          <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                      </a>
                    </Link>
                    <div>
                      <Link href={`/profile/${user.username}`}>
                        <a className="font-medium hover:underline">
                          {user.displayName}
                        </a>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        @{user.username} • {user.reviewCount || 0} reviews
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={user.isFollowing ? "secondary" : "default"}
                    size="sm"
                    onClick={() => handleFollow(user.id)}
                    disabled={followMutation.isPending}
                  >
                    {user.isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Members;
