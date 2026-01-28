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

// ✅ التصنيفات المسموح بيها (زي اللي عندك في الواجهة بالظبط)
const UI_CATEGORIES = new Set([
  "All",
  "Moods",
  "Space Packages",
  "Outdoor Flooring",
  "Vases",
  "Lighting",
  "Glass Candles",
  "Cushions",
  "Wooden Rack",
  "Games",
  "Glass and Small Vases",
  "Wall Art",
]);

// ✅ تنظيف/توحيد الكاتيجوري اللي جاية من Firestore
function normalizeCategory(cat) {
  const c = String(cat ?? "").trim();

  if (!c) return "All";

  // توحيد بعض الاختلافات الشائعة لو بتحصل عندك
  const map = {
    "SpacePackages": "Space Packages",
    "space packages": "Space Packages",
    "OutdoorFlooring": "Outdoor Flooring",
    "outdoor flooring": "Outdoor Flooring",
    "glass candles": "Glass Candles",
    "wooden rack": "Wooden Rack",
    "glass and small vases": "Glass and Small Vases",
    "wall art": "Wall Art",
  };

  const fixed = map[c] || c;

  // لو الكاتيجوري مش موجودة في UI → خليها All عشان الفلتر ما يبوظش
  return UI_CATEGORIES.has(fixed) ? fixed : "All";
}

function cardHTML(p) {
  const title = esc(p.title || "");
  const cat = esc(normalizeCategory(p.category));
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
  if (!grid) {
    console.warn("productsGrid not found: add id='productsGrid' to <main class='content'>");
    return;
  }

  const searchResults = document.getElementById("searchResults");

  try {
    const snap = await getDocs(collection(db, "products"));
    const items = snap.docs.map(d => d.data());

    // ✅ لو مفيش منتجات Firestore، سيب منتجات الـ HTML زي ما هي
    if (!items.length) {
      if (typeof window.applyCategory === "function") window.applyCategory("All");
      return;
    }

    // ✅ امنع التكرار لو الصفحة اتعملها refresh
    grid.querySelectorAll('a.card[data-source="firestore"]').forEach(el => el.remove());

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
    console.error("Firestore load error:", e);
  }
}

loadProducts();
