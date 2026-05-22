const formScreen = document.getElementById("formScreen");
const previewScreen = document.getElementById("previewScreen");
const callForm = document.getElementById("callForm");
const closeBtn = document.getElementById("closeBtn");

const imageUrlInput = document.getElementById("imageUrl");
const fullNameInput = document.getElementById("fullName");
const homeTownInput = document.getElementById("homeTown");
const purposeInput = document.getElementById("purpose");

const previewImage = document.getElementById("previewImage");
const previewName = document.getElementById("previewName");
const previewTown = document.getElementById("previewTown");
const previewPurpose = document.getElementById("previewPurpose");
const previewCategory = document.getElementById("previewCategory");

const addNoteBtn = document.getElementById("add-note");
const prevCardBtn = document.getElementById("prev-card");
const nextCardBtn = document.getElementById("next-card");
const callCard = document.getElementById("callCard");

const callBtn = document.querySelector(".action-btn.call");
const messageBtn = document.querySelector(".action-btn.message");
const themeDots = document.querySelectorAll(".dot");

const fallbackImage =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80";

const themes = ["black", "purple", "orange", "teal"];

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentIndex = notes.length > 0 ? notes.length - 1 : -1;
let currentTheme = "black";

function saveToLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function showFormScreen() {
  formScreen.classList.add("active");
  previewScreen.classList.remove("active");
}

function showPreviewScreen() {
  formScreen.classList.remove("active");
  previewScreen.classList.add("active");
}

function clearForm() {
  callForm.reset();
}

function getSelectedCategory() {
  const selected = document.querySelector('input[name="category"]:checked');
  return selected ? selected.value : "No Rush";
}

function setActiveThemeDot(theme) {
  themeDots.forEach((dot) => {
    dot.classList.toggle("active-dot", dot.dataset.theme === theme);
  });
}

function applyTheme(theme) {
  if (!themes.includes(theme)) {
    theme = "black";
  }

  currentTheme = theme;

  callCard.classList.remove(
    "theme-black",
    "theme-purple",
    "theme-orange",
    "theme-teal"
  );

  callCard.classList.add(`theme-${theme}`);
  setActiveThemeDot(theme);

  if (currentIndex >= 0 && notes[currentIndex]) {
    notes[currentIndex].theme = theme;
    saveToLocalStorage();
  }
}

function animateCardSwitch(callback) {
  callCard.classList.add("switching");

  setTimeout(() => {
    callback();
    callCard.classList.remove("switching");
  }, 180);
}

function renderCard(note) {
  if (!note) return;

  previewImage.src = note.imageUrl || fallbackImage;
  previewName.textContent = note.fullName || "Unknown User";
  previewTown.textContent = note.homeTown || "-";
  previewPurpose.textContent = note.purpose || "-";
  previewCategory.textContent = note.category || "No Rush";

  applyTheme(note.theme || "black");

  previewImage.onerror = function () {
    previewImage.src = fallbackImage;
  };
}

function updateArrowState() {
  prevCardBtn.disabled = currentIndex <= 0;
  nextCardBtn.disabled = currentIndex === -1 || currentIndex >= notes.length - 1;
}

callForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const note = {
    imageUrl: imageUrlInput.value.trim(),
    fullName: fullNameInput.value.trim(),
    homeTown: homeTownInput.value.trim(),
    purpose: purposeInput.value.trim(),
    category: getSelectedCategory(),
    theme: currentTheme,
  };

  notes.push(note);
  saveToLocalStorage();

  currentIndex = notes.length - 1;

  renderCard(note);
  updateArrowState();
  showPreviewScreen();
});

closeBtn.addEventListener("click", function () {
  clearForm();
});

addNoteBtn.addEventListener("click", function () {
  clearForm();
  showFormScreen();
});

prevCardBtn.addEventListener("click", function () {
  if (currentIndex > 0) {
    animateCardSwitch(() => {
      currentIndex--;
      renderCard(notes[currentIndex]);
      updateArrowState();
    });
  }
});

nextCardBtn.addEventListener("click", function () {
  if (currentIndex < notes.length - 1) {
    animateCardSwitch(() => {
      currentIndex++;
      renderCard(notes[currentIndex]);
      updateArrowState();
    });
  }
});

themeDots.forEach((dot) => {
  dot.addEventListener("click", function () {
    const theme = dot.dataset.theme;
    applyTheme(theme);
  });
});

callBtn.addEventListener("click", function () {
  if (currentIndex >= 0 && notes[currentIndex]) {
    alert(`Calling ${notes[currentIndex].fullName}...`);
  }
});

messageBtn.addEventListener("click", function () {
  if (currentIndex >= 0 && notes[currentIndex]) {
    alert(`Opening message for ${notes[currentIndex].fullName}...`);
  }
});

if (notes.length > 0) {
  renderCard(notes[currentIndex]);
  showPreviewScreen();
} else {
  showFormScreen();
  applyTheme("black");
}

updateArrowState(); 

