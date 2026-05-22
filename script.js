// DOM Elements
const dashboardScreen = document.getElementById("dashboardScreen");
const formScreen = document.getElementById("formScreen");
const callForm = document.getElementById("callForm");
const closeBtn = document.getElementById("closeBtn");
const newCallBtn = document.getElementById("newCallBtn");
const newCallEmptyBtn = document.getElementById("newCallEmptyBtn");
const pageThemeToggle = document.getElementById("pageThemeToggle");
const searchInput = document.getElementById("searchInput");
const notesGrid = document.getElementById("notesGrid");
const emptyState = document.getElementById("emptyState");

// Form Inputs & Headings
const editNoteIndexInput = document.getElementById("editNoteIndex");
const formTitle = document.getElementById("formTitle");
const submitFormBtn = document.getElementById("submitFormBtn");
const imageUrlInput = document.getElementById("imageUrl");
const fullNameInput = document.getElementById("fullName");
const homeTownInput = document.getElementById("homeTown");
const phoneNumberInput = document.getElementById("phoneNumber");
const purposeInput = document.getElementById("purpose");

// Dashboard Stats elements
const statTotal = document.getElementById("statTotal");
const statEmergency = document.getElementById("statEmergency");
const statImportant = document.getElementById("statImportant");
const statUrgent = document.getElementById("statUrgent");
const statNoRush = document.getElementById("statNoRush");

// Constants
const fallbackImage =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80";

// App State
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let activeCategory = "All";
let searchQuery = "";

// Save to LocalStorage
function saveToLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Open Form Modal (Create Mode)
function openCreateForm() {
  callForm.reset();
  editNoteIndexInput.value = "-1";
  formTitle.textContent = "New Call";
  submitFormBtn.textContent = "Create Note";
  
  // Set default radio check to "No Rush"
  const defaultRadio = document.querySelector('input[name="category"][value="No Rush"]');
  if (defaultRadio) defaultRadio.checked = true;

  formScreen.classList.add("active");
}

// Open Form Modal (Edit Mode)
function openEditForm(index) {
  const note = notes[index];
  if (!note) return;

  editNoteIndexInput.value = index;
  formTitle.textContent = "Edit Call Note";
  submitFormBtn.textContent = "Save Changes";

  imageUrlInput.value = note.imageUrl || "";
  fullNameInput.value = note.fullName || "";
  homeTownInput.value = note.homeTown || "";
  phoneNumberInput.value = note.phoneNumber || "";
  purposeInput.value = note.purpose || "";

  // Set category radio check
  const radio = document.querySelector(`input[name="category"][value="${note.category}"]`);
  if (radio) {
    radio.checked = true;
  }

  formScreen.classList.add("active");
}

// Close Form Modal
function closeForm() {
  callForm.reset();
  formScreen.classList.remove("active");
}

// Get Selected Category from Radio
function getSelectedCategory() {
  const selected = document.querySelector('input[name="category"]:checked');
  return selected ? selected.value : "No Rush";
}

// Delete Note
function deleteNote(index) {
  if (confirm(`Are you sure you want to delete the call note for "${notes[index].fullName}"?`)) {
    notes.splice(index, 1);
    saveToLocalStorage();
    renderDashboard();
    updateStats();
  }
}

// Calculate and Update Dashboard Stats
function updateStats() {
  const stats = {
    Total: notes.length,
    Emergency: 0,
    Important: 0,
    Urgent: 0,
    "No Rush": 0
  };

  notes.forEach((note) => {
    if (stats[note.category] !== undefined) {
      stats[note.category]++;
    }
  });

  statTotal.textContent = stats.Total;
  statEmergency.textContent = stats.Emergency;
  statImportant.textContent = stats.Important;
  statUrgent.textContent = stats.Urgent;
  statNoRush.textContent = stats["No Rush"];
}

