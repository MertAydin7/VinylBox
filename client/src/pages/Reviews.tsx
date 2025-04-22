import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReviewCard from "@/components/review/ReviewCard";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const Reviews: React.FC = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [sort, setSort] = useState("recent");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  
  // Query for recent reviews
  const { data: recentReviews, isLoading: loadingRecent } = useQuery({
    queryKey: ["/api/reviews/recent"],
    enabled: activeTab === "recent",
  });
  
  // Query for popular reviews
  const { data: popularReviews, isLoading: loadingPopular } = useQuery({
    queryKey: ["/api/reviews/popular"],
    enabled: activeTab === "popular",
  });
  
  // Query for network reviews (from followed users)
  const { data: networkReviews, isLoading: loadingNetwork } = useQuery({
    queryKey: ["/api/reviews/network"],
    enabled: activeTab === "network",
  });
  
  const isLoading = 
    (activeTab === "recent" && loadingRecent) ||
    (activeTab === "popular" && loadingPopular) ||
    (activeTab === "network" && loadingNetwork);
  
  const reviews = activeTab === "recent" 
    ? recentReviews 
    : activeTab === "popular" 
      ? popularReviews 
      : networkReviews;
  
  const loadMore = () => {
    setPage(prev => prev + 1);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="font-header text-2xl font-bold">Album Reviews</h1>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Sort:</label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="bg-surfaceLight text-white w-[120px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Genre:</label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="bg-surfaceLight text-white w-[120px]">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Genres</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="hip-hop">Hip Hop</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="r&b">R&B</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent w-full justify-start overflow-x-auto no-scrollbar border-b border-surfaceLight">
          <TabsTrigger 
            value="recent" 
            className="font-condensed py-3 px-5 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold text-muted-foreground data-[state=active]:bg-transparent rounded-none"
          >
            RECENT REVIEWS
          </TabsTrigger>
          <TabsTrigger 
            value="popular" 
            className="font-condensed py-3 px-5 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold text-muted-foreground data-[state=active]:bg-transparent rounded-none"
          >
            POPULAR REVIEWS
          </TabsTrigger>
          <TabsTrigger 
            value="network" 
            className="font-condensed py-3 px-5 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold text-muted-foreground data-[state=active]:bg-transparent rounded-none"
          >
            FROM YOUR NETWORK
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6 pt-0 border-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No reviews found</h2>
              <p className="text-muted-foreground">
                {activeTab === "network" 
                  ? "Follow some users to see their reviews here" 
                  : "Be the first to write a review"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review: any) => (
                <ReviewCard key={review.id} review={review} showAlbum={true} />
              ))}
              
              <div className="text-center pt-4">
                <Button onClick={loadMore} disabled={isLoading}>
                  Load more
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reviews;
