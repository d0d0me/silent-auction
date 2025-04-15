let bids = JSON.parse(localStorage.getItem("bids")) || [];

const form = document.getElementById("bidForm");
const bidHistory = document.getElementById("bidHistory");
const currentBid = document.getElementById("currentBid");

function updateDisplay() {
  bidHistory.innerHTML = "";
  if (bids.length > 0) {
    const topBid = Math.max(...bids.map(b => b.amount));
    currentBid.textContent = `$${topBid}`;
  } else {
    currentBid.textContent = "$0";
  }

  bids
    .sort((a, b) => b.amount - a.amount)
    .forEach(bid => {
      const li = document.createElement("li");
      li.textContent = `$${bid.amount} — ${new Date(bid.time).toLocaleTimeString()}`;
      bidHistory.appendChild(li);
    });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (isNaN(amount) || amount <= 0) return alert("Enter a valid bid.");

  bids.push({
    name: name,
    amount: amount,
    time: new Date().toISOString()
  });

  localStorage.setItem("bids", JSON.stringify(bids));
  form.reset();
  updateDisplay();
});

updateDisplay();
