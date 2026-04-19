const API = "https://dummyjson.com/products";
const USD_TO_KES = 160;

document.addEventListener("DOMContentLoaded", () => {
  loadAuctions();
});

async function loadAuctions() {
  const container = document.getElementById("auctions");

  if (!container) return;

  try {
    const res = await fetch(API);
    const data = await res.json();

    container.innerHTML = "";

    data.products.slice(0, 9).forEach(item => {
      
      const priceKES = Math.round(item.price * USD_TO_KES);

      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${item.title}</h3>
        <p>Starting Price: KSh ${priceKES}</p>

        <input id="bid-${item.id}" type="number" placeholder="Your bid (KSh)">
        <button onclick="bid(${priceKES})">Place Bid</button>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading auctions:", err);
  }
}

function bid(currentPrice) {
  const amount = Number(prompt("Enter your bid in KSh:"));

  if (amount > currentPrice) {
    alert("Bid accepted!");
  } else {
    alert("Bid too low!");
  }
}