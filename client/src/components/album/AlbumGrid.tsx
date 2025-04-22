import React from "react";
import { AlbumWithRating } from "@shared/schema";
import AlbumCard from "./AlbumCard";
import { Button } from "@/components/ui/button";

interface AlbumGridProps {
  albums: AlbumWithRating[];
  title?: string;
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const AlbumGrid: React.FC<AlbumGridProps> = ({
  albums,
  title,
  loading = false,
  onLoadMore,
  hasMore = false,
}) => {
  return (
    <div>
      {title && <h2 className="font-header text-xl font-bold mb-4">{title}</h2>}
      
      {loading && albums.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="w-full aspect-square bg-surfaceLight animate-pulse rounded"></div>
              <div className="h-5 bg-surfaceLight animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-surfaceLight animate-pulse rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
          
          {onLoadMore && (
            <div className="text-center pt-8">
              <Button
                onClick={onLoadMore}
                disabled={loading || !hasMore}
                className="px-6"
              >
                {loading ? "Loading..." : "Load More Albums"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlbumGrid;
