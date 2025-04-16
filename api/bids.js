let bids = [];

export default async function handler(req, res) {
  if (req.method === 'POST') {
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
  }
