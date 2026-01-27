import { db } from "./firebase-init.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const grid = document.getElementById("productsGrid");

function cardHTML(p) {
  const cat = p.category || "All";
  const slug = p.slug || "";

  return `
    <a href="${p.link || "#"}" class="card" data-cat="${cat}">
      <img src="${p.imageUrl}" alt="">
      <h3>${p.title || ""}</h3>
    </a>
  `;
}

async function loadProducts() {
  const snap = await getDocs(collection(db, "products"));
  const items = snap.docs.map(d => d.data());

  grid.innerHTML = items.map(cardHTML).join("");

  // يشغّل فلتر الكاتيجوري بتاعك بعد الرسم
  if (typeof applyCategory === "function") applyCategory("All");
}

loadProducts();
