import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';

/**
 * Діагностика фільтрації для клієнтів та угод
 * GET /api/admin/debug-filter?agent_id=xxx&role=agent
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { agent_id, role } = req.query;
    const { db } = await connectToDatabase();

    // Перевіряємо клієнтів
    const clientsCollection = db.collection('clients');
    const allClients = await clientsCollection.find({}).toArray();
    
    const clientsQuery: any = {};
    if (role === 'agent' && agent_id) {
      clientsQuery['created_by.admin_id'] = agent_id;
    }
    const filteredClients = await clientsCollection.find(clientsQuery).toArray();

    // Перевіряємо угоди
    const dealsCollection = db.collection('deals');
    const allDeals = await dealsCollection.find({}).toArray();
    
    const dealsQuery: any = {};
    if (role === 'agent' && agent_id) {
      dealsQuery['created_by.admin_id'] = agent_id;
    }
    const filteredDeals = await dealsCollection.find(dealsQuery).toArray();

    return res.status(200).json({
      success: true,
      input: {
        agent_id,
        role,
      },
      clients: {
        total: allClients.length,
        filtered: filteredClients.length,
        withCreatedBy: allClients.filter(c => c.created_by).length,
        withoutCreatedBy: allClients.filter(c => !c.created_by).length,
        sample: allClients.slice(0, 3).map(c => ({
          _id: c._id,
          first_name: c.first_name,
          last_name: c.last_name,
          created_by: c.created_by || 'НЕМАЄ',
        })),
      },
      deals: {
        total: allDeals.length,
        filtered: filteredDeals.length,
        withCreatedBy: allDeals.filter(d => d.created_by).length,
        withoutCreatedBy: allDeals.filter(d => !d.created_by).length,
        sample: allDeals.slice(0, 3).map(d => ({
          _id: d._id,
          buyer_name: d.buyer_name,
          status: d.status,
          created_by: d.created_by || 'НЕМАЄ',
        })),
      },
    });

  } catch (error) {
    console.error('Debug error:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка діагностики',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

