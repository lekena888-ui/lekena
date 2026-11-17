// JavaScript used on the pages of Explore Lesotho

// Put the current year in the footer.
document.querySelectorAll(".current-year").forEach(function(item) {
  item.textContent = new Date().getFullYear();
});

// Dark and light mode. The choice is saved in local storage.
const modeButton = document.getElementById("modeButton");
if (modeButton) {
  if (localStorage.getItem("lesothoTheme") === "dark") {
    document.body.classList.add("dark-mode");
    modeButton.textContent = "Light mode";
  }
  modeButton.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("lesothoTheme", isDark ? "dark" : "light");
    modeButton.textContent = isDark ? "Light mode" : "Dark mode";
  });
}

// Search and filter the destination cards.
const destinationSearch = document.getElementById("destinationSearch");
const destinationFilter = document.getElementById("destinationFilter");
const destinationItems = document.querySelectorAll(".destination-item");
const destinationAlert = document.getElementById("destinationAlert");

function filterDestinations() {
  if (!destinationItems.length) return;
  const searchTerm = destinationSearch.value.toLowerCase().trim();
  const selectedCategory = destinationFilter.value;
  let visibleCount = 0;

  destinationItems.forEach(function(item) {
    const text = (item.dataset.name + " " + item.textContent).toLowerCase();
    const categories = item.dataset.category.split(" ");
    const matchesText = text.includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || categories.includes(selectedCategory);
    const showItem = matchesText && matchesCategory;
    item.classList.toggle("d-none", !showItem);
    if (showItem) visibleCount++;
  });
  destinationAlert.classList.toggle("d-none", visibleCount !== 0);
}
if (destinationSearch) destinationSearch.addEventListener("input", filterDestinations);
if (destinationFilter) destinationFilter.addEventListener("change", filterDestinations);

// Bootstrap modal with extra details for each destination.
document.querySelectorAll(".details-button").forEach(function(button) {
  button.addEventListener("click", function() {
    document.getElementById("destinationModalTitle").textContent = button.dataset.title;
    document.getElementById("destinationModalBody").textContent = button.dataset.info;
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("destinationModal"));
    modal.show();
  });
});

// Gallery lightbox with next and previous controls.
const viewer = document.getElementById("photoViewer");
const viewerImage = document.getElementById("viewerImage");
const galleryTiles = Array.from(document.querySelectorAll(".gallery-tile"));
let activePhoto = 0;

function showPhoto(index) {
  if (!galleryTiles.length) return;
  activePhoto = (index + galleryTiles.length) % galleryTiles.length;
  viewerImage.src = galleryTiles[activePhoto].dataset.full;
  viewer.classList.add("open");
  viewer.setAttribute("aria-hidden", "false");
}
function closePhotoViewer() {
  if (!viewer) return;
  viewer.classList.remove("open");
  viewer.setAttribute("aria-hidden", "true");
  viewerImage.src = "";
}
galleryTiles.forEach(function(tile, index) {
  tile.addEventListener("click", function() { showPhoto(index); });
});
const viewerClose = document.getElementById("viewerClose");
const viewerPrev = document.getElementById("viewerPrev");
const viewerNext = document.getElementById("viewerNext");
if (viewerClose) viewerClose.addEventListener("click", closePhotoViewer);
if (viewerPrev) viewerPrev.addEventListener("click", function() { showPhoto(activePhoto - 1); });
if (viewerNext) viewerNext.addEventListener("click", function() { showPhoto(activePhoto + 1); });
if (viewer) {
  viewer.addEventListener("click", function(event) {
    if (event.target === viewer) closePhotoViewer();
  });
}
document.addEventListener("keydown", function(event) {
  if (!viewer || !viewer.classList.contains("open")) return;
  if (event.key === "Escape") closePhotoViewer();
  if (event.key === "ArrowLeft") showPhoto(activePhoto - 1);
  if (event.key === "ArrowRight") showPhoto(activePhoto + 1);
});

// Booking form: date limits, cost estimate, and validation.
const bookingForm = document.getElementById("bookingForm");
const tripDate = document.getElementById("tripDate");
const visitorCount = document.getElementById("visitorCount");
const tripType = document.getElementById("tripType");
const costEstimate = document.getElementById("costEstimate");
const bookingResult = document.getElementById("bookingResult");

function getTodayString() {
  const today = new Date();
  return today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
}
if (tripDate) tripDate.min = getTodayString();

function updateCost() {
  if (!costEstimate || !visitorCount || !tripType) return;
  const people = Math.max(1, Number(visitorCount.value) || 1);
  const price = Number(tripType.value) || 100;
  costEstimate.textContent = "M" + (people * price).toLocaleString();
}
if (visitorCount) visitorCount.addEventListener("input", updateCost);
if (tripType) tripType.addEventListener("change", updateCost);
updateCost();

if (bookingForm) {
  bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();
    event.stopPropagation();
    bookingForm.classList.add("was-validated");

    if (tripDate.value && tripDate.value < getTodayString()) {
      tripDate.setCustomValidity("Choose a date that is not in the past.");
    } else {
      tripDate.setCustomValidity("");
    }
    if (!bookingForm.checkValidity()) {
      bookingResult.textContent = "Please check the highlighted fields and try again.";
      return;
    }
    const name = document.getElementById("bookingName").value.trim();
    const place = document.getElementById("tripPlace").value;
    bookingResult.textContent = "Thank you, " + name + ". Your sample request for " + place + " has been prepared. No real booking was sent.";
    bookingForm.reset();
    bookingForm.classList.remove("was-validated");
    tripDate.min = getTodayString();
    updateCost();
  });
}

// Contact form validation.
const contactForm = document.getElementById("contactForm");
const contactResult = document.getElementById("contactResult");
if (contactForm) {
  contactForm.addEventListener("submit", function(event) {
    event.preventDefault();
    event.stopPropagation();
    contactForm.classList.add("was-validated");
    if (!contactForm.checkValidity()) {
      contactResult.textContent = "Please complete the highlighted fields before submitting.";
      return;
    }
    const name = document.getElementById("contactName").value.trim();
    contactResult.textContent = "Thank you, " + name + ". Your sample message has been accepted on this page.";
    contactForm.reset();
    contactForm.classList.remove("was-validated");
  });
}
