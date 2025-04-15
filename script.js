const auctionItems = [
  { id: 'item1', startingBid: 3000 },
  { id: 'item2', startingBid: 4000 },
  { id: 'item3', startingBid: 5000 }
];

const auctions = {}; // track bids per item

auctionItems.forEach(item => {
  const { id, startingBid } = item;
  const auctionElement = document.querySelector(`.auction-item[data-id='${id}']`);
  const form = auctionElement.querySelector('.bid-form');
  const amountInput = auctionElement.querySelector('.bid-amount');
  const bidList = auctionElement.querySelector('.bid-history');
  const currentBidEl = auctionElement.querySelector('.current-bid');

  // Initialize bid tracking
  if (!auctions[id]) {
    auctions[id] = [];
    currentBidEl.textContent = `$${startingBid}`;
  }

  const updateBidDisplay = () => {
    const bids = auctions[id];
    if (bids.length > 0) {
      const topBid = Math.max(...bids.map(b => b.amount));
      currentBidEl.textContent = `$${topBid}`;
    } else {
      currentBidEl.textContent = `$${startingBid}`;
    }

    bidList.innerHTML = "";
    bids.slice().reverse().forEach(bid => {
      const li = document.createElement("li");
      li.textContent = `$${bid.amount}`; // Display only the amount
      bidList.appendChild(li);
    });
  };

  form.addEventListener("submit", e => {
    e.preventDefault();
    const amount = parseFloat(amountInput.value);

    const topBid = auctions[id].length > 0
      ? Math.max(...auctions[id].map(b => b.amount))
      : startingBid;

    if (amount <= topBid) {
      alert(`Your bid must be higher than the current bid of $${topBid}.`);
      return;
    }

    auctions[id].push({
      amount,
      time: new Date().toISOString(),
      // Store the name internally for tracking
      name: form.querySelector('.bid-name').value.trim()
    });

    amountInput.value = "";
    updateBidDisplay();
  });

  updateBidDisplay();
});
