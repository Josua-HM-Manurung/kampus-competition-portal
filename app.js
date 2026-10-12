const STORAGE_KEY = "campusCompetitions";
const ADMIN_PASSWORD = "kampus123";
const ADMIN_STATE_KEY = "campusAdminLoggedIn";

const defaultCompetitions = [
  {
    id: "comp-1",
    title: "Hackathon Inovasi Digital 2026",
    organizer: "BEM Fakultas Teknik",
    category: "Teknologi",
    status: "Buka",
    eventDate: "2026-11-02",
    deadlineDate: "2026-10-28",
    location: "Online",
    description:
      "Kompetisi inovasi digital bagi mahasiswa untuk menciptakan solusi berbasis teknologi untuk permasalahan sosial dan kampus.",
    registrationLink: "https://example.com/register/hackathon",
    posterUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    pdfUrl: "",
    pdfName: ""
  },
  {
    id: "comp-2",
    title: "Business Case Competition 2026",
    organizer: "KSPM Universitas Nusantara",
    category: "Bisnis",
    status: "Segera",
    eventDate: "2026-11-12",
    deadlineDate: "2026-11-04",
    location: "Bandung",
    description:
      "Menyajikan tantangan analisis bisnis untuk mahasiswa yang ingin mengasah kemampuan strategi, riset pasar, dan presentasi.",
    registrationLink: "https://example.com/register/business-case",
    posterUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    pdfUrl: "",
    pdfName: ""
  },
  {
    id: "comp-3",
    title: "Poster Design Challenge",
    organizer: "Dewan Seni Mahasiswa",
    category: "Kesenian",
    status: "Buka",
    eventDate: "2026-10-25",
    deadlineDate: "2026-10-18",
    location: "Kampus",
    description:
      "Kompetisi desain poster digital dengan tema sosial, lingkungan, dan kreativitas mahasiswa.",
    registrationLink: "https://example.com/register/poster-design",
    posterUrl:
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80",
    pdfUrl: "",
    pdfName: ""
  }
];

const state = {
  competitions: []
};

const elements = {
  grid: document.querySelector("#competitions-grid"),
  searchInput: document.querySelector("#search-input"),
  categoryFilter: document.querySelector("#category-filter"),
  statusFilter: document.querySelector("#status-filter"),
  statCount: document.querySelector("#stat-count"),
  statOpen: document.querySelector("#stat-open"),
  adminPanel: document.querySelector("#admin-panel"),
  adminButton: document.querySelector("#admin-open-btn"),
  adminQuickButton: document.querySelector("#admin-quick-btn"),
  adminLoginForm: document.querySelector("#admin-login-form"),
  adminPassword: document.querySelector("#admin-password"),
  loginModal: document.querySelector("#login-modal"),
  closeModalButton: document.querySelector("#close-modal-btn"),
  logoutButton: document.querySelector("#logout-btn"),
  adminForm: document.querySelector("#admin-form")
};

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString + "T00:00:00");
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function loadCompetitions() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCompetitions));
    return [...defaultCompetitions];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : [...defaultCompetitions];
  } catch (error) {
    return [...defaultCompetitions];
  }
}

function saveCompetitions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.competitions));
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getFilteredCompetitions() {
  const searchValue = elements.searchInput.value.trim().toLowerCase();
  const categoryValue = elements.categoryFilter.value;
  const statusValue = elements.statusFilter.value;

  return state.competitions.filter((item) => {
    const matchesSearch =
      !searchValue ||
      [item.title, item.organizer, item.category, item.location]
        .join(" ")
        .toLowerCase()
        .includes(searchValue);

    const matchesCategory = categoryValue === "all" || item.category === categoryValue;
    const matchesStatus = statusValue === "all" || item.status === statusValue;

    return matchesSearch && matchesCategory && matchesStatus;
  });
}

function createCard(item) {
  const article = document.createElement("article");
  article.className = "competition-card";

  const posterSrc = item.posterUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";

  article.innerHTML = `
    <div class="card-image">
      <img src="${escapeHtml(posterSrc)}" alt="${escapeHtml(item.title)}" />
      <span class="card-badge">${escapeHtml(item.category)}</span>
    </div>
    <div class="card-body">
      <div class="card-meta">
        <span>${escapeHtml(item.organizer)}</span>
        <span class="chip success">${escapeHtml(item.status)}</span>
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description.slice(0, 110))}${item.description.length > 110 ? "..." : ""}</p>

      <div class="card-details">
        <div class="detail-item">
          <span>Tanggal</span>
          <strong>${escapeHtml(formatDate(item.eventDate))}</strong>
        </div>
        <div class="detail-item">
          <span>Deadline</span>
          <strong>${escapeHtml(formatDate(item.deadlineDate))}</strong>
        </div>
      </div>

      <div class="card-actions">
        ${
          item.registrationLink
            ? `<a class="action-link" href="${escapeHtml(item.registrationLink)}" target="_blank" rel="noopener noreferrer">Daftar</a>`
            : `<span class="action-link-secondary">Daftar tidak tersedia</span>`
        }
        ${
          item.pdfUrl
            ? `<a class="action-link-secondary" href="${escapeHtml(item.pdfUrl)}" target="_blank" rel="noopener noreferrer">PDF</a>`
            : `<span class="action-link-secondary">Tanpa PDF</span>`
        }
      </div>
    </div>
  `;

  return article;
}

