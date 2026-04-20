const API = "https://dummyjson.com/products";
const USD_TO_KES = 129;


function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const error = document.getElementById("error");

  if (user === "admin" && pass === "1234") {
    localStorage.setItem("admin", "true");
    window.location.href = "dashboard.html";
  } else {
    error.innerText = "Invalid credentials";
  }
}

function protectAdmin() {
  const isAdmin = localStorage.getItem("admin");
  if (!isAdmin && window.location.pathname.includes("dashboard")) {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("admin");
  window.location.href = "login.html";
}


document.addEventListener("DOMContentLoaded", () => {
  protectAdmin();
  loadAuctions();
  loadDashboard();
});

async function loadAuctions() {
  const container = document.getElementById("auctions");
  if (!container) return;

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
      <button onclick="bid(${priceKES}, ${item.id})">Place Bid</button>
    `;

    container.appendChild(div);
  });
}

function bid(currentPrice, id) {
  const amount = Number(prompt("Enter your bid in KSh:"));

  if (amount > currentPrice) {
    let bids = JSON.parse(localStorage.getItem("bids")) || {};
    bids[id] = amount;
    localStorage.setItem("bids", JSON.stringify(bids));
    alert("Bid accepted!");
  } else {
    alert("Bid too low!");
  }
}

/* ---------------- DASHBOARD ---------------- */

function loadDashboard() {
  const totalBids = document.getElementById("totalBids");
  const highestBid = document.getElementById("highestBid");
  const bidList = document.getElementById("bidList");

  if (!totalBids || !highestBid || !bidList) return;

  const bids = JSON.parse(localStorage.getItem("bids")) || {};
  const values = Object.values(bids);

  totalBids.innerText = values.length;
  highestBid.innerText = "KSh " + (values.length ? Math.max(...values) : 0).toLocaleString();

  bidList.innerHTML = "";

  if (values.length === 0) {
    bidList.innerHTML = "<p>No bids yet</p>";
    return;
  }

  Object.entries(bids).forEach(([id, amount]) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h4>Item ID: ${id}</h4>
      <p>Bid: KSh ${amount.toLocaleString()}</p>
      <button onclick="deleteBid('${id}')">Delete</button>
    `;

    bidList.appendChild(card);
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