// Create Card Element for Reusable Saved Note
function createCardElement(note, index) {
  const cardDiv = document.createElement("div");
  const noteTheme = note.theme || "black";
  cardDiv.className = `call-card theme-${noteTheme}`;

  const cat = note.category || "No Rush";
  let catClass = "norush";
  if (cat === "Emergency") catClass = "emergency";
  else if (cat === "Important") catClass = "important";
  else if (cat === "Urgent") catClass = "urgent";

  const imgUrl = note.imageUrl || fallbackImage;

  cardDiv.innerHTML = `
    <!-- Card Header Controls -->
    <div class="card-control-bar">
      <div class="card-dots">
        <button type="button" class="card-dot black ${noteTheme === 'black' ? 'active-dot' : ''}" data-theme="black" title="Black theme"></button>
        <button type="button" class="card-dot purple ${noteTheme === 'purple' ? 'active-dot' : ''}" data-theme="purple" title="Purple theme"></button>
        <button type="button" class="card-dot orange ${noteTheme === 'orange' ? 'active-dot' : ''}" data-theme="orange" title="Orange theme"></button>
        <button type="button" class="card-dot teal ${noteTheme === 'teal' ? 'active-dot' : ''}" data-theme="teal" title="Teal theme"></button>
      </div>
      <div class="card-actions">
        <button type="button" class="card-action-btn edit" title="Edit note">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"/></svg>
        </button>
        <button type="button" class="card-action-btn delete" title="Delete note">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </div>
    </div>

    <!-- Card Content -->
    <div class="avatar-wrap">
      <img src="${imgUrl}" alt="${note.fullName}" class="card-avatar-img" />
    </div>

    <h2>${note.fullName || "Unknown User"}</h2>

    <div class="info-grid">
      <div class="label-col">
        <p>Home town</p>
        <p>Phone</p>
        <p>Purpose</p>
        <p>Category</p>
      </div>

      <div class="value-col">
        <p>${note.homeTown || "-"}</p>
        <p>${note.phoneNumber || "-"}</p>
        <p>${note.purpose || "-"}</p>
        <p><span class="pill-tag ${catClass}">${cat}</span></p>
      </div>
    </div>

    <!-- Card Primary Actions -->
    <div class="actions">
      <button type="button" class="action-btn call">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon-call"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span>Call</span>
      </button>
      <button type="button" class="action-btn message">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon-msg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span>Message</span>
      </button>
    </div>
  `;

  // Fallback image handling
  const imgElement = cardDiv.querySelector(".card-avatar-img");
  imgElement.onerror = function () {
    imgElement.src = fallbackImage;
  };

  // Bind Individual Color dots trigger
  const themeButtons = cardDiv.querySelectorAll(".card-dot");
  themeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const theme = btn.dataset.theme;
      note.theme = theme;
      saveToLocalStorage();
      
      // Update card styling live
      cardDiv.className = `call-card theme-${theme}`;
      themeButtons.forEach((b) => b.classList.toggle("active-dot", b.dataset.theme === theme));
    });
  });

  // Bind Edit trigger
  cardDiv.querySelector(".card-action-btn.edit").addEventListener("click", (e) => {
    e.stopPropagation();
    openEditForm(index);
  });

  // Bind Delete trigger
  cardDiv.querySelector(".card-action-btn.delete").addEventListener("click", (e) => {
    e.stopPropagation();
    deleteNote(index);
  });

  // Bind tel: action
  cardDiv.querySelector(".action-btn.call").addEventListener("click", () => {
    if (note.phoneNumber) {
      window.location.href = `tel:${note.phoneNumber}`;
    } else {
      alert("No phone number specified.");
    }
  });

  // Bind sms: action
  cardDiv.querySelector(".action-btn.message").addEventListener("click", () => {
    if (note.phoneNumber) {
      window.location.href = `sms:${note.phoneNumber}`;
    } else {
      alert("No phone number specified.");
    }
  });

  return cardDiv;
}

