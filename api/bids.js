const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://limpatience.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { name, email, bidAmount, product } = req.body;

    if (!name || !email || !bidAmount || !product) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }

    try {
      const parsed = parseFloat(bidAmount);
      const { error } = await supabase
        .from('bids')
        .insert([{ name, email, bidAmount: parsed, product }]);

      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'GET') {
    const product = req.query.product;
    if (!product) return res.status(400).json({ error: 'Missing product' });

    try {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('product', product)
        .order('bidAmount', { ascending: false })
        .limit(1);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ highestBid: data[0] || null });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
