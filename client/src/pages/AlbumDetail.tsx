import React, { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Plus, Share2 } from "lucide-react";
import StarRating from "@/components/ui/star-rating";
import TrackList from "@/components/album/TrackList";
import ReviewList from "@/components/album/ReviewList";
import RatingDistribution from "@/components/album/RatingDistribution";
import RatingDialog from "@/components/dialogs/RatingDialog";
import { Skeleton } from "@/components/ui/skeleton";

const AlbumDetail: React.FC = () => {
  const { id } = useParams();
  const albumId = parseInt(id);
  
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  
  // Fetch album details
  const { data: album, isLoading: loadingAlbum } = useQuery({
    queryKey: [`/api/albums/${albumId}`],
    enabled: !isNaN(albumId),
  });
  
  // Fetch album reviews
  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: [`/api/albums/${albumId}/reviews`],
    enabled: !isNaN(albumId),
  });
  
  if (isNaN(albumId)) {
    return <div className="container mx-auto px-4 py-12 text-center">Invalid album ID</div>;
  }
  
  if (loadingAlbum) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="overflow-hidden mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="w-40 md:w-60 aspect-square rounded shadow-lg" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-9 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="pt-3">
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="pt-3 flex flex-wrap gap-3">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!album) {
    return <div className="container mx-auto px-4 py-12 text-center">Album not found</div>;
  }
  
  const ratingDistribution = album.ratingDistribution || {};
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Album Header */}
      <Card className="overflow-hidden mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="shrink-0">
              <img 
                src={album.coverImage} 
                alt={album.title} 
                className="w-40 md:w-60 aspect-square object-cover rounded shadow-lg" 
              />
            </div>
            <div className="flex-1 space-y-3">
              <h1 className="font-header text-3xl font-bold">{album.title}</h1>
              <p className="text-2xl text-muted-foreground">{album.artist}</p>
              <div className="text-muted-foreground">
                <p>Released: {album.releaseYear}</p>
                {album.genre && <p>Genre: {album.genre}</p>}
                {album.label && <p>Label: {album.label}</p>}
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <div>
                  <span className="text-2xl font-bold text-primary">
                    {album.avgRating?.toFixed(1) || "—"}
                  </span>
                  <span className="text-muted-foreground text-sm">/5</span>
                </div>
                <StarRating rating={album.avgRating || 0} size="lg" />
                <div className="text-muted-foreground text-sm">
                  ({album.ratingCount || 0} ratings)
                </div>
              </div>
              
              <div className="pt-3 flex flex-wrap gap-3">
                <Button 
                  onClick={() => setShowRatingDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  <span>Rate or Review</span>
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to List</span>
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tracks and Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Track List */}
          <TrackList 
            tracks={album.tracks || []}
            showAll={showAllTracks}
            onShowAllClick={() => setShowAllTracks(true)}
          />
          
          {/* Reviews */}
          <ReviewList 
            reviews={reviews || []}
            loading={loadingReviews}
            onWriteReviewClick={() => setShowRatingDialog(true)}
          />
        </div>
        
        <div className="space-y-6">
          {/* Rating Distribution */}
          <RatingDistribution 
            distribution={ratingDistribution}
            totalRatings={album.ratingCount || 0}
          />
          
          {/* More from Artist */}
          <Card className="shadow-md">
            <CardContent className="p-4">
              <h3 className="font-header text-lg font-bold mb-3">More From {album.artist}</h3>
              <p className="text-center text-muted-foreground py-2">
                Coming soon
              </p>
            </CardContent>
          </Card>
          
          {/* Fans Also Like */}
          <Card className="shadow-md">
            <CardContent className="p-4">
              <h3 className="font-header text-lg font-bold mb-3">Fans Also Like</h3>
              <p className="text-center text-muted-foreground py-2">
                Coming soon
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Rating Dialog */}
      <RatingDialog 
        album={album}
        open={showRatingDialog}
        currentRating={album.userRating || 0}
        onOpenChange={setShowRatingDialog}
      />
    </div>
  );
};

export default AlbumDetail;