// Render Saved Notes to Dashboard Grid
function renderDashboard() {
  notesGrid.innerHTML = "";

  const filteredNotes = notes.filter((note) => {
    // Category match
    const categoryMatch = activeCategory === "All" || note.category === activeCategory;

    // Search query match (name, hometown, purpose, category)
    const q = searchQuery.toLowerCase().trim();
    const searchMatch =
      !q ||
      (note.fullName && note.fullName.toLowerCase().includes(q)) ||
      (note.homeTown && note.homeTown.toLowerCase().includes(q)) ||
      (note.purpose && note.purpose.toLowerCase().includes(q)) ||
      (note.category && note.category.toLowerCase().includes(q));

    return categoryMatch && searchMatch;
  });

  // Render cards or toggle empty state
  if (filteredNotes.length === 0) {
    notesGrid.style.display = "none";
    emptyState.style.display = "flex";
  } else {
    notesGrid.style.display = "grid";
    emptyState.style.display = "none";

    // Build the grid cards
    filteredNotes.forEach((note) => {
      // Find the absolute original index in the main list
      const originalIndex = notes.indexOf(note);
      const card = createCardElement(note, originalIndex);
      notesGrid.appendChild(card);
    });
  }
}

// Category pill click handler
function setFilterCategory(category) {
  activeCategory = category;

  // Update category pills class
  document.querySelectorAll(".filter-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.category === category);
  });

  // Sync active styling on stat cards
  document.querySelectorAll(".stat-card").forEach((card) => {
    card.classList.toggle("active-stat", card.dataset.stat === category);
  });

  renderDashboard();
}

// Page Light/Dark Theme management
function togglePageTheme() {
  const currentTheme = document.body.getAttribute("data-page-theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyPageTheme(newTheme);
}

function applyPageTheme(theme) {
  document.body.setAttribute("data-page-theme", theme);
  localStorage.setItem("pageTheme", theme);

  const sunIcon = document.querySelector(".sun-icon");
  const moonIcon = document.querySelector(".moon-icon");

  if (theme === "dark") {
    if (sunIcon) sunIcon.style.display = "none";
    if (moonIcon) moonIcon.style.display = "block";
  } else {
    if (sunIcon) sunIcon.style.display = "block";
    if (moonIcon) moonIcon.style.display = "none";
  }
}

// Form Submission Event (Handles Create and Update)
callForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const noteData = {
    imageUrl: imageUrlInput.value.trim(),
    fullName: fullNameInput.value.trim(),
    homeTown: homeTownInput.value.trim(),
    phoneNumber: phoneNumberInput.value.trim(),
    purpose: purposeInput.value.trim(),
    category: getSelectedCategory(),
    theme: "black" // default card theme
  };

  const editIndex = parseInt(editNoteIndexInput.value, 10);

  if (editIndex >= 0 && notes[editIndex]) {
    // Keep existing theme if editing
    noteData.theme = notes[editIndex].theme || "black";
    notes[editIndex] = noteData;
  } else {
    notes.push(noteData);
  }

  saveToLocalStorage();
  closeForm();
  renderDashboard();
  updateStats();
});

// Event Listeners
newCallBtn.addEventListener("click", openCreateForm);
newCallEmptyBtn.addEventListener("click", openCreateForm);
closeBtn.addEventListener("click", closeForm);
pageThemeToggle.addEventListener("click", togglePageTheme);

// Search Query Input listener
searchInput.addEventListener("input", function (e) {
  searchQuery = e.target.value;
  renderDashboard();
});

// Bind category pills click
document.querySelectorAll(".filter-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    setFilterCategory(pill.dataset.category);
  });
});

// Bind stat cards click for convenient category switching
document.querySelectorAll(".stat-card").forEach((card) => {
  card.addEventListener("click", () => {
    setFilterCategory(card.dataset.stat);
  });
});

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Load global page theme
  const savedPageTheme = localStorage.getItem("pageTheme") || "light";
  applyPageTheme(savedPageTheme);

  // Initial render
  renderDashboard();
  updateStats();
});

// Polyfill in case DOMContentLoaded has already fired
if (document.readyState === "interactive" || document.readyState === "complete") {
  const savedPageTheme = localStorage.getItem("pageTheme") || "light";
  applyPageTheme(savedPageTheme);
  renderDashboard();
  updateStats();
}
