const auctions = {}; // track bids per item

document.querySelectorAll('.auction-item').forEach(item => {
  const id = item.dataset.id;
  const startingBid = parseFloat(item.dataset.startingBid);
  const form = item.querySelector('.bid-form');
  const nameInput = item.querySelector('.bid-name');
  const amountInput = item.querySelector('.bid-amount');
  const bidList = item.querySelector('.bid-history');
  const currentBidEl = item.querySelector('.current-bid');

  // Initialize bid tracking
  if (!auctions[id]) {
    auctions[id] = [];
    currentBidEl.textContent = `$${startingBid}`;
  }

  const updateBidDisplay = () => {
    const bids = auctions[id];
    if (bids.length > 0) {
      const top = Math.max(...bids.map(b => b.amount));
      currentBidEl.textContent = `$${top}`;
    } else {
      currentBidEl.textContent = `$${startingBid}`;
    }

    bidList.innerHTML = "";
    bids.slice().reverse().forEach((bid, index) => {
      const li = document.createElement("li");
      li.textContent = `$${bid.amount} — ${new Date(bid.time).toLocaleTimeString()}`;
      bidList.appendChild(li);
    });
  };

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);

    const topBid = auctions[id].length > 0
      ? Math.max(...auctions[id].map(b => b.amount))
      : startingBid;

    if (amount <= topBid) {
      alert(`Your bid must be higher than the current bid of $${topBid}.`);
      return;
    }

    auctions[id].push({
      name,
      amount,
      time: new Date().toISOString()
    });

    nameInput.value = "";
    amountInput.value = "";
    updateBidDisplay();
  });

  updateBidDisplay();
});
