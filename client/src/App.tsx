import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Albums from "@/pages/Albums";
import AlbumDetail from "@/pages/AlbumDetail";
import Profile from "@/pages/Profile";
import Reviews from "@/pages/Reviews";
import Members from "@/pages/Members";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/albums" component={Albums} />
      <Route path="/albums/:id" component={AlbumDetail} />
      <Route path="/profile/:username" component={Profile} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/members" component={Members} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
