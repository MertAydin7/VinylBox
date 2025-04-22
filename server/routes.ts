import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertRatingSchema, insertReviewSchema, insertFollowSchema, insertFavoriteSchema, insertLikeSchema, insertCommentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/users/me", async (req, res) => {
    // In a real app, this would use the session to get the current user
    // For demo purposes, we'll assume the user with ID 1 is logged in
    const currentUserId = 1;
    
    try {
      const user = await storage.getUser(currentUserId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get additional user data
      const ratings = await storage.getUserRatings(user.id);
      const reviews = await storage.getUserReviews(user.id);
      const followers = await storage.getFollowers(user.id);
      const following = await storage.getFollowing(user.id);
      const favorites = await storage.getUserFavorites(user.id);
      
      // Get favorite albums with details
      const favoriteAlbums = [];
      for (const fav of favorites) {
        const album = await storage.getAlbum(fav.albumId);
        const avgRating = await storage.getAlbumAverageRating(fav.albumId);
        const userRating = ratings.find(r => r.albumId === fav.albumId)?.rating;
        
        if (album) {
          favoriteAlbums.push({
            ...album,
            averageRating: avgRating,
            userRating,
            position: fav.position
          });
        }
      }
      
      // Sort favorites by position
      favoriteAlbums.sort((a, b) => a.position - b.position);
      
      res.json({
        ...user,
        albumCount: ratings.length,
        reviewCount: reviews.length,
        followerCount: followers.length,
        followingCount: following.length,
        favoriteAlbums
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userIdOrName = req.params.id;
      let user;
      
      // Check if the ID is numeric or a username
      if (!isNaN(parseInt(userIdOrName))) {
        const userId = parseInt(userIdOrName);
        user = await storage.getUser(userId);
      } else {
        // If not numeric, treat as username
        user = await storage.getUserByUsername(userIdOrName);
      }
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get additional user data
      const ratings = await storage.getUserRatings(user.id);
      const reviews = await storage.getUserReviews(user.id);
      const followers = await storage.getFollowers(user.id);
      const following = await storage.getFollowing(user.id);
      const favorites = await storage.getUserFavorites(user.id);
      
      // Get favorite albums with details
      const favoriteAlbums = [];
      for (const fav of favorites) {
        const album = await storage.getAlbum(fav.albumId);
        const avgRating = await storage.getAlbumAverageRating(fav.albumId);
        const userRating = ratings.find(r => r.albumId === fav.albumId)?.rating;
        
        if (album) {
          favoriteAlbums.push({
            ...album,
            averageRating: avgRating,
            userRating,
            position: fav.position
          });
        }
      }
      
      // Sort favorites by position
      favoriteAlbums.sort((a, b) => a.position - b.position);
      
      // Check if the current user follows this user
      const currentUserId = 1; // In a real app, would come from session
      const isFollowing = await storage.isFollowing(currentUserId, user.id);
      
      res.json({
        ...user,
        albumCount: ratings.length,
        reviewCount: reviews.length,
        followerCount: followers.length,
        followingCount: following.length,
        favoriteAlbums,
        isFollowing
      });
    } catch (error) {
      console.error("Error in /api/users/:id:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Albums
  app.get("/api/albums", async (req, res) => {
    try {
      const { limit, offset, sort, genre, year, q } = req.query;
      
      let albums;
      
      // If there's a search query, use search endpoint
      if (q) {
        albums = await storage.searchAlbums(q as string);
      } else {
        // Otherwise use regular albums endpoint with filters
        albums = await storage.getAlbums({
          limit: limit ? parseInt(limit as string) : undefined,
          offset: offset ? parseInt(offset as string) : undefined,
          sort: sort as string | undefined,
          genre: genre as string | undefined,
          year: year ? parseInt(year as string) : undefined
        });
      }
      
      // Enhance albums with ratings
      const enhancedAlbums = [];
      const currentUserId = 1; // In a real app, would come from session
      
      for (const album of albums) {
        const avgRating = await storage.getAlbumAverageRating(album.id);
        const ratings = await storage.getAlbumRatings(album.id);
        const userRating = await storage.getRating(currentUserId, album.id);
        
        enhancedAlbums.push({
          ...album,
          averageRating: avgRating,
          userRating: userRating?.rating,
          ratingCount: ratings.length
        });
      }
      
      res.json(enhancedAlbums);
    } catch (error) {
      console.error("Error in /api/albums:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/albums/popular", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const albums = await storage.getPopularAlbums(limit);
      
      // Enhance albums with ratings
      const enhancedAlbums = [];
      
      for (const album of albums) {
        const avgRating = await storage.getAlbumAverageRating(album.id);
        const ratings = await storage.getAlbumRatings(album.id);
        
        enhancedAlbums.push({
          ...album,
          averageRating: avgRating,
          ratingCount: ratings.length
        });
      }
      
      res.json(enhancedAlbums);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/albums/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const albums = await storage.getRecentAlbums(limit);
      
      // Enhance albums with ratings
      const enhancedAlbums = [];
      
      for (const album of albums) {
        const avgRating = await storage.getAlbumAverageRating(album.id);
        const ratings = await storage.getAlbumRatings(album.id);
        
        enhancedAlbums.push({
          ...album,
          averageRating: avgRating,
          ratingCount: ratings.length
        });
      }
      
      res.json(enhancedAlbums);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/albums/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const albums = await storage.searchAlbums(query);
      res.json(albums);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/albums/:id", async (req, res) => {
    try {
      const albumId = parseInt(req.params.id);
      const album = await storage.getAlbum(albumId);
      
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
      
      // Get tracks, ratings, and reviews
      const tracks = await storage.getTracks(albumId);
      const ratings = await storage.getAlbumRatings(albumId);
      const avgRating = await storage.getAlbumAverageRating(albumId);
      
      // Get current user's rating
      const currentUserId = 1; // In a real app, would come from session
      const userRating = await storage.getRating(currentUserId, albumId);
      
      // Calculate rating distribution
      const distribution = {
        "5": 0,
        "4.5": 0,
        "4": 0,
        "3.5": 0,
        "3": 0,
        "2.5": 0,
        "2": 0,
        "1.5": 0,
        "1": 0,
        "0.5": 0
      };
      
      ratings.forEach(r => {
        distribution[r.rating as keyof typeof distribution]++;
      });
      
      res.json({
        ...album,
        tracks,
        avgRating,
        userRating: userRating?.rating,
        ratingCount: ratings.length,
        ratingDistribution: distribution
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Ratings
  app.post("/api/ratings", async (req, res) => {
    try {
      const ratingData = insertRatingSchema.parse(req.body);
      const rating = await storage.createOrUpdateRating(ratingData);
      res.status(201).json(rating);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid rating data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Reviews
  app.get("/api/albums/:id/reviews", async (req, res) => {
    try {
      const albumId = parseInt(req.params.id);
      const reviews = await storage.getAlbumReviews(albumId);
      
      // Enhance reviews with user data and like/comment counts
      const enhancedReviews = [];
      const currentUserId = 1; // In a real app, would come from session
      
      for (const review of reviews) {
        const user = await storage.getUser(review.userId);
        const likes = await storage.getLikes(review.id);
        const comments = await storage.getComments(review.id);
        const userLiked = likes.some(like => like.userId === currentUserId);
        
        if (user) {
          enhancedReviews.push({
            ...review,
            user,
            likeCount: likes.length,
            commentCount: comments.length,
            userLiked
          });
        }
      }
      
      res.json(enhancedReviews);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/reviews/:id", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: "Review content is required" });
      }
      
      const updatedReview = await storage.updateReview(reviewId, content);
      
      if (!updatedReview) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      res.json(updatedReview);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/reviews/:id", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const success = await storage.deleteReview(reviewId);
      
      if (!success) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Follows
  app.post("/api/follows", async (req, res) => {
    try {
      const followData = insertFollowSchema.parse(req.body);
      const follow = await storage.createFollow(followData);
      res.status(201).json(follow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid follow data", errors: error.errors });
      }
      if (error instanceof Error && error.message === 'Already following this user') {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/follows/:followedId", async (req, res) => {
    try {
      const followedId = parseInt(req.params.followedId);
      const currentUserId = 1; // In a real app, would come from session
      
      const success = await storage.deleteFollow(currentUserId, followedId);
      
      if (!success) {
        return res.status(404).json({ message: "Follow relationship not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Favorites
  app.get("/api/users/:id/favorites", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const favorites = await storage.getUserFavorites(userId);
      
      // Get album details for each favorite
      const favoriteAlbums = [];
      for (const fav of favorites) {
        const album = await storage.getAlbum(fav.albumId);
        const avgRating = await storage.getAlbumAverageRating(fav.albumId);
        
        if (album) {
          favoriteAlbums.push({
            ...album,
            position: fav.position,
            averageRating: avgRating
          });
        }
      }
      
      res.json(favoriteAlbums);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const favoriteData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.createFavorite(favoriteData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid favorite data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/favorites/:albumId", async (req, res) => {
    try {
      const albumId = parseInt(req.params.albumId);
      const currentUserId = 1; // In a real app, would come from session
      
      const success = await storage.deleteFavorite(currentUserId, albumId);
      
      if (!success) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Likes
  app.post("/api/likes", async (req, res) => {
    try {
      const likeData = insertLikeSchema.parse(req.body);
      const like = await storage.createLike(likeData);
      res.status(201).json(like);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid like data", errors: error.errors });
      }
      if (error instanceof Error && error.message === 'Already liked this review') {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/likes/:reviewId", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const currentUserId = 1; // In a real app, would come from session
      
      const success = await storage.deleteLike(currentUserId, reviewId);
      
      if (!success) {
        return res.status(404).json({ message: "Like not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Comments
  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Activity Feed
  app.get("/api/feed", async (req, res) => {
    try {
      const currentUserId = 1; // In a real app, would come from session
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      
      const activityFeed = await storage.getActivityFeed(currentUserId, limit);
      res.json(activityFeed);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/feed/network", async (req, res) => {
    try {
      const currentUserId = 1; // In a real app, would come from session
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      
      // Temporary fix: return general activity feed if network feed fails
      try {
        const networkFeed = await storage.getNetworkActivityFeed(currentUserId, limit);
        res.json(networkFeed);
      } catch (innerError) {
        console.error("Error fetching network feed, using general feed instead:", innerError);
        const generalFeed = await storage.getActivityFeed(currentUserId, limit);
        res.json(generalFeed);
      }
    } catch (error) {
      console.error("Error in /api/feed/network:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // People to follow
  app.get("/api/users/suggested", async (req, res) => {
    try {
      const currentUserId = 1; // In a real app, would come from session
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      
      // Get users that the current user is following
      const following = await storage.getFollowing(currentUserId);
      const followingIds = following.map(user => user.id);
      
      // Get all users except the current user and those already followed
      const allUsers = await storage.getUsers();
      
      // Make sure we have an array
      if (!Array.isArray(allUsers)) {
        console.error("getUsers() didn't return an array:", allUsers);
        return res.status(500).json({ message: "Server error: Invalid users data format" });
      }
      
      const filteredUsers = allUsers
        .filter(user => user.id !== currentUserId && !followingIds.includes(user.id));
      
      // For now, simply return random users
      // In a real app, we might use more sophisticated recommendation logic
      const shuffled = [...filteredUsers].sort(() => 0.5 - Math.random());
      const suggested = shuffled.slice(0, limit);
      
      // Enhance with review counts
      const enhancedUsers = [];
      for (const user of suggested) {
        const reviews = await storage.getUserReviews(user.id);
        enhancedUsers.push({
          ...user,
          reviewCount: reviews.length
        });
      }
      
      res.json(enhancedUsers);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
