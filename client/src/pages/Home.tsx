import React, { useState } from "react";
import ActivityFeed from "@/components/home/ActivityFeed";
import PopularAlbums from "@/components/home/PopularAlbums";
import PeopleToFollow from "@/components/home/PeopleToFollow";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import AlbumGrid from "@/components/album/AlbumGrid";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState("recent");
  
  const { data: recentAlbums, isLoading: loadingRecent } = useQuery({
    queryKey: ["/api/albums/recent"],
    enabled: activeTab === "new-releases",
  });
  
  const { data: popularAlbums, isLoading: loadingPopular } = useQuery({
    queryKey: ["/api/albums/popular"],
    enabled: activeTab === "popular",
  });
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-surface border-b border-surfaceLight mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent w-full justify-start overflow-x-auto no-scrollbar border-none">
            <TabsTrigger 
              value="recent" 
              className="font-condensed py-4 px-6 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold text-muted-foreground data-[state=active]:bg-transparent"
            >
              RECENT ACTIVITY
            </TabsTrigger>
            <TabsTrigger 
              value="popular" 
              className="font-condensed py-4 px-6 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold text-muted-foreground data-[state=active]:bg-transparent"
            >
              POPULAR ALBUMS
            </TabsTrigger>
            <TabsTrigger 
              value="new-releases" 
              className="font-condensed py-4 px-6 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold text-muted-foreground data-[state=active]:bg-transparent"
            >
              NEW RELEASES
            </TabsTrigger>
            <TabsTrigger 
              value="network" 
              className="font-condensed py-4 px-6 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold text-muted-foreground data-[state=active]:bg-transparent"
            >
              YOUR NETWORK
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="mt-6 pt-0 border-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ActivityFeed />
              </div>
              <div className="space-y-6">
                <PopularAlbums />
                <PeopleToFollow />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="popular" className="mt-6 pt-0 border-0">
            <AlbumGrid
              albums={popularAlbums || []}
              title="Popular Albums"
              loading={loadingPopular}
            />
          </TabsContent>

          <TabsContent value="new-releases" className="mt-6 pt-0 border-0">
            <AlbumGrid
              albums={recentAlbums || []}
              title="New Releases"
              loading={loadingRecent}
            />
          </TabsContent>

          <TabsContent value="network" className="mt-6 pt-0 border-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ActivityFeed networkOnly={true} />
              </div>
              <div className="space-y-6">
                <PeopleToFollow />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