function renderCompetitions() {
  const filtered = getFilteredCompetitions();

  elements.grid.innerHTML = "";

  if (!filtered.length) {
    elements.grid.innerHTML = `
      <div class="empty-state">
        <h3>Tidak ada lomba yang cocok</h3>
        <p>Coba ubah pencarian atau filter untuk menemukan lomba lain.</p>
      </div>
    `;
    return;
  }

  filtered.forEach((item) => {
    elements.grid.appendChild(createCard(item));
  });
}

function updateStats() {
  const openStatusCount = state.competitions.filter((item) => item.status === "Buka").length;
  elements.statCount.textContent = String(state.competitions.length);
  elements.statOpen.textContent = String(openStatusCount);
}

function openAdminPanel() {
  const isLoggedIn = sessionStorage.getItem(ADMIN_STATE_KEY) === "true";

  if (isLoggedIn) {
    elements.adminPanel.classList.remove("hidden");
    return;
  }

  elements.loginModal.classList.remove("hidden");
}

function closeAdminModal() {
  elements.loginModal.classList.add("hidden");
  elements.adminPassword.value = "";
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(elements.adminForm);
  const posterFile = formData.get("posterFile");
  const pdfFile = formData.get("pdfFile");

  let posterUrl = formData.get("posterLink").trim();
  let pdfUrl = formData.get("pdfLink").trim();

  if (posterFile && posterFile.size > 0) {
    posterUrl = await readAsDataUrl(posterFile);
  }

  if (pdfFile && pdfFile.size > 0) {
    pdfUrl = await readAsDataUrl(pdfFile);
  }

  const newCompetition = {
    id: `comp-${Date.now()}`,
    title: formData.get("title").trim(),
    organizer: formData.get("organizer").trim(),
    category: formData.get("category"),
    status: formData.get("status"),
    eventDate: formData.get("eventDate"),
    deadlineDate: formData.get("deadlineDate"),
    location: formData.get("location").trim(),
    description: formData.get("description").trim(),
    registrationLink: formData.get("registrationLink").trim(),
    posterUrl,
    pdfUrl,
    pdfName: pdfFile && pdfFile.size > 0 ? pdfFile.name : ""
  };

  state.competitions.unshift(newCompetition);
  saveCompetitions();
  updateStats();
  renderCompetitions();

  elements.adminForm.reset();
  elements.adminPanel.classList.remove("hidden");
}

function handleAdminLogin(event) {
  event.preventDefault();
  const enteredPassword = elements.adminPassword.value.trim();

  if (enteredPassword === ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_STATE_KEY, "true");
    closeAdminModal();
    elements.adminPanel.classList.remove("hidden");
    return;
  }

  alert("Password admin salah. Silakan coba lagi.");
}

function handleLogout() {
  sessionStorage.removeItem(ADMIN_STATE_KEY);
  elements.adminPanel.classList.add("hidden");
  closeAdminModal();
}

function initialize() {
  state.competitions = loadCompetitions();
  updateStats();
  renderCompetitions();

  elements.searchInput.addEventListener("input", renderCompetitions);
  elements.categoryFilter.addEventListener("change", renderCompetitions);
  elements.statusFilter.addEventListener("change", renderCompetitions);
  elements.adminForm.addEventListener("submit", handleFormSubmit);

  elements.adminButton.addEventListener("click", openAdminPanel);
  elements.adminQuickButton.addEventListener("click", openAdminPanel);
  elements.adminLoginForm.addEventListener("submit", handleAdminLogin);
  elements.closeModalButton.addEventListener("click", closeAdminModal);
  elements.logoutButton.addEventListener("click", handleLogout);

  elements.loginModal.addEventListener("click", (event) => {
    if (event.target === elements.loginModal) {
      closeAdminModal();
    }
  });

  const loggedIn = sessionStorage.getItem(ADMIN_STATE_KEY) === "true";
  if (loggedIn) {
    elements.adminPanel.classList.remove("hidden");
  }
}

initialize();
