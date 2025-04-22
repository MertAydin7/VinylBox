import { db } from './db';
import { users, albums, tracks, ratings, reviews, follows, favorites } from '@shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Seed the database with initial data
 */
async function seed() {
  console.log('🌱 Seeding database...');

  // First check if we already have data
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log('Database already has data, skipping seed.');
    return;
  }

  // Create users
  console.log('Creating users...');
  const [sophie] = await db.insert(users).values([
    {
      username: 'sophie',
      displayName: 'Sophie Anderson',
      email: 'sophie@example.com',
      password: 'password123', // In a real app, this would be hashed
      bio: 'Music enthusiast with a love for indie, electronic, and hip-hop. Always on the lookout for hidden gems and new sounds.',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128'
    }
  ]).returning();

  const [michael] = await db.insert(users).values([
    {
      username: 'michael',
      displayName: 'Michael Reed',
      email: 'michael@example.com',
      password: 'password123',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48'
    }
  ]).returning();

  const [emma] = await db.insert(users).values([
    {
      username: 'emma',
      displayName: 'Emma Wilson',
      email: 'emma@example.com',
      password: 'password123',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48'
    }
  ]).returning();

  const [david] = await db.insert(users).values([
    {
      username: 'david',
      displayName: 'David Chen',
      email: 'david@example.com',
      password: 'password123',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48'
    }
  ]).returning();

  const [sarah] = await db.insert(users).values([
    {
      username: 'sarah',
      displayName: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: 'password123',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48'
    }
  ]).returning();

  const [james] = await db.insert(users).values([
    {
      username: 'james',
      displayName: 'James Wilson',
      email: 'james@example.com',
      password: 'password123',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48'
    }
  ]).returning();

  // Create albums
  console.log('Creating albums...');
  const [dawnFM] = await db.insert(albums).values([
    {
      title: 'Dawn FM',
      artist: 'The Weeknd',
      releaseYear: 2022,
      coverImage: 'https://images.unsplash.com/photo-1606880145171-96fd7e3b40f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      genre: 'R&B, Synth-pop',
      label: 'XO'
    }
  ]).returning();

  const [darkSide] = await db.insert(albums).values([
    {
      title: 'The Dark Side of the Moon',
      artist: 'Pink Floyd',
      releaseYear: 1973,
      coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      genre: 'Progressive Rock',
      label: 'Harvest Records'
    }
  ]).returning();

  const [sos] = await db.insert(albums).values([
    {
      title: 'SOS',
      artist: 'SZA',
      releaseYear: 2022,
      coverImage: 'https://images.unsplash.com/photo-1671726805768-575bf28d7dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      genre: 'R&B, Soul',
      label: 'Top Dawg Entertainment'
    }
  ]).returning();

  const [renaissance] = await db.insert(albums).values([
    {
      title: 'RENAISSANCE',
      artist: 'Beyoncé',
      releaseYear: 2022,
      coverImage: 'https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      genre: 'Dance, Pop',
      label: 'Parkwood Entertainment'
    }
  ]).returning();

  const [blonde] = await db.insert(albums).values([
    {
      title: 'Blonde',
      artist: 'Frank Ocean',
      releaseYear: 2016,
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      genre: 'R&B, Soul, Experimental',
      label: 'Boys Don\'t Cry'
    }
  ]).returning();

  const [channelOrange] = await db.insert(albums).values([
    {
      title: 'Channel Orange',
      artist: 'Frank Ocean',
      releaseYear: 2012,
      coverImage: 'https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      genre: 'R&B, Soul',
      label: 'Def Jam Recordings'
    }
  ]).returning();

  const [nostalgiaUltra] = await db.insert(albums).values([
    {
      title: 'Nostalgia, Ultra',
      artist: 'Frank Ocean',
      releaseYear: 2011,
      coverImage: 'https://images.unsplash.com/photo-1671726805768-575bf28d7dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      genre: 'R&B, Alternative R&B',
      label: 'Self-released'
    }
  ]).returning();

  const [igor] = await db.insert(albums).values([
    {
      title: 'IGOR',
      artist: 'Tyler, The Creator',
      releaseYear: 2019,
      coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      genre: 'Hip Hop, Neo Soul',
      label: 'Columbia Records'
    }
  ]).returning();

  // Create tracks for Blonde
  console.log('Creating tracks...');
  await db.insert(tracks).values([
    { albumId: blonde.id, title: 'Nikes', duration: '5:14', trackNumber: 1 },
    { albumId: blonde.id, title: 'Ivy', duration: '4:09', trackNumber: 2 },
    { albumId: blonde.id, title: 'Pink + White', duration: '3:04', trackNumber: 3 },
    { albumId: blonde.id, title: 'Be Yourself', duration: '1:26', trackNumber: 4 },
    { albumId: blonde.id, title: 'Solo', duration: '4:17', trackNumber: 5 },
    { albumId: blonde.id, title: 'Skyline To', duration: '3:04', trackNumber: 6 },
    { albumId: blonde.id, title: 'Self Control', duration: '4:09', trackNumber: 7 },
    { albumId: blonde.id, title: 'Good Guy', duration: '1:06', trackNumber: 8 },
    { albumId: blonde.id, title: 'Nights', duration: '5:07', trackNumber: 9 },
    { albumId: blonde.id, title: 'Solo (Reprise)', duration: '1:18', trackNumber: 10 },
  ]);

  // Add some tracks for other albums
  await db.insert(tracks).values([
    { albumId: dawnFM.id, title: 'Dawn FM', duration: '1:37', trackNumber: 1 },
    { albumId: dawnFM.id, title: 'Gasoline', duration: '3:33', trackNumber: 2 },
    { albumId: dawnFM.id, title: 'How Do I Make You Love Me?', duration: '3:35', trackNumber: 3 },
    { albumId: dawnFM.id, title: 'Take My Breath', duration: '5:39', trackNumber: 4 },
    { albumId: dawnFM.id, title: 'Sacrifice', duration: '4:09', trackNumber: 5 },
  ]);

  await db.insert(tracks).values([
    { albumId: darkSide.id, title: 'Speak to Me', duration: '1:13', trackNumber: 1 },
    { albumId: darkSide.id, title: 'Breathe', duration: '2:43', trackNumber: 2 },
    { albumId: darkSide.id, title: 'On the Run', duration: '3:36', trackNumber: 3 },
    { albumId: darkSide.id, title: 'Time', duration: '7:06', trackNumber: 4 },
    { albumId: darkSide.id, title: 'The Great Gig in the Sky', duration: '4:47', trackNumber: 5 },
  ]);

  // Create ratings
  console.log('Creating ratings...');
  await db.insert(ratings).values([
    { userId: sophie.id, albumId: blonde.id, rating: 5 },
    { userId: sophie.id, albumId: dawnFM.id, rating: 4.5 },
    { userId: sophie.id, albumId: darkSide.id, rating: 5 },
    { userId: sophie.id, albumId: sos.id, rating: 4.5 },
    { userId: sophie.id, albumId: renaissance.id, rating: 4.5 },
    { userId: michael.id, albumId: blonde.id, rating: 4 },
    { userId: michael.id, albumId: dawnFM.id, rating: 3.5 },
    { userId: emma.id, albumId: sos.id, rating: 5 },
    { userId: emma.id, albumId: renaissance.id, rating: 5 },
    { userId: david.id, albumId: darkSide.id, rating: 5 },
    { userId: david.id, albumId: blonde.id, rating: 4.5 },
  ]);

  // Create reviews
  console.log('Creating reviews...');
  await db.insert(reviews).values([
    {
      userId: sophie.id,
      albumId: blonde.id,
      content: "Frank Ocean's 'Blonde' is a masterpiece of introspective R&B. The album creates a dreamlike atmosphere with its minimalist production and Ocean's vulnerable vocals. Tracks like 'Nikes,' 'Ivy,' and 'Self Control' showcase his ability to evoke emotion through both lyrics and sound. The album can feel challenging at times, but that's part of what makes this album so special."
    },
    {
      userId: michael.id,
      albumId: blonde.id,
      content: "While I appreciate the artistic merit of 'Blonde,' I found some parts to be a bit too experimental for my taste. That said, songs like 'Pink + White' and 'Nights' are absolutely incredible. Frank Ocean's vocal performance throughout is captivating, and the production is clearly meticulously crafted."
    },
    {
      userId: sophie.id,
      albumId: darkSide.id,
      content: "A timeless masterpiece. 'The Dark Side of the Moon' creates a sonic journey that remains as powerful today as it was in 1973. The transitions between tracks, the lyrical themes exploring the human condition, and the innovative use of synthesizers make this album essential listening for anyone who appreciates music as an art form."
    },
    {
      userId: emma.id,
      albumId: sos.id,
      content: "SZA's vulnerability and honesty shine through on 'SOS.' Her ability to blend genres while maintaining a cohesive sound is impressive. Standout tracks include 'Kill Bill,' 'Shirt,' and 'Nobody Gets Me.' A fantastic follow-up to 'Ctrl' that shows her artistic growth."
    }
  ]);

  // Set up favorite albums
  console.log('Creating favorites...');
  await db.insert(favorites).values([
    { userId: sophie.id, albumId: blonde.id, position: 1 },
    { userId: sophie.id, albumId: darkSide.id, position: 2 },
    { userId: sophie.id, albumId: renaissance.id, position: 3 },
    { userId: sophie.id, albumId: sos.id, position: 4 },
    { userId: michael.id, albumId: igor.id, position: 1 },
    { userId: michael.id, albumId: darkSide.id, position: 2 },
    { userId: michael.id, albumId: dawnFM.id, position: 3 },
  ]);

  // Set up follows
  console.log('Creating follows...');
  await db.insert(follows).values([
    { followerId: sophie.id, followedId: michael.id },
    { followerId: sophie.id, followedId: emma.id },
    { followerId: michael.id, followedId: sophie.id },
    { followerId: michael.id, followedId: david.id },
    { followerId: emma.id, followedId: sophie.id },
    { followerId: david.id, followedId: sophie.id },
    { followerId: sarah.id, followedId: sophie.id },
    { followerId: james.id, followedId: sophie.id },
  ]);

  console.log('✅ Seeding complete!');
}

// Execute the seed function
seed().catch(error => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});