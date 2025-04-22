import React from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const PopularAlbums = () => {
  const { data: albums, isLoading } = useQuery({
    queryKey: ["/api/albums/popular"],
  });
  
  return (
    <div>
      <h2 className="font-header text-xl font-bold mb-4">Popular Right Now</h2>
      <Card className="shadow-md">
        <CardContent className="p-4">
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 animate-pulse">
                  <div className="w-14 h-14 bg-surfaceLight rounded"></div>
                  <div className="space-y-1 flex-1">
                    <div className="h-5 bg-surfaceLight rounded w-3/4"></div>
                    <div className="h-4 bg-surfaceLight rounded w-1/2"></div>
                    <div className="h-3 bg-surfaceLight rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : albums && albums.length > 0 ? (
              // Actual content
              albums.map((album: any) => (
                <div key={album.id} className="flex items-center gap-3">
                  <Link href={`/albums/${album.id}`}>
                    <span className="shrink-0 cursor-pointer block">
                      <img 
                        src={album.coverImage} 
                        alt={album.title} 
                        className="w-14 h-14 object-cover rounded"
                      />
                    </span>
                  </Link>
                  <div>
                    <Link href={`/albums/${album.id}`}>
                      <span className="font-medium hover:underline line-clamp-1 cursor-pointer block">{album.title}</span>
                    </Link>
                    <p className="text-sm text-muted-foreground">{album.artist}</p>
                    <div className="text-xs text-muted-foreground">
                      <span>{album.averageRating?.toFixed(1) || 'No'} ★</span>
                      {album.ratingCount > 0 && (
                        <span> · {album.ratingCount} ratings this week</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-2">No popular albums found</p>
            )}
            
            <Link href="/albums?sort=popular">
              <span className="block text-center text-sm text-primary font-medium hover:underline pt-2 cursor-pointer">
                View all popular albums
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PopularAlbums;
