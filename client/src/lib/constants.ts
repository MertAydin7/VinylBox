// App information
export const APP_NAME = "Vinylbox";

// Rating configuration
export const RATING_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

// Default pagination limits
export const DEFAULT_PAGE_SIZE = 20;

// Sorting options
export const SORT_OPTIONS = {
  POPULAR: "popular",
  RECENT: "recent",
  RATING: "rating", 
  RELEASE_DATE: "year"
};

// Genre options
export const GENRES = [
  "Rock",
  "Hip Hop",
  "Electronic",
  "R&B",
  "Pop",
  "Jazz",
  "Classical",
  "Metal",
  "Country",
  "Folk",
  "Alternative",
  "Indie",
  "Soul",
  "Funk",
  "Reggae",
  "Blues"
];

// Decades for filtering
export const DECADES = [
  { label: "2020s", value: "2020" },
  { label: "2010s", value: "2010" },
  { label: "2000s", value: "2000" },
  { label: "1990s", value: "1990" },
  { label: "1980s", value: "1980" },
  { label: "1970s", value: "1970" },
  { label: "1960s", value: "1960" },
  { label: "1950s", value: "1950" }
];

// Album image placeholders
export const DEFAULT_ALBUM_IMAGE = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17";

// User avatar placeholders
export const DEFAULT_USER_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb";

// Review character limits
export const REVIEW_MAX_LENGTH = 5000;

// Favorite albums limit
export const MAX_FAVORITE_ALBUMS = 5;
