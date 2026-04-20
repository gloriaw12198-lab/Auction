const API = "https://dummyjson.com/products";
const USD_TO_KES = 160;

document.addEventListener("DOMContentLoaded", () => {
  loadAuctions();   // runs only on auction page
  loadDashboard();  // runs only on dashboard page
});


// 🛒 AUCTIONS PAGE
async function loadAuctions() {
  const container = document.getElementById("auctions");
  if (!container) return; // prevents running on other pages

  const res = await fetch(API);
  const data = await res.json();

  container.innerHTML = "";

  data.products.slice(0, 9).forEach(item => {
    const priceKES = Math.round(item.price * USD_TO_KES);

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${item.title}</h3>
      <p>Starting Price: KSh ${priceKES.toLocaleString()}</p>

      <input id="bid-${item.id}" type="number" placeholder="Your bid (KSh)">
      <button onclick="bid(${priceKES}, ${item.id})">Place Bid</button>
    `;

    container.appendChild(div);
  });
}


// 💰 SAVE BID (localStorage)
function bid(currentPrice, id) {
  const amount = Number(prompt("Enter your bid in KSh:"));

  if (amount > currentPrice) {
    alert("Bid accepted!");

    let bids = JSON.parse(localStorage.getItem("bids")) || {};
    bids[id] = amount;

    localStorage.setItem("bids", JSON.stringify(bids));
  } else {
    alert("Bid too low!");
  }
}


// 📊 DASHBOARD PAGE
function loadDashboard() {
  const totalBids = document.getElementById("totalBids");
  const highestBid = document.getElementById("highestBid");
  const bidList = document.getElementById("bidList");

  // prevent running on other pages
  if (!totalBids || !highestBid || !bidList) return;

  const bids = JSON.parse(localStorage.getItem("bids")) || {};
  const values = Object.values(bids);

  totalBids.innerText = values.length;

  const highest = values.length ? Math.max(...values) : 0;
  highestBid.innerText = "KSh " + highest.toLocaleString();

  bidList.innerHTML = "";

  if (!values.length) {
    bidList.innerHTML = "<p>No bids yet</p>";
    return;
  }

  Object.entries(bids).forEach(([id, amount]) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h4>Item ID: ${id}</h4>
      <p>Bid: KSh ${amount.toLocaleString()}</p>
    `;

    bidList.appendChild(card);
  });
}