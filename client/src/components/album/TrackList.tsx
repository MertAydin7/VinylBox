import React from "react";
import { Track } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface TrackListProps {
  tracks: Track[];
  showAll?: boolean;
  onShowAllClick?: () => void;
}

const TrackList: React.FC<TrackListProps> = ({ 
  tracks = [], 
  showAll = false,
  onShowAllClick
}) => {
  // Show only 5 tracks if not showing all
  const displayedTracks = showAll ? tracks : tracks.slice(0, 5);
  const hasMoreTracks = !showAll && tracks.length > 5;
  
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <h2 className="font-header text-xl font-bold mb-4">Tracks</h2>
        
        {tracks.length === 0 ? (
          <p className="text-center text-muted-foreground py-2">
            No tracks available for this album
          </p>
        ) : (
          <div className="space-y-3">
            {displayedTracks.map((track) => (
              <div 
                key={track.id}
                className="flex items-center py-2 hover:bg-surfaceLight rounded px-2 transition-colors"
              >
                <div className="w-8 text-center text-muted-foreground">
                  {track.trackNumber || '-'}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{track.title}</div>
                  <div className="text-sm text-muted-foreground">{track.duration || '--:--'}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {hasMoreTracks && (
              <Button 
                variant="link" 
                className="w-full text-center text-primary hover:underline py-2"
                onClick={onShowAllClick}
              >
                Show all {tracks.length} tracks
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackList;
