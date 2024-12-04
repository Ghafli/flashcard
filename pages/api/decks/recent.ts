import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import clientPromise from '../../../lib/mongodb';
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

    // Find user
    const user = await db.collection('users').findOne({ 
      email: session.user.email 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get recent decks with card count
    const recentDecks = await db.collection('decks')
      .aggregate([
        { 
          $match: { 
            userId: new ObjectId(user._id.toString()) 
          } 
        },
        {
          $lookup: {
            from: 'flashcards',
            localField: '_id',
            foreignField: 'deckId',
            as: 'cards'
          }
        },
        {
          $lookup: {
            from: 'studyHistory',
            let: { deckId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$deckId', '$$deckId'] },
                      { $eq: ['$userId', new ObjectId(user._id.toString())] }
                    ]
                  }
                }
              },
              { $sort: { studiedAt: -1 } },
              { $limit: 1 }
            ],
            as: 'lastStudySession'
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            cardCount: { $size: '$cards' },
            lastStudied: { $arrayElemAt: ['$lastStudySession.studiedAt', 0] },
            createdAt: 1
          }
        },
        { $sort: { lastStudied: -1, createdAt: -1 } },
        { $limit: 5 }
      ])
      .toArray();

    // If no decks found, return empty array
    if (!recentDecks.length) {
      return res.status(200).json([]);
    }

    res.status(200).json(recentDecks);
  } catch (error) {
    console.error('Error in recent decks API:', error);
    res.status(500).json({ 
      error: 'Error fetching recent decks',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
