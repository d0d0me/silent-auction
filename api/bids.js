const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pwbpbfecmsmjvhdntdix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3YnBiZmVjbXNtanZoZG50ZGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MTYxMzQsImV4cCI6MjA2MDM5MjEzNH0.m8EYVje9suxMqdId2QjMBdcVtMvybBYQDKA5GavVdS4';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://limpatience.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { name, email, bidAmount, product } = req.body;

    if (!name || !email || !bidAmount || !product) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { error } = await supabase.from('bids').insert([{
      name,
      email,
      bidAmount: parseFloat(bidAmount),
      product,
    }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ success: false, error: 'Failed to save bid' });
    }

    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    const product = req.query.product;
    if (!product) return res.status(400).json({ error: 'Missing product' });

    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('product', product)
      .order('bidAmount', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch bids' });
    }

    return res.status(200).json({ highestBid: data[0] || null });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
