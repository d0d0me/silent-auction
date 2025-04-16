export default async function handler(req, res) {
  if (req.method === 'GET') {
    const product = req.query.product || 'Unknown';
    return res.status(200).json({
      highestBid: {
        product,
        bidAmount: 4200
      }
    });
  }

  if (req.method === 'POST') {
    try {
      const { name, email, bidAmount, product } = req.body;

      if (!name || !email || !bidAmount || !product) {
        return res.status(400).json({ error: 'Missing fields' });
      }

      console.log("Received bid:", { name, email, bidAmount, product });

      // Just pretend it's stored and return OK
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("POST ERROR:", err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
