import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

const DEFAULT_DB_NAME = 'flashcard-app';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || DEFAULT_DB_NAME;
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    // Find or create user
    let user = await usersCollection.findOne({ email: session.user.email });
    
    if (!user) {
      // Create new user if doesn't exist
      const newUser = {
        email: session.user.email,
        name: session.user.name || '',
        createdAt: new Date(),
        statistics: {
          cardsStudied: 0,
          totalStudyTime: 0,
          lastStudySession: null
        }
      };

      const result = await usersCollection.insertOne(newUser);
      user = {
        ...newUser,
        _id: result.insertedId
      };
    }

    // Get stats
    const [cardsCount, decksCount] = await Promise.all([
      db.collection('flashcards').countDocuments({ 
        userId: new ObjectId(user._id.toString()) 
      }),
      db.collection('decks').countDocuments({ 
        userId: new ObjectId(user._id.toString()) 
      })
    ]);

    // Return stats
    const stats = {
      totalCards: cardsCount,
      totalDecks: decksCount,
      cardsStudied: user.statistics?.cardsStudied || 0,
      studyTime: user.statistics?.totalStudyTime || 0,
      lastStudySession: user.statistics?.lastStudySession || null,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in stats API:', error);
    res.status(500).json({ 
      error: 'Error fetching statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
