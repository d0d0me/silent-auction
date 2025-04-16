import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./data/bids.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, bidAmount, product } = req.body;

    if (!name || !email || !bidAmount || !product) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const bids = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const newBid = {
      name,
      email,
      bidAmount: parseFloat(bidAmount),
      product,
      time: new Date().toISOString()
    };

    bids.push(newBid);
    fs.writeFileSync(filePath, JSON.stringify(bids, null, 2));
    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    const bids = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const product = req.query.product;

    if (!product) return res.status(400).json({ error: 'Missing product' });

    const filtered = bids
      .filter(b => b.product === product)
      .sort((a, b) => b.bidAmount - a.bidAmount);

    return res.status(200).json({ highestBid: filtered[0] || null });
  }

  return res.status(405).end(); // Method Not Allowed
}
