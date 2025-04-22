import React, { useState } from "react";
import { Link } from "wouter";
import { AlbumWithRating } from "@shared/schema";
import StarRating from "@/components/ui/star-rating";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlbumCardProps {
  album: AlbumWithRating;
  showRating?: boolean;
  withFavoriteButton?: boolean;
  onFavoriteClick?: () => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  showRating = true,
  withFavoriteButton = false,
  onFavoriteClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="space-y-2">
      <div 
        className="group relative album-poster"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/albums/${album.id}`}>
          <a>
            <img 
              src={album.coverImage} 
              alt={`${album.title} by ${album.artist}`} 
              className="w-full aspect-square object-cover rounded"
            />
          </a>
        </Link>
        
        {/* Hover overlay */}
        <div 
          className={`album-info absolute inset-0 bg-black/70 flex flex-col justify-end p-3 
            rounded transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex justify-between items-center w-full">
            {showRating && (
              <StarRating 
                rating={album.userRating || album.averageRating || 0} 
                size="sm"
              />
            )}
            
            {withFavoriteButton && (
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-7 w-7 text-sm bg-surfaceLight hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onFavoriteClick?.();
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <Link href={`/albums/${album.id}`}>
          <a className="font-medium hover:underline line-clamp-1">
            {album.title}
          </a>
        </Link>
        <p className="text-sm text-muted-foreground">
          {album.artist} ({album.releaseYear})
        </p>
      </div>
    </div>
  );
};

export default AlbumCard;
