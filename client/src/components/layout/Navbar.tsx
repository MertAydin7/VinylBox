import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ["/api/users/me"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/albums?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleMobileSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className="bg-background border-b border-surfaceLight sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <span className="font-header font-bold text-2xl text-primary cursor-pointer">Vinylbox</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/">
                <span className="font-condensed text-primary hover:text-primary transition cursor-pointer">HOME</span>
              </Link>
              <Link href="/albums">
                <span className="font-condensed text-white hover:text-primary transition cursor-pointer">ALBUMS</span>
              </Link>
              <Link href="/reviews">
                <span className="font-condensed text-white hover:text-primary transition cursor-pointer">REVIEWS</span>
              </Link>
              <Link href="/members">
                <span className="font-condensed text-white hover:text-primary transition cursor-pointer">MEMBERS</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="relative md:block">
                <Input
                  type="text"
                  placeholder="Search albums..."
                  className="bg-surfaceLight text-white w-48 md:w-64 pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </form>
            ) : (
              <div className="relative hidden md:block">
                <form onSubmit={handleSearch}>
                  <Input
                    type="text"
                    placeholder="Search albums..."
                    className="bg-surfaceLight text-white w-64 pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </form>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-white hover:text-primary"
              onClick={handleMobileSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 focus:outline-none">
                  <Avatar className="w-8 h-8 border border-surfaceLight">
                    <AvatarImage src={currentUser?.profileImage} alt="Profile" />
                    <AvatarFallback>
                      {currentUser?.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline font-medium">
                    {currentUser?.displayName?.split(' ')[0] || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate(`/profile/${currentUser?.username || 'me'}`)}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-2xl text-white"
            >
              <i className="fas fa-bars"></i>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
