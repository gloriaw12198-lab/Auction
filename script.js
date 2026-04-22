
const API = "https://dummyjson.com/products";
const USD_TO_KES = 160;

let allProducts = [];

function convertToKES(usd) {
  return Math.round(usd * USD_TO_KES);
}

function isValidBid(currentPrice, bidAmount) {
  return bidAmount > currentPrice;
}
function saveBid(bids, id, amount) {
  return { ...bids, [id]: amount };
}
function login() {
  const user = document.getElementById("username")?.value;
  const pass = document.getElementById("password")?.value;
  const error = document.getElementById("error");

  if (user === "admin" && pass === "1234") {
    localStorage.setItem("admin", "true");
    window.location.href = "dashboard.html";
  } else if (error) {
    error.innerText = "Invalid login";
  }
}

function protectAdmin() {
  if (
    typeof window !== "undefined" &&
    window.location.pathname.includes("dashboard") &&
    !localStorage.getItem("admin")
  ) {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("admin");
  window.location.href = "login.html";
}

/* =======================
   AUCTIONS
======================= */

async function loadAuctions() {
  const container = document.getElementById("auctions");
  if (!container) return;

  try {
    const res = await fetch(API);
    const data = await res.json();

    allProducts = data.products;
    displayProducts(allProducts);

  } catch (err) {
    container.innerHTML = "<p>Error loading auctions</p>";
  }
}

function displayProducts(products) {
  const container = document.getElementById("auctions");
  if (!container) return;

  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No items found</p>";
    return;
  }

  products.forEach(item => {
    const price = convertToKES(item.price);

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${item.title}</h3>
      <p><strong>Category:</strong> ${item.category}</p>
      <p><strong>Rating:</strong> ⭐ ${item.rating}</p>
      <p><strong>Price:</strong> KSh ${price.toLocaleString()}</p>
      <button onclick="bid(${price}, ${item.id})">Place Bid</button>
    `;

    container.appendChild(div);
  });
}
function searchProducts() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  const query = input.value.toLowerCase();

  const filtered = allProducts.filter(item =>
    item.title.toLowerCase().includes(query)
  );

  displayProducts(filtered);
}

function bid(currentPrice, id) {
  const amount = Number(prompt("Enter your bid in KSh:"));

  if (isValidBid(currentPrice, amount)) {
    let bids = JSON.parse(localStorage.getItem("bids")) || {};

    bids = saveBid(bids, id, amount);

    localStorage.setItem("bids", JSON.stringify(bids));

    alert("Bid placed successfully!");
  } else {
    alert("Bid must be higher than current price!");
  }
}
function loadDashboard() {
  const total = document.getElementById("totalBids");
  const highest = document.getElementById("highestBid");
  const list = document.getElementById("bidList");

  if (!total || !highest || !list) return;

  const bids = JSON.parse(localStorage.getItem("bids")) || {};
  const values = Object.values(bids);

  total.innerText = values.length;
  highest.innerText = "KSh " + (values.length ? Math.max(...values) : 0);

  list.innerHTML = "";

  if (values.length === 0) {
    list.innerHTML = "<p>No bids yet</p>";
    return;
  }

  Object.entries(bids).forEach(([id, amount]) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p><strong>Item ${id}</strong></p>
      <p>Bid: KSh ${amount.toLocaleString()}</p>
      <button onclick="deleteBid('${id}')">Delete</button>
    `;

    list.appendChild(div);
  });
  if (!document.getElementById("clearBtn")) {
    const btn = document.createElement("button");
    btn.id = "clearBtn";
    btn.innerText = "Clear All Bids";
    btn.onclick = clearBids;

    document.body.appendChild(btn);
  }
}

function deleteBid(id) {
  let bids = JSON.parse(localStorage.getItem("bids")) || {};
  delete bids[id];
  localStorage.setItem("bids", JSON.stringify(bids));
  loadDashboard();
}

function clearBids() {
  localStorage.removeItem("bids");
  loadDashboard();
}
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    protectAdmin();
    loadAuctions();
    loadDashboard();

    const search = document.getElementById("searchInput");
    if (search) {
      search.addEventListener("input", searchProducts);
    }
  });
}
if (typeof module !== "undefined") {
  module.exports = {
    convertToKES,
    isValidBid,
    saveBid
  };
}