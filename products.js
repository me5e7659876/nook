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
    <a href="${href}" class="card" data-cat="${cat}" data-source="firestore">
      <img src="${img}" alt="">
      <h3>${title}</h3>
    </a>
  `;
}

async function loadProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  const searchResults = document.getElementById("searchResults");

  try {
    const snap = await getDocs(collection(db, "products"));
    const items = snap.docs.map(d => d.data());

    // ✅ لو مفيش منتجات في Firestore، سيب كروت الـ HTML زي ما هي
    if (!items.length) {
      if (typeof window.applyCategory === "function") window.applyCategory("All");
      return;
    }

    const html = items.map(cardHTML).join("");

    // ✅ ضيف منتجات Firestore قبل searchResults
    if (searchResults) {
      searchResults.insertAdjacentHTML("beforebegin", html);
    } else {
      grid.insertAdjacentHTML("afterbegin", html);
    }

    // ✅ شغل الفلتر بعد الإضافة
    if (typeof window.applyCategory === "function") {
      window.applyCategory("All");
    }
  } catch (e) {
    console.error(e);
  }
}

loadProducts();
