import { db } from "./firebase-init.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

function esc(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cardHTML(p) {
  const title = esc(p.title || "");
  const cat = esc(p.category || "All");
  const img = esc(p.imageUrl || "");
  const href = esc(p.link || "#");

  return `
    <a href="${href}" class="card" data-cat="${cat}">
      <img src="${img}" alt="">
      <h3>${title}</h3>
    </a>
  `;
}

async function loadProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) {
    console.warn("productsGrid not found. Add id='productsGrid' to <main class='content'>");
    return;
  }

  const searchResults = document.getElementById("searchResults");

  // امسح أي كروت قديمة
  grid.querySelectorAll("a.card").forEach(el => el.remove());

  try {
    const snap = await getDocs(collection(db, "products"));
    const items = snap.docs.map(d => d.data());

    const html = items.map(cardHTML).join("");

    // حط الكروت قبل searchResults عشان ما نكسرش search.js
    if (searchResults) {
      searchResults.insertAdjacentHTML("beforebegin", html);
    } else {
      grid.insertAdjacentHTML("afterbegin", html);
    }

    // شغل الفلتر بعد ما المنتجات تظهر
    if (typeof window.applyCategory === "function") {
      window.applyCategory("All");
    }
  } catch (e) {
    console.error("Error loading products:", e);
  }
}

loadProducts();
