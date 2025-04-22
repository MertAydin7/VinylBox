import React, { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ProfileHeader from "@/components/profile/ProfileHeader";
import FavoriteAlbums from "@/components/profile/FavoriteAlbums";
import ActivityFeed from "@/components/home/ActivityFeed";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import AlbumGrid from "@/components/album/AlbumGrid";
import ReviewList from "@/components/album/ReviewList";

const Profile: React.FC = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [editingFavorites, setEditingFavorites] = useState(false);
  
  // Use 'me' for current user, otherwise fetch specified user
  const isCurrentUser = username === 'me';
  
  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: [isCurrentUser ? "/api/users/me" : `/api/users/${username}`],
  });
  
  // Fetch user's albums (ratings)
  const { data: userAlbums, isLoading: loadingAlbums } = useQuery({
    queryKey: [isCurrentUser ? "/api/users/me/albums" : `/api/users/${username}/albums`],
    enabled: activeTab === "albums",
  });
  
  // Fetch user's reviews
  const { data: userReviews, isLoading: loadingReviews } = useQuery({
    queryKey: [isCurrentUser ? "/api/users/me/reviews" : `/api/users/${username}/reviews`],
    enabled: activeTab === "reviews",
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">User not found</h2>
        <p className="text-muted-foreground mb-6">The user you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <ProfileHeader 
        profile={profile} 
        isCurrentUser={isCurrentUser}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-transparent w-full justify-start overflow-x-auto no-scrollbar border-b border-surfaceLight">
          <TabsTrigger 
            value="profile" 
            className="font-condensed py-3 px-5 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold text-muted-foreground data-[state=active]:bg-transparent rounded-none"
          >
            PROFILE
          </TabsTrigger>
          <TabsTrigger 
            value="albums" 
            className="font-condensed py-3 px-5 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold text-muted-foreground data-[state=active]:bg-transparent rounded-none"
          >
            ALBUMS
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="font-condensed py-3 px-5 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold text-muted-foreground data-[state=active]:bg-transparent rounded-none"
          >
            REVIEWS
          </TabsTrigger>
          <TabsTrigger 
            value="lists" 
            className="font-condensed py-3 px-5 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold text-muted-foreground data-[state=active]:bg-transparent rounded-none"
          >
            LISTS
          </TabsTrigger>
          <TabsTrigger 
            value="likes" 
            className="font-condensed py-3 px-5 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold text-muted-foreground data-[state=active]:bg-transparent rounded-none"
          >
            LIKES
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6 pt-0 border-0">
          <FavoriteAlbums 
            albums={profile.favoriteAlbums || []}
            isCurrentUser={isCurrentUser}
            onEdit={() => setEditingFavorites(true)}
          />
          
          <h2 className="font-header text-xl font-bold mb-4">Recent Activity</h2>
          <ActivityFeed />
        </TabsContent>
        
        <TabsContent value="albums" className="mt-6 pt-0 border-0">
          <AlbumGrid 
            albums={userAlbums || []}
            title="Rated Albums"
            loading={loadingAlbums}
          />
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6 pt-0 border-0">
          <ReviewList 
            reviews={userReviews || []}
            title="Reviews"
            loading={loadingReviews}
            limitInitial={false}
            showWriteReviewButton={false}
          />
        </TabsContent>
        
        <TabsContent value="lists" className="mt-6 pt-0 border-0">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Lists Coming Soon</h2>
            <p className="text-muted-foreground">
              This feature is currently under development
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="likes" className="mt-6 pt-0 border-0">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Likes Coming Soon</h2>
            <p className="text-muted-foreground">
              This feature is currently under development
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Edit Favorites Dialog */}
      <Dialog open={editingFavorites} onOpenChange={setEditingFavorites}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Favorite Albums</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Coming soon: You'll be able to edit your top 5 favorite albums here
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => setEditingFavorites(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
