let bids = []; // In-memory storage — will reset on each deploy or cold start

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, bidAmount, product } = req.body;

      if (!name || !email || !bidAmount || !product) {
        return res.status(400).json({ error: 'Missing fields' });
      }

      const newBid = {
        name,
        email,
        bidAmount: parseFloat(bidAmount),
        product,
        time: new Date().toISOString()
      };

      bids.push(newBid);

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Error saving bid:', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  if (req.method === 'GET') {
    const product = req.query.product;
    if (!product) return res.status(400).json({ error: 'Missing product' });

    const filtered = bids
      .filter(b => b.product === product)
      .sort((a, b) => b.bidAmount - a.bidAmount);

    return res.status(200).json({ highestBid: filtered[0] || null });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
