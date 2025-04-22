import {
  users, albums, tracks, ratings, reviews, follows, favorites, likes, comments,
  type User, type InsertUser, type Album, type InsertAlbum,
  type Track, type InsertTrack, type Rating, type InsertRating,
  type Review, type InsertReview, type Follow, type InsertFollow,
  type Favorite, type InsertFavorite, type Like, type InsertLike,
  type Comment, type InsertComment
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, like, ilike, or, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Album operations
  getAlbum(id: number): Promise<Album | undefined>;
  getAlbums(options?: { limit?: number; offset?: number; sort?: string; genre?: string; year?: number }): Promise<Album[]>;
  searchAlbums(query: string): Promise<Album[]>;
  createAlbum(album: InsertAlbum): Promise<Album>;
  getAlbumAverageRating(albumId: number): Promise<number | null>;
  getPopularAlbums(limit?: number): Promise<Album[]>;
  getRecentAlbums(limit?: number): Promise<Album[]>;
  
  // Track operations
  getTracks(albumId: number): Promise<Track[]>;
  createTrack(track: InsertTrack): Promise<Track>;
  
  // Rating operations
  getRating(userId: number, albumId: number): Promise<Rating | undefined>;
  getUserRatings(userId: number): Promise<Rating[]>;
  getAlbumRatings(albumId: number): Promise<Rating[]>;
  createOrUpdateRating(rating: InsertRating): Promise<Rating>;
  
  // Review operations
  getReview(id: number): Promise<Review | undefined>;
  getUserReviews(userId: number): Promise<Review[]>;
  getAlbumReviews(albumId: number): Promise<Review[]>;
  getRecentReviews(limit?: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, content: string): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;
  
  // Follow operations
  getFollowers(userId: number): Promise<User[]>;
  getFollowing(userId: number): Promise<User[]>;
  isFollowing(followerId: number, followedId: number): Promise<boolean>;
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(followerId: number, followedId: number): Promise<boolean>;
  
  // Favorite operations
  getUserFavorites(userId: number): Promise<Favorite[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  updateFavoritePosition(id: number, position: number): Promise<Favorite | undefined>;
  deleteFavorite(userId: number, albumId: number): Promise<boolean>;
  
  // Like operations
  getLikes(reviewId: number): Promise<Like[]>;
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(userId: number, reviewId: number): Promise<boolean>;
  
  // Comment operations
  getComments(reviewId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;
  
  // Feed operations
  getActivityFeed(userId: number, limit?: number): Promise<any[]>;
  getNetworkActivityFeed(userId: number, limit?: number): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private albums: Map<number, Album>;
  private tracks: Map<number, Track>;
  private ratings: Map<number, Rating>;
  private reviews: Map<number, Review>;
  private follows: Map<number, Follow>;
  private favorites: Map<number, Favorite>;
  private likes: Map<number, Like>;
  private comments: Map<number, Comment>;
  
  private currentId: {
    users: number;
    albums: number;
    tracks: number;
    ratings: number;
    reviews: number;
    follows: number;
    favorites: number;
    likes: number;
    comments: number;
  };

  constructor() {
    this.users = new Map();
    this.albums = new Map();
    this.tracks = new Map();
    this.ratings = new Map();
    this.reviews = new Map();
    this.follows = new Map();
    this.favorites = new Map();
    this.likes = new Map();
    this.comments = new Map();
    
    this.currentId = {
      users: 1,
      albums: 1,
      tracks: 1,
      ratings: 1,
      reviews: 1,
      follows: 1,
      favorites: 1,
      likes: 1,
      comments: 1
    };
    
    // Initialize with some sample data
    this.initializeData();
  }

  private initializeData() {
    // Sample users
    const sampleUsers: InsertUser[] = [
      {
        username: 'sophie',
        displayName: 'Sophie Anderson',
        email: 'sophie@example.com',
        password: 'password123',
        bio: 'Music enthusiast with a love for indie, electronic, and hip-hop. Always on the lookout for hidden gems and new sounds.',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128'
      },
      {
        username: 'michael',
        displayName: 'Michael Reed',
        email: 'michael@example.com',
        password: 'password123',
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48'
      },
      {
        username: 'emma',
        displayName: 'Emma Wilson',
        email: 'emma@example.com',
        password: 'password123',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48'
      },
      {
        username: 'david',
        displayName: 'David Chen',
        email: 'david@example.com',
        password: 'password123',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48'
      },
      {
        username: 'sarah',
        displayName: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48'
      },
      {
        username: 'james',
        displayName: 'James Wilson',
        email: 'james@example.com',
        password: 'password123',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48'
      }
    ];
    
    // Sample albums
    const sampleAlbums: InsertAlbum[] = [
      {
        title: 'Dawn FM',
        artist: 'The Weeknd',
        releaseYear: 2022,
        coverImage: 'https://images.unsplash.com/photo-1606880145171-96fd7e3b40f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        genre: 'R&B, Synth-pop',
        label: 'XO'
      },
      {
        title: 'The Dark Side of the Moon',
        artist: 'Pink Floyd',
        releaseYear: 1973,
        coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        genre: 'Progressive Rock',
        label: 'Harvest Records'
      },
      {
        title: 'SOS',
        artist: 'SZA',
        releaseYear: 2022,
        coverImage: 'https://images.unsplash.com/photo-1671726805768-575bf28d7dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        genre: 'R&B, Soul',
        label: 'Top Dawg Entertainment'
      },
      {
        title: 'RENAISSANCE',
        artist: 'Beyoncé',
        releaseYear: 2022,
        coverImage: 'https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        genre: 'Dance, Pop',
        label: 'Parkwood Entertainment'
      },
      {
        title: 'Blonde',
        artist: 'Frank Ocean',
        releaseYear: 2016,
        coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        genre: 'R&B, Soul, Experimental',
        label: 'Boys Don\'t Cry'
      },
      {
        title: 'Channel Orange',
        artist: 'Frank Ocean',
        releaseYear: 2012,
        coverImage: 'https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        genre: 'R&B, Soul',
        label: 'Def Jam Recordings'
      },
      {
        title: 'Nostalgia, Ultra',
        artist: 'Frank Ocean',
        releaseYear: 2011,
        coverImage: 'https://images.unsplash.com/photo-1671726805768-575bf28d7dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        genre: 'R&B, Alternative R&B',
        label: 'Self-released'
      },
      {
        title: 'IGOR',
        artist: 'Tyler, The Creator',
        releaseYear: 2019,
        coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
        genre: 'Hip Hop, Neo Soul',
        label: 'Columbia Records'
      }
    ];
    
    // Create sample users
    for (const userData of sampleUsers) {
      this.createUser(userData);
    }
    
    // Create sample albums
    for (const albumData of sampleAlbums) {
      this.createAlbum(albumData);
    }
    
    // Create sample tracks for Blonde
    const blondeAlbum = Array.from(this.albums.values()).find(a => a.title === 'Blonde');
    if (blondeAlbum) {
      const tracks: InsertTrack[] = [
        { albumId: blondeAlbum.id, title: 'Nikes', duration: '5:14', trackNumber: 1 },
        { albumId: blondeAlbum.id, title: 'Ivy', duration: '4:09', trackNumber: 2 },
        { albumId: blondeAlbum.id, title: 'Pink + White', duration: '3:04', trackNumber: 3 },
        { albumId: blondeAlbum.id, title: 'Be Yourself', duration: '1:26', trackNumber: 4 },
        { albumId: blondeAlbum.id, title: 'Solo', duration: '4:17', trackNumber: 5 },
        { albumId: blondeAlbum.id, title: 'Skyline To', duration: '3:04', trackNumber: 6 },
        { albumId: blondeAlbum.id, title: 'Self Control', duration: '4:09', trackNumber: 7 },
        { albumId: blondeAlbum.id, title: 'Good Guy', duration: '1:06', trackNumber: 8 },
        { albumId: blondeAlbum.id, title: 'Nights', duration: '5:07', trackNumber: 9 },
        { albumId: blondeAlbum.id, title: 'Solo (Reprise)', duration: '1:18', trackNumber: 10 },
      ];
      
      for (const track of tracks) {
        this.createTrack(track);
      }
    }
    
    // Add sample ratings and reviews
    const sophie = Array.from(this.users.values()).find(u => u.username === 'sophie');
    const michael = Array.from(this.users.values()).find(u => u.username === 'michael');
    const emma = Array.from(this.users.values()).find(u => u.username === 'emma');
    const david = Array.from(this.users.values()).find(u => u.username === 'david');
    
    const blonde = Array.from(this.albums.values()).find(a => a.title === 'Blonde');
    const dawnFM = Array.from(this.albums.values()).find(a => a.title === 'Dawn FM');
    const darkSide = Array.from(this.albums.values()).find(a => a.title === 'The Dark Side of the Moon');
    const sos = Array.from(this.albums.values()).find(a => a.title === 'SOS');
    const renaissance = Array.from(this.albums.values()).find(a => a.title === 'RENAISSANCE');
    
    if (sophie && blonde && dawnFM && darkSide && sos && renaissance) {
      // Add ratings
      this.createOrUpdateRating({ userId: sophie.id, albumId: blonde.id, rating: 5 });
      this.createOrUpdateRating({ userId: sophie.id, albumId: dawnFM.id, rating: 4.5 });
      this.createOrUpdateRating({ userId: sophie.id, albumId: darkSide.id, rating: 5 });
      this.createOrUpdateRating({ userId: sophie.id, albumId: sos.id, rating: 4.5 });
      this.createOrUpdateRating({ userId: sophie.id, albumId: renaissance.id, rating: 4.5 });
      
      // Set up favorite albums
      this.createFavorite({ userId: sophie.id, albumId: blonde.id, position: 1 });
      this.createFavorite({ userId: sophie.id, albumId: darkSide.id, position: 2 });
      this.createFavorite({ userId: sophie.id, albumId: renaissance.id, position: 3 });
      this.createFavorite({ userId: sophie.id, albumId: sos.id, position: 4 });
      this.createFavorite({ userId: sophie.id, albumId: dawnFM.id, position: 5 });
    }
    
    if (michael && emma && david && blonde && dawnFM) {
      // Add ratings and reviews from other users
      this.createOrUpdateRating({ userId: michael.id, albumId: dawnFM.id, rating: 4.5 });
      this.createOrUpdateRating({ userId: emma.id, albumId: blonde.id, rating: 5 });
      this.createOrUpdateRating({ userId: david.id, albumId: blonde.id, rating: 4 });
      
      // Add reviews
      this.createReview({
        userId: michael.id,
        albumId: dawnFM.id,
        content: "The production on this album is incredible. The Weeknd really managed to create an immersive sonic experience with this one."
      });
      
      this.createReview({
        userId: emma.id,
        albumId: blonde.id,
        content: "Frank Ocean's \"Blonde\" is a masterpiece that continues to reveal new depths with each listen. The minimalist production creates space for Frank's vocals and poetic lyrics to shine. Tracks like \"Self Control\" and \"Nights\" showcase his ability to convey complex emotions through subtle shifts in tone and melody. What makes this album truly special is how it captures moments of profound introspection while maintaining an emotional accessibility that resonates with listeners from all walks of life."
      });
      
      this.createReview({
        userId: david.id,
        albumId: blonde.id,
        content: "Blonde is a masterful work of art. The production is subtle yet powerful, letting Frank's voice and lyrics take center stage. The album feels intensely personal and vulnerable in a way few artists achieve. My only critique is that some tracks can feel a bit too experimental at times, but that's part of what makes this album so special."
      });
      
      // Add follows
      this.createFollow({ followerId: sophie.id, followedId: michael.id });
      this.createFollow({ followerId: sophie.id, followedId: emma.id });
      this.createFollow({ followerId: michael.id, followedId: sophie.id });
      this.createFollow({ followerId: emma.id, followedId: sophie.id });
      this.createFollow({ followerId: david.id, followedId: emma.id });
      
      // Add likes
      const emmaReview = Array.from(this.reviews.values()).find(r => r.userId === emma.id && r.albumId === blonde.id);
      const michaelReview = Array.from(this.reviews.values()).find(r => r.userId === michael.id && r.albumId === dawnFM.id);
      
      if (emmaReview && michaelReview) {
        this.createLike({ userId: sophie.id, reviewId: emmaReview.id });
        this.createLike({ userId: david.id, reviewId: emmaReview.id });
        this.createLike({ userId: sophie.id, reviewId: michaelReview.id });
        
        // Add comments
        this.createComment({ userId: sophie.id, reviewId: emmaReview.id, content: "Totally agree! This is one of my all-time favorites too." });
      }
    }
  }

  // User methods
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Album methods
  async getAlbum(id: number): Promise<Album | undefined> {
    return this.albums.get(id);
  }

  async getAlbums(options: { limit?: number; offset?: number; sort?: string; genre?: string; year?: number } = {}): Promise<Album[]> {
    let albums = Array.from(this.albums.values());
    
    // Apply filters
    if (options.genre) {
      albums = albums.filter(album => album.genre?.toLowerCase().includes(options.genre!.toLowerCase()));
    }
    
    if (options.year) {
      albums = albums.filter(album => album.releaseYear === options.year);
    }
    
    // Apply sorting
    if (options.sort === 'recent') {
      albums = albums.sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (options.sort === 'rating') {
      // Sort by rating would require calculating average ratings
      const albumRatings = new Map<number, number>();
      
      for (const album of albums) {
        const avgRating = await this.getAlbumAverageRating(album.id);
        albumRatings.set(album.id, avgRating || 0);
      }
      
      albums = albums.sort((a, b) => {
        const ratingA = albumRatings.get(a.id) || 0;
        const ratingB = albumRatings.get(b.id) || 0;
        return ratingB - ratingA;
      });
    }
    
    // Apply pagination
    if (options.offset) {
      albums = albums.slice(options.offset);
    }
    
    if (options.limit) {
      albums = albums.slice(0, options.limit);
    }
    
    return albums;
  }

  async searchAlbums(query: string): Promise<Album[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.albums.values()).filter(album => 
      album.title.toLowerCase().includes(lowercaseQuery) || 
      album.artist.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createAlbum(album: InsertAlbum): Promise<Album> {
    const id = this.currentId.albums++;
    const newAlbum: Album = { ...album, id };
    this.albums.set(id, newAlbum);
    return newAlbum;
  }

  async getAlbumAverageRating(albumId: number): Promise<number | null> {
    const albumRatings = Array.from(this.ratings.values()).filter(rating => rating.albumId === albumId);
    if (albumRatings.length === 0) return null;
    
    const sum = albumRatings.reduce((acc, rating) => acc + rating.rating, 0);
    return sum / albumRatings.length;
  }

  async getPopularAlbums(limit: number = 10): Promise<Album[]> {
    // For simplicity, we'll measure popularity by number of ratings
    const albumRatingCounts = new Map<number, number>();
    
    for (const rating of this.ratings.values()) {
      const count = albumRatingCounts.get(rating.albumId) || 0;
      albumRatingCounts.set(rating.albumId, count + 1);
    }
    
    const albums = Array.from(this.albums.values());
    return albums
      .sort((a, b) => {
        const countA = albumRatingCounts.get(a.id) || 0;
        const countB = albumRatingCounts.get(b.id) || 0;
        return countB - countA;
      })
      .slice(0, limit);
  }

  async getRecentAlbums(limit: number = 10): Promise<Album[]> {
    return Array.from(this.albums.values())
      .sort((a, b) => b.releaseYear - a.releaseYear)
      .slice(0, limit);
  }

  // Track methods
  async getTracks(albumId: number): Promise<Track[]> {
    return Array.from(this.tracks.values())
      .filter(track => track.albumId === albumId)
      .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0));
  }

  async createTrack(track: InsertTrack): Promise<Track> {
    const id = this.currentId.tracks++;
    const newTrack: Track = { ...track, id };
    this.tracks.set(id, newTrack);
    return newTrack;
  }

  // Rating methods
  async getRating(userId: number, albumId: number): Promise<Rating | undefined> {
    return Array.from(this.ratings.values()).find(
      rating => rating.userId === userId && rating.albumId === albumId
    );
  }

  async getUserRatings(userId: number): Promise<Rating[]> {
    return Array.from(this.ratings.values()).filter(rating => rating.userId === userId);
  }

  async getAlbumRatings(albumId: number): Promise<Rating[]> {
    return Array.from(this.ratings.values()).filter(rating => rating.albumId === albumId);
  }

  async createOrUpdateRating(rating: InsertRating): Promise<Rating> {
    const existingRating = await this.getRating(rating.userId, rating.albumId);
    
    if (existingRating) {
      const updatedRating: Rating = { ...existingRating, rating: rating.rating };
      this.ratings.set(existingRating.id, updatedRating);
      return updatedRating;
    } else {
      const id = this.currentId.ratings++;
      const newRating: Rating = { ...rating, id, createdAt: new Date() };
      this.ratings.set(id, newRating);
      return newRating;
    }
  }

  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getUserReviews(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAlbumReviews(albumId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.albumId === albumId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRecentReviews(limit: number = 10): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentId.reviews++;
    const now = new Date();
    const newReview: Review = { ...review, id, createdAt: now, updatedAt: now };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async updateReview(id: number, content: string): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;
    
    const updatedReview: Review = { ...review, content, updatedAt: new Date() };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    return this.reviews.delete(id);
  }

  // Follow methods
  async getFollowers(userId: number): Promise<User[]> {
    const followerIds = Array.from(this.follows.values())
      .filter(follow => follow.followedId === userId)
      .map(follow => follow.followerId);
    
    return Array.from(this.users.values()).filter(user => followerIds.includes(user.id));
  }

  async getFollowing(userId: number): Promise<User[]> {
    const followingIds = Array.from(this.follows.values())
      .filter(follow => follow.followerId === userId)
      .map(follow => follow.followedId);
    
    return Array.from(this.users.values()).filter(user => followingIds.includes(user.id));
  }

  async isFollowing(followerId: number, followedId: number): Promise<boolean> {
    return Array.from(this.follows.values()).some(
      follow => follow.followerId === followerId && follow.followedId === followedId
    );
  }

  async createFollow(follow: InsertFollow): Promise<Follow> {
    // Check if already following
    const alreadyFollowing = await this.isFollowing(follow.followerId, follow.followedId);
    if (alreadyFollowing) {
      throw new Error('Already following this user');
    }
    
    const id = this.currentId.follows++;
    const newFollow: Follow = { ...follow, id, createdAt: new Date() };
    this.follows.set(id, newFollow);
    return newFollow;
  }

  async deleteFollow(followerId: number, followedId: number): Promise<boolean> {
    const follow = Array.from(this.follows.values()).find(
      follow => follow.followerId === followerId && follow.followedId === followedId
    );
    
    if (!follow) return false;
    return this.follows.delete(follow.id);
  }

  // Favorite methods
  async getUserFavorites(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values())
      .filter(favorite => favorite.userId === userId)
      .sort((a, b) => a.position - b.position);
  }

  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    // Check if this album is already a favorite
    const existingFavorite = Array.from(this.favorites.values()).find(
      fav => fav.userId === favorite.userId && fav.albumId === favorite.albumId
    );
    
    if (existingFavorite) {
      // Update position instead
      return this.updateFavoritePosition(existingFavorite.id, favorite.position) as Promise<Favorite>;
    }
    
    const id = this.currentId.favorites++;
    const newFavorite: Favorite = { ...favorite, id, createdAt: new Date() };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }

  async updateFavoritePosition(id: number, position: number): Promise<Favorite | undefined> {
    const favorite = this.favorites.get(id);
    if (!favorite) return undefined;
    
    const updatedFavorite: Favorite = { ...favorite, position };
    this.favorites.set(id, updatedFavorite);
    return updatedFavorite;
  }

  async deleteFavorite(userId: number, albumId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(
      fav => fav.userId === userId && fav.albumId === albumId
    );
    
    if (!favorite) return false;
    return this.favorites.delete(favorite.id);
  }

  // Like methods
  async getLikes(reviewId: number): Promise<Like[]> {
    return Array.from(this.likes.values()).filter(like => like.reviewId === reviewId);
  }

  async createLike(like: InsertLike): Promise<Like> {
    // Check if already liked
    const alreadyLiked = Array.from(this.likes.values()).some(
      l => l.userId === like.userId && l.reviewId === like.reviewId
    );
    
    if (alreadyLiked) {
      throw new Error('Already liked this review');
    }
    
    const id = this.currentId.likes++;
    const newLike: Like = { ...like, id, createdAt: new Date() };
    this.likes.set(id, newLike);
    return newLike;
  }

  async deleteLike(userId: number, reviewId: number): Promise<boolean> {
    const like = Array.from(this.likes.values()).find(
      like => like.userId === userId && like.reviewId === reviewId
    );
    
    if (!like) return false;
    return this.likes.delete(like.id);
  }

  // Comment methods
  async getComments(reviewId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.reviewId === reviewId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const id = this.currentId.comments++;
    const newComment: Comment = { ...comment, id, createdAt: new Date() };
    this.comments.set(id, newComment);
    return newComment;
  }

  async deleteComment(id: number): Promise<boolean> {
    return this.comments.delete(id);
  }

  // Feed methods
  async getActivityFeed(userId: number, limit: number = 20): Promise<any[]> {
    const activities: any[] = [];
    
    // Get user's ratings and reviews
    const userRatings = await this.getUserRatings(userId);
    const userReviews = await this.getUserReviews(userId);
    
    // Convert to activity objects
    for (const rating of userRatings) {
      const album = await this.getAlbum(rating.albumId);
      const user = await this.getUser(rating.userId);
      
      if (album && user) {
        activities.push({
          type: 'rating',
          user,
          album,
          rating: rating.rating,
          timestamp: rating.createdAt
        });
      }
    }
    
    for (const review of userReviews) {
      const album = await this.getAlbum(review.albumId);
      const user = await this.getUser(review.userId);
      const likes = await this.getLikes(review.id);
      const comments = await this.getComments(review.id);
      
      if (album && user) {
        activities.push({
          type: 'review',
          user,
          album,
          review,
          likeCount: likes.length,
          commentCount: comments.length,
          timestamp: review.createdAt
        });
      }
    }
    
    // Sort by timestamp (most recent first) and limit
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return activities.slice(0, limit);
  }

  async getNetworkActivityFeed(userId: number, limit: number = 20): Promise<any[]> {
    const activities: any[] = [];
    
    // Get users that this user follows
    const following = await this.getFollowing(userId);
    
    // Get ratings and reviews from followed users
    for (const followedUser of following) {
      const ratings = await this.getUserRatings(followedUser.id);
      const reviews = await this.getUserReviews(followedUser.id);
      
      // Convert to activity objects
      for (const rating of ratings) {
        const album = await this.getAlbum(rating.albumId);
        
        if (album) {
          activities.push({
            type: 'rating',
            user: followedUser,
            album,
            rating: rating.rating,
            timestamp: rating.createdAt
          });
        }
      }
      
      for (const review of reviews) {
        const album = await this.getAlbum(review.albumId);
        const likes = await this.getLikes(review.id);
        const comments = await this.getComments(review.id);
        
        if (album) {
          activities.push({
            type: 'review',
            user: followedUser,
            album,
            review,
            likeCount: likes.length,
            commentCount: comments.length,
            timestamp: review.createdAt
          });
        }
      }
    }
    
    // Sort by timestamp (most recent first) and limit
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return activities.slice(0, limit);
  }
}

export class DatabaseStorage implements IStorage {
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async getAlbum(id: number): Promise<Album | undefined> {
    const [album] = await db.select().from(albums).where(eq(albums.id, id));
    return album;
  }

  async getAlbums(options: { limit?: number; offset?: number; sort?: string; genre?: string; year?: number } = {}): Promise<Album[]> {
    const { limit = 20, offset = 0, sort, genre, year } = options;
    let query = db.select().from(albums);

    // Apply filters
    if (genre) {
      query = query.where(like(albums.genre, `%${genre}%`));
    }
    if (year) {
      query = query.where(eq(albums.releaseYear, year));
    }

    // Apply sorting
    if (sort === 'recent') {
      query = query.orderBy(desc(albums.id));
    } else if (sort === 'year') {
      query = query.orderBy(desc(albums.releaseYear));
    } else if (sort === 'popular') {
      // This requires a more complex query with joins and ratings count
      // For simplicity, we'll default to id sorting for popular albums
      query = query.orderBy(desc(albums.id));
    } else {
      query = query.orderBy(albums.title);
    }

    // Apply pagination
    return await query.limit(limit).offset(offset);
  }

  async searchAlbums(query: string): Promise<Album[]> {
    // Clean the query to prevent SQL injection
    const safeQuery = query.replace(/[%_]/g, character => `\\${character}`);
    
    return await db
      .select()
      .from(albums)
      .where(
        or(
          ilike(albums.title, `%${safeQuery}%`),
          ilike(albums.artist, `%${safeQuery}%`),
          ilike(albums.genre, `%${safeQuery}%`),
          ilike(albums.label, `%${safeQuery}%`)
        )
      )
      // Order by relevance (exact title matches first, then exact artist matches, etc)
      .orderBy(
        sql`
          CASE 
            WHEN LOWER(${albums.title}) = LOWER(${safeQuery}) THEN 1
            WHEN LOWER(${albums.artist}) = LOWER(${safeQuery}) THEN 2
            WHEN LOWER(${albums.title}) LIKE LOWER(${safeQuery} || '%') THEN 3
            WHEN LOWER(${albums.artist}) LIKE LOWER(${safeQuery} || '%') THEN 4
            ELSE 5
          END
        `.asc(),
        desc(albums.id) // Secondary sort by newest albums
      )
      .limit(20);
  }

  async createAlbum(album: InsertAlbum): Promise<Album> {
    const [newAlbum] = await db.insert(albums).values(album).returning();
    return newAlbum;
  }

  async getAlbumAverageRating(albumId: number): Promise<number | null> {
    const result = await db
      .select({ avgRating: sql<number>`avg(${ratings.rating})` })
      .from(ratings)
      .where(eq(ratings.albumId, albumId));
    
    return result[0]?.avgRating || null;
  }

  async getPopularAlbums(limit: number = 10): Promise<Album[]> {
    // For a more accurate implementation, we would join with ratings and count
    // For simplicity, we'll return albums sorted by id
    return await db.select().from(albums).orderBy(desc(albums.id)).limit(limit);
  }

  async getRecentAlbums(limit: number = 10): Promise<Album[]> {
    return await db.select().from(albums).orderBy(desc(albums.id)).limit(limit);
  }

  async getTracks(albumId: number): Promise<Track[]> {
    return await db
      .select()
      .from(tracks)
      .where(eq(tracks.albumId, albumId))
      .orderBy(asc(tracks.trackNumber));
  }

  async createTrack(track: InsertTrack): Promise<Track> {
    const [newTrack] = await db.insert(tracks).values(track).returning();
    return newTrack;
  }

  async getRating(userId: number, albumId: number): Promise<Rating | undefined> {
    const [rating] = await db
      .select()
      .from(ratings)
      .where(
        and(
          eq(ratings.userId, userId),
          eq(ratings.albumId, albumId)
        )
      );
    return rating;
  }

  async getUserRatings(userId: number): Promise<Rating[]> {
    return await db
      .select()
      .from(ratings)
      .where(eq(ratings.userId, userId))
      .orderBy(desc(ratings.createdAt));
  }

  async getAlbumRatings(albumId: number): Promise<Rating[]> {
    return await db
      .select()
      .from(ratings)
      .where(eq(ratings.albumId, albumId))
      .orderBy(desc(ratings.createdAt));
  }

  async createOrUpdateRating(rating: InsertRating): Promise<Rating> {
    // First check if a rating already exists
    const existingRating = await this.getRating(rating.userId, rating.albumId);
    
    if (existingRating) {
      // Update existing rating
      const [updatedRating] = await db
        .update(ratings)
        .set({ rating: rating.rating })
        .where(eq(ratings.id, existingRating.id))
        .returning();
      return updatedRating;
    } else {
      // Create new rating
      const [newRating] = await db.insert(ratings).values(rating).returning();
      return newRating;
    }
  }

  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id));
    return review;
  }

  async getUserReviews(userId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async getAlbumReviews(albumId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.albumId, albumId))
      .orderBy(desc(reviews.createdAt));
  }

  async getRecentReviews(limit: number = 10): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.createdAt))
      .limit(limit);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const now = new Date();
    const reviewWithDates = {
      ...review,
      createdAt: now,
      updatedAt: now
    };
    const [newReview] = await db.insert(reviews).values(reviewWithDates).returning();
    return newReview;
  }

  async updateReview(id: number, content: string): Promise<Review | undefined> {
    const [updatedReview] = await db
      .update(reviews)
      .set({
        content,
        updatedAt: new Date()
      })
      .where(eq(reviews.id, id))
      .returning();
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, id));
    return !!result;
  }

  async getFollowers(userId: number): Promise<User[]> {
    const result = await db
      .select({
        user: users
      })
      .from(follows)
      .innerJoin(users, eq(follows.followerId, users.id))
      .where(eq(follows.followedId, userId));
    
    return result.map(item => item.user);
  }

  async getFollowing(userId: number): Promise<User[]> {
    const result = await db
      .select({
        user: users
      })
      .from(follows)
      .innerJoin(users, eq(follows.followedId, users.id))
      .where(eq(follows.followerId, userId));
    
    return result.map(item => item.user);
  }

  async isFollowing(followerId: number, followedId: number): Promise<boolean> {
    const result = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followedId, followedId)
        )
      );
    return result.length > 0;
  }

  async createFollow(follow: InsertFollow): Promise<Follow> {
    const [newFollow] = await db.insert(follows).values(follow).returning();
    return newFollow;
  }

  async deleteFollow(followerId: number, followedId: number): Promise<boolean> {
    const result = await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followedId, followedId)
        )
      );
    return !!result;
  }

  async getUserFavorites(userId: number): Promise<Favorite[]> {
    return await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId))
      .orderBy(asc(favorites.position));
  }

  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db.insert(favorites).values(favorite).returning();
    return newFavorite;
  }

  async updateFavoritePosition(id: number, position: number): Promise<Favorite | undefined> {
    const [updatedFavorite] = await db
      .update(favorites)
      .set({ position })
      .where(eq(favorites.id, id))
      .returning();
    return updatedFavorite;
  }

  async deleteFavorite(userId: number, albumId: number): Promise<boolean> {
    const result = await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.albumId, albumId)
        )
      );
    return !!result;
  }

  async getLikes(reviewId: number): Promise<Like[]> {
    return await db
      .select()
      .from(likes)
      .where(eq(likes.reviewId, reviewId));
  }

  async createLike(like: InsertLike): Promise<Like> {
    const [newLike] = await db.insert(likes).values(like).returning();
    return newLike;
  }

  async deleteLike(userId: number, reviewId: number): Promise<boolean> {
    const result = await db
      .delete(likes)
      .where(
        and(
          eq(likes.userId, userId),
          eq(likes.reviewId, reviewId)
        )
      );
    return !!result;
  }

  async getComments(reviewId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.reviewId, reviewId))
      .orderBy(asc(comments.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id));
    return !!result;
  }

  async getActivityFeed(userId: number, limit: number = 20): Promise<any[]> {
    const userRatings = await db
      .select({
        id: ratings.id,
        type: sql<string>`'rating'`.as('type'),
        userId: ratings.userId,
        createdAt: ratings.createdAt,
        albumId: ratings.albumId,
        rating: ratings.rating
      })
      .from(ratings)
      .where(eq(ratings.userId, userId))
      .orderBy(desc(ratings.createdAt))
      .limit(limit);

    const userReviews = await db
      .select({
        id: reviews.id,
        type: sql<string>`'review'`.as('type'),
        userId: reviews.userId,
        createdAt: reviews.createdAt,
        albumId: reviews.albumId
      })
      .from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);

    const userFavorites = await db
      .select({
        id: favorites.id,
        type: sql<string>`'favorite'`.as('type'),
        userId: favorites.userId,
        createdAt: favorites.createdAt,
        albumId: favorites.albumId
      })
      .from(favorites)
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt))
      .limit(limit);

    // Combine all activities
    const activities = [...userRatings, ...userReviews, ...userFavorites];
    
    // Sort by createdAt
    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Limit to requested number
    return activities.slice(0, limit);
  }

  async getNetworkActivityFeed(userId: number, limit: number = 20): Promise<any[]> {
    // Get users that the current user follows
    const followingUsers = await this.getFollowing(userId);
    const followingIds = followingUsers.map(user => user.id);
    
    if (followingIds.length === 0) {
      return [];
    }
    
    const networkRatings = await db
      .select({
        id: ratings.id,
        type: sql<string>`'rating'`.as('type'),
        userId: ratings.userId,
        createdAt: ratings.createdAt,
        albumId: ratings.albumId,
        rating: ratings.rating
      })
      .from(ratings)
      .where(sql`${ratings.userId} = ANY(ARRAY[${followingIds}])`)
      .orderBy(desc(ratings.createdAt))
      .limit(limit);

    const networkReviews = await db
      .select({
        id: reviews.id,
        type: sql<string>`'review'`.as('type'),
        userId: reviews.userId,
        createdAt: reviews.createdAt,
        albumId: reviews.albumId
      })
      .from(reviews)
      .where(sql`${reviews.userId} = ANY(ARRAY[${followingIds}])`)
      .orderBy(desc(reviews.createdAt))
      .limit(limit);

    const networkFavorites = await db
      .select({
        id: favorites.id,
        type: sql<string>`'favorite'`.as('type'),
        userId: favorites.userId,
        createdAt: favorites.createdAt,
        albumId: favorites.albumId
      })
      .from(favorites)
      .where(sql`${favorites.userId} = ANY(ARRAY[${followingIds}])`)
      .orderBy(desc(favorites.createdAt))
      .limit(limit);
    
    // Combine all activities
    const activities = [...networkRatings, ...networkReviews, ...networkFavorites];
    
    // Sort by createdAt
    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Limit to requested number
    return activities.slice(0, limit);
  }
}

// Use the DatabaseStorage implementation
export const storage = new DatabaseStorage();
