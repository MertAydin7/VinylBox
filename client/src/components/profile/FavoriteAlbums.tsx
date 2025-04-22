import React from "react";
import { AlbumWithRating } from "@shared/schema";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/star-rating";
import { Link } from "wouter";

interface FavoriteAlbumsProps {
  albums: AlbumWithRating[];
  isCurrentUser: boolean;
  onEdit?: () => void;
}

const FavoriteAlbums: React.FC<FavoriteAlbumsProps> = ({ 
  albums = [], 
  isCurrentUser,
  onEdit 
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-header text-xl font-bold">Favorite Albums</h2>
        {isCurrentUser && (
          <Button variant="link" className="text-primary" onClick={onEdit}>
            Edit
          </Button>
        )}
      </div>
      
      {albums.length === 0 ? (
        <div className="text-center py-8 bg-surface rounded-lg">
          <p className="text-muted-foreground">
            {isCurrentUser 
              ? "You haven't added any favorite albums yet." 
              : "This user hasn't added any favorite albums yet."}
          </p>
          {isCurrentUser && (
            <Button 
              variant="default" 
              className="mt-4"
              onClick={onEdit}
            >
              Add Favorite Albums
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albums.map((album) => (
            <div key={album.id} className="group relative album-poster">
              <Link href={`/albums/${album.id}`}>
                <a>
                  <img 
                    src={album.coverImage} 
                    alt={album.title} 
                    className="w-full aspect-square object-cover rounded"
                  />
                </a>
              </Link>
              <div className="album-info absolute inset-0 bg-black/70 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                <h3 className="font-medium text-white line-clamp-1">{album.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {album.artist} ({album.releaseYear})
                </p>
                <StarRating 
                  rating={album.userRating || album.averageRating || 0} 
                  className="mt-1"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteAlbums;
