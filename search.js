// search.js
(() => {
  // عناصر السيرش الموجودة عندك
  const searchBtn = document.getElementById("searchBtn");
  const searchBar = document.getElementById("searchBarContainer");
  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");
  const noResults = document.getElementById("noResults");

  // كروت الصفحة (اللي عندك حاليا - كاتيجوريز)
  const categoryCards = document.querySelectorAll(".content > a.card");

  // هنعمل Container لنتائج السيرش ونضيفه تلقائيًا لو مش موجود
  let searchResults = document.getElementById("searchResults");
  if (!searchResults) {
    const content = document.querySelector("main.content");
    searchResults = document.createElement("div");
    searchResults.id = "searchResults";
    searchResults.style.display = "none";
    searchResults.style.width = "100%";
    searchResults.style.gridColumn = "1/-1";
    content.insertBefore(searchResults, noResults);
  }

  // Cache للمنتجات
  let productsCache = null;

  // فتح/قفل السيرش
  if (searchBtn) {
    searchBtn.addEventListener("click", async () => {
      searchBar.style.display = (searchBar.style.display === "flex") ? "none" : "flex";
      searchInput.focus();

      if (!productsCache) {
        productsCache = await loadProducts();
      }
    });
  }

  // مسح
  if (clearSearch) {
    clearSearch.addEventListener("click", () => {
      searchInput.value = "";
      exitSearchMode();
    });
  }

  // بحث Live
  if (searchInput) {
    searchInput.addEventListener("input", async () => {
      const q = searchInput.value.toLowerCase().trim();

      if (!productsCache) {
        productsCache = await loadProducts();
      }

      if (q === "") {
        exitSearchMode();
        return;
      }

      enterSearchMode();

      const matches = productsCache.filter(p => {
        const hay = `${p.name} ${p.category}`.toLowerCase();
        return hay.includes(q);
      });

      renderSearchResults(matches);

      noResults.setAttribute("aria-hidden", matches.length === 0 ? "false" : "true");
    });
  }

  async function loadProducts() {
    try {
      const res = await fetch("products.json", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load products.json");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn(e);
      return [];
    }
  }

  function enterSearchMode() {
    // اخفي الكاتيجوريز cards
    categoryCards.forEach(card => card.style.display = "none");

    // جهز Grid للنتائج
    searchResults.style.display = "grid";
    searchResults.style.gridTemplateColumns = "repeat(auto-fit,minmax(220px,1fr))";
    searchResults.style.gap = "20px";
  }

  function exitSearchMode() {
    searchResults.style.display = "none";
    searchResults.innerHTML = "";
    noResults.setAttribute("aria-hidden", "true");

    // رجّع كروت الكاتيجوريز زي ما هي (بدون فلترة هنا)
    // لو عندك فلترة كاتيجوريز في ملف تاني، هتشتغل طبيعي.
    categoryCards.forEach(card => card.style.display = "block");
  }

  function renderSearchResults(list) {
    searchResults.innerHTML = "";

    list.forEach(p => {
      const a = document.createElement("a");
      a.href = p.url;
      a.className = "card";
      a.setAttribute("data-cat", p.category || "");

      a.innerHTML = `
        <img src="${escapeHtml(p.image || "")}" alt="${escapeHtml(p.name || "Product")}">
        <h3>${escapeHtml(p.name || "Product")}</h3>
        <p style="margin-top:6px;font-size:14px;opacity:.85;">${escapeHtml(p.category || "")}</p>
      `;

      searchResults.appendChild(a);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
