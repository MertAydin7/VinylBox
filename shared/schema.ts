import { pgTable, text, serial, integer, timestamp, boolean, doublePrecision, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Albums table
export const albums = pgTable("albums", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  releaseYear: integer("release_year").notNull(),
  coverImage: text("cover_image").notNull(),
  genre: text("genre"),
  label: text("label"),
});

// Tracks table
export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  albumId: integer("album_id").notNull(),
  title: text("title").notNull(),
  duration: text("duration"),
  trackNumber: integer("track_number"),
});

// Ratings table
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  albumId: integer("album_id").notNull(),
  rating: doublePrecision("rating").notNull(), // 0.5 to 5.0 in 0.5 increments
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  albumId: integer("album_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Follows table
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull(),
  followedId: integer("followed_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Favorites table (for top 5 albums)
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  albumId: integer("album_id").notNull(),
  position: integer("position").notNull(), // 1-5 for ranking
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Likes table (for liking reviews)
export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  reviewId: integer("review_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Comments table (for commenting on reviews)
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  reviewId: integer("review_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertAlbumSchema = createInsertSchema(albums).omit({ id: true });
export const insertTrackSchema = createInsertSchema(tracks).omit({ id: true });
export const insertRatingSchema = createInsertSchema(ratings).omit({ id: true, createdAt: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFollowSchema = createInsertSchema(follows).omit({ id: true, createdAt: true });
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true, createdAt: true });
export const insertLikeSchema = createInsertSchema(likes).omit({ id: true, createdAt: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Album = typeof albums.$inferSelect;
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;

export type Track = typeof tracks.$inferSelect;
export type InsertTrack = z.infer<typeof insertTrackSchema>;

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

export type Like = typeof likes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

// Custom types for frontend
export type AlbumWithRating = Album & {
  averageRating?: number;
  userRating?: number;
  ratingCount?: number;
};

export type UserProfile = User & {
  albumCount?: number;
  reviewCount?: number;
  followingCount?: number;
  followerCount?: number;
  favoriteAlbums?: AlbumWithRating[];
  isFollowing?: boolean;
};

export type ReviewWithUser = Review & {
  user: User;
  likeCount?: number;
  commentCount?: number;
  userLiked?: boolean;
  album?: Album;
};

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  ratings: many(ratings),
  reviews: many(reviews),
  followedBy: many(follows, { relationName: "followed" }),
  following: many(follows, { relationName: "follower" }),
  favorites: many(favorites),
  likes: many(likes),
  comments: many(comments)
}));

export const albumsRelations = relations(albums, ({ many }) => ({
  tracks: many(tracks),
  ratings: many(ratings),
  reviews: many(reviews),
  favorites: many(favorites)
}));

export const tracksRelations = relations(tracks, ({ one }) => ({
  album: one(albums, {
    fields: [tracks.albumId],
    references: [albums.id]
  })
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  user: one(users, {
    fields: [ratings.userId],
    references: [users.id]
  }),
  album: one(albums, {
    fields: [ratings.albumId],
    references: [albums.id]
  })
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id]
  }),
  album: one(albums, {
    fields: [reviews.albumId],
    references: [albums.id]
  }),
  likes: many(likes),
  comments: many(comments)
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "follower"
  }),
  followed: one(users, {
    fields: [follows.followedId],
    references: [users.id],
    relationName: "followed"
  })
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id]
  }),
  album: one(albums, {
    fields: [favorites.albumId],
    references: [albums.id]
  })
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id]
  }),
  review: one(reviews, {
    fields: [likes.reviewId],
    references: [reviews.id]
  })
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id]
  }),
  review: one(reviews, {
    fields: [comments.reviewId],
    references: [reviews.id]
  })
}));
