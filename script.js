const API = "https://dummyjson.com/products";
const USD_TO_KES = 160;

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
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "1234") {
    localStorage.setItem("admin", "true");
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error").innerText = "Invalid credentials";
  }
}

function protectAdmin() {
  if (!localStorage.getItem("admin") && window.location.pathname.includes("dashboard")) {
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
    const price = convertToKES(item.price);

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${item.title}</h3>
      <p>Price: KSh ${price.toLocaleString()}</p>
      <button onclick="bid(${price}, ${item.id})">Place Bid</button>
    `;

    container.appendChild(div);
  });
}

function bid(currentPrice, id) {
  const amount = Number(prompt("Enter your bid in KSh:"));

  if (isValidBid(currentPrice, amount)) {
    let bids = JSON.parse(localStorage.getItem("bids")) || {};
    bids = saveBid(bids, id, amount);
    localStorage.setItem("bids", JSON.stringify(bids));
    alert("Bid accepted!");
  } else {
    alert("Bid too low!");
  }
}


function loadDashboard() {
  const totalBids = document.getElementById("totalBids");
  const highestBid = document.getElementById("highestBid");
  const bidList = document.getElementById("bidList");

  if (!totalBids || !highestBid || !bidList) return;

  const bids = JSON.parse(localStorage.getItem("bids")) || {};
  const values = Object.values(bids);

  totalBids.innerText = values.length;
  highestBid.innerText = "KSh " + (values.length ? Math.max(...values) : 0);

  bidList.innerHTML = "";

  Object.entries(bids).forEach(([id, amount]) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h4>Item ${id}</h4>
      <p>KSh ${amount}</p>
      <button onclick="deleteBid('${id}')">Delete</button>
    `;

    bidList.appendChild(card);
  });
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



if (typeof module !== "undefined") {
  module.exports = {
    convertToKES,
    isValidBid,
    saveBid
  };
}