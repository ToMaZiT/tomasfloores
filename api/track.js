import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Si la variable no existe, el error saltará aquí
  if (!uri) {
    return res.status(500).json({ error: 'Falta la variable MONGODB_URI en Vercel' });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('analytics');
    const collection = db.collection('visits');

    await collection.insertOne({
      fecha: new Date(),
      pais: req.headers['x-vercel-ip-country'] || 'Local',
      ciudad: req.headers['x-vercel-ip-city'] || 'Local',
      ua: req.headers['user-agent']
    });

    return res.status(200).json({ success: true });
  } catch (e) {
    // Esto nos dirá en la consola del navegador por qué falló exactamente
    return res.status(500).json({ 
      error: 'Error de conexión a MongoDB', 
      message: e.message 
    });
  } finally {
    await client.close();
  }
}