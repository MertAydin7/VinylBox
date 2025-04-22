import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import AlbumGrid from "@/components/album/AlbumGrid";
import { useQuery } from "@tanstack/react-query";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; 
import { Grid, List, Loader2, XCircle } from "lucide-react";

const Albums: React.FC = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const queryParam = searchParams.get("q");
  
  // Filters
  const [sort, setSort] = useState<string>("popular");
  const [genre, setGenre] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Pagination
  const [page, setPage] = useState(1);
  
  // Get albums with filters
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "/api/albums", 
      { sort, genre: genre || undefined, year: year ? parseInt(year) : undefined, q: queryParam || undefined }
    ],
  });
  
  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [sort, genre, year, queryParam]);
  
  const albums = data || [];
  const hasMore = false; // In a real app, would check if there are more albums to load
  
  const loadMore = () => {
    setPage(prev => prev + 1);
  };
  
  const pageTitle = queryParam 
    ? `Search Results: "${queryParam}"` 
    : "Explore Albums";
  
  const [navigate] = useLocation();
  
  const clearSearch = () => {
    navigate("/albums");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="font-header text-2xl font-bold mb-6">{pageTitle}</h1>
      
      {queryParam && (
        <div className="mb-4 flex items-center">
          <Badge variant="outline" className="px-3 py-1 text-sm flex items-center gap-2">
            <span>Search: "{queryParam}"</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 rounded-full" 
              onClick={clearSearch}
            >
              <XCircle className="h-3.5 w-3.5" />
            </Button>
          </Badge>
          <span className="ml-2 text-sm text-muted-foreground">
            {albums.length} {albums.length === 1 ? 'result' : 'results'} found
          </span>
        </div>
      )}
      
      <Card className="p-4 shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sort by:</label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="bg-surfaceLight text-white w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="year">Release Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Genre:</label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="bg-surfaceLight text-white w-[140px]">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Genres</SelectItem>
                  <SelectItem value="Rock">Rock</SelectItem>
                  <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                  <SelectItem value="Electronic">Electronic</SelectItem>
                  <SelectItem value="R&B">R&B</SelectItem>
                  <SelectItem value="Pop">Pop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Year:</label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="bg-surfaceLight text-white w-[140px]">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Years</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2010">2010s</SelectItem>
                  <SelectItem value="2000">2000s</SelectItem>
                  <SelectItem value="1990">1990s</SelectItem>
                  <SelectItem value="1980">1980s</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={viewMode === "grid" ? "default" : "secondary"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "secondary"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No albums found</h2>
          <p className="text-muted-foreground">
            {queryParam 
              ? "Try searching with different keywords or browse our catalog" 
              : "Try adjusting your filters or check back later for new additions"}
          </p>
        </div>
      ) : (
        <AlbumGrid
          albums={albums}
          loading={isFetching}
          onLoadMore={loadMore}
          hasMore={hasMore}
        />
      )}
    </div>
  );
};

export default Albums;
