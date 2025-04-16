const { createClient } = require('@supabase/supabase-js');

// ✅ Your Supabase credentials
const supabase = createClient(
  'https://pwbpbfecmsmjvhdntdix.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3YnBiZmVjbXNtanZoZG50ZGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MTYxMzQsImV4cCI6MjA2MDM5MjEzNH0.m8EYVje9suxMqdId2QjMBdcVtMvybBYQDKA5GavVdS4'
);

module.exports = async function handler(req, res) {
  // ✅ Enable CORS for Shopify
  res.setHeader('Access-Control-Allow-Origin', 'https://limpatience.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ✅ POST: Submit a new bid
  if (req.method === 'POST') {
    const { name, email, bidAmount, product } = req.body;
  
    if (!name || !email || !bidAmount || !product) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }
  
    try {
      const parsed = parseFloat(bidAmount);
      const { data, error } = await supabase.from('bids').insert([
        {
          name,
          email,
          bidAmount: parsed,
          product,
        }
      ]);
  
      if (error) {
        // ✅ Show the exact error in browser response
        return res.status(500).json({ success: false, error: error.message });
      }
  
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  
  

  // ✅ GET: Return highest bid for a given product
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
        console.error('❌ Supabase fetch error:', error);
        return res.status(500).json({ error: error.message || 'Failed to fetch bids' });
      }

      return res.status(200).json({ highestBid: data[0] || null });
    } catch (err) {
      console.error('❌ Unexpected GET error:', err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
