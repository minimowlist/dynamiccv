// script.js - Improved with better organization and features
import { cards } from './data.js';

// Configuration constants
const CONFIG = {
  ANIMATION_DELAY: 120,
  CARD_SCALE_ACTIVE: 1.02,
  STORAGE_KEY_THEME: 'card-viewer-theme',
  STORAGE_KEY_INDEX: 'card-viewer-index'
};

// State
let state = {
  currentIndex: 0,
  isGuideOpen: false
};

// DOM elements - cached for performance
const elements = {
  startScreen: document.getElementById("start-screen"),
  cardScreen: document.getElementById("card-screen"),
  startBtn: document.getElementById("start-btn"),
  nextBtn: document.getElementById("next-btn"),
  counter: document.getElementById("card-counter"),
  themeToggle: document.getElementById("theme-toggle"),
  guideToggle: document.getElementById("guide-toggle"),
  cardEls: document.querySelectorAll(".card"),
  topCard: document.querySelector(".card.layer-0")
};

// Initialize app
function init() {
  loadSavedTheme();
  loadSavedProgress();
  attachEventListeners();
}

// Load saved theme preference
function loadSavedTheme() {
  const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEY_THEME);
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    elements.themeToggle.textContent = '☀️';
  }
}

// Load saved card progress
function loadSavedProgress() {
  const savedIndex = localStorage.getItem(CONFIG.STORAGE_KEY_INDEX);
  if (savedIndex !== null) {
    state.currentIndex = parseInt(savedIndex, 10);
  }
}

// Save card progress
function saveProgress() {
  localStorage.setItem(CONFIG.STORAGE_KEY_INDEX, state.currentIndex);
}

// Attach all event listeners
function attachEventListeners() {
  elements.startBtn.addEventListener('click', showCardScreen);
  elements.nextBtn.addEventListener('click', showNextCard);
  elements.guideToggle.addEventListener('click', toggleGuide);
  elements.themeToggle.addEventListener('click', toggleTheme);
  
  // Keyboard support for guide toggle
  elements.guideToggle.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleGuide();
    }
  });

  // Touch swipe support for mobile
  addSwipeSupport();
}

// Show card screen
function showCardScreen() {
  elements.startScreen.classList.remove("active");
  elements.cardScreen.classList.add("active");
  renderCard();
}

// Show next card
function showNextCard() {
  state.currentIndex = (state.currentIndex + 1) % cards.length;
  state.isGuideOpen = false;
  saveProgress();
  renderCard(true);
}

// Toggle guide visibility
function toggleGuide() {
  state.isGuideOpen = !state.isGuideOpen;
  
  const guide = elements.topCard.querySelector(".guide");
  guide.classList.toggle("show", state.isGuideOpen);
  
  elements.guideToggle.textContent = state.isGuideOpen
    ? "▴ Sembunyikan panduan obrolan"
    : "▾ Panduan obrolan";
  
  elements.guideToggle.setAttribute('aria-expanded', state.isGuideOpen);
}

// Toggle theme
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  elements.themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem(CONFIG.STORAGE_KEY_THEME, isDark ? 'dark' : 'light');
}

// Render current card
function renderCard(animate = false) {
  const data = cards[state.currentIndex];
  
  // Error handling
  if (!data || !elements.topCard) {
    console.error('Card data or element not found');
    return;
  }
  
  // Update card content
  const questionEl = elements.topCard.querySelector(".question");
  const noteEl = elements.topCard.querySelector(".note");
  const insightEl = elements.topCard.querySelector(".insight");
  const guideEl = elements.topCard.querySelector(".guide");
  
  questionEl.textContent = data.question;
  noteEl.textContent = data.note;
  insightEl.textContent = data.insight;
  guideEl.classList.toggle("show", state.isGuideOpen);
  
  // Update counter
  elements.counter.textContent = `Kartu ${state.currentIndex + 1} dari ${cards.length}`;
  
  // Animate if needed
  if (animate) {
    animateCardTransition();
  }
}

// Animate card transition
function animateCardTransition() {
  const card = elements.topCard;
  card.style.opacity = '0';
  card.style.transform = `scale(${CONFIG.CARD_SCALE_ACTIVE})`;
  
  setTimeout(() => {
    card.style.opacity = '1';
    card.style.transform = 'scale(1)';
  }, CONFIG.ANIMATION_DELAY);
}

// Add swipe support for mobile
function addSwipeSupport() {
  let touchStartX = 0;
  let touchEndX = 0;
  
  const cardStack = document.getElementById('card-stack');
  
  cardStack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  cardStack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    // Swipe left to go to next card
    if (diff > swipeThreshold) {
      showNextCard();
    }
  }
}

// Start the app
init();
