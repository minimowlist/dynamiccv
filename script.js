const cards = [
  {
    question: "Hal apa yang paling kamu ingat dari hari ini?",
    note: "Dengarkan tanpa menyela atau buru-buru menanggapi.",
    insight: "Hal kecil sering terasa besar bagi anak."
  },
  {
    question: "Ada momen hari ini yang bikin kamu senang?",
    note: "Biarkan anak menyebutkan versinya sendiri.",
    insight: "Rasa senang anak sering datang dari perhatian."
  },
  {
    question: "Ada bagian hari ini yang bikin kamu capek?",
    note: "Tidak semua keluhan perlu solusi.",
    insight: "Didengar dengan tenang sering kali sudah cukup."
  }
];

let index = 0;
let guideOpen = false;

const startScreen = document.getElementById("start-screen");
const cardScreen = document.getElementById("card-screen");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const counter = document.getElementById("card-counter");
const themeToggle = document.getElementById("theme-toggle");
const guideToggle = document.getElementById("guide-toggle");

const cardEls = document.querySelectorAll(".card");

startBtn.onclick = () => {
  startScreen.classList.remove("active");
  cardScreen.classList.add("active");
  render();
};

nextBtn.onclick = () => {
  index = (index + 1) % cards.length;
  guideOpen = false;
  render(true);
};

guideToggle.onclick = () => {
  guideOpen = !guideOpen;
  document.querySelector(".guide").classList.toggle("show", guideOpen);
  guideToggle.textContent = guideOpen
    ? "▴ Sembunyikan panduan obrolan"
    : "▾ Panduan obrolan";
};

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

function render(animate = false) {
  const data = cards[index];
  const top = cardEls[0];

  top.querySelector(".question").textContent = data.question;
  top.querySelector(".note").textContent = data.note;
  top.querySelector(".insight").textContent = data.insight;
  top.querySelector(".guide").classList.toggle("show", guideOpen);

  counter.textContent = `Kartu ${index + 1} dari ${cards.length}`;

  if (animate) {
    top.style.opacity = 0;
    top.style.transform = "scale(1.02)";
    setTimeout(() => {
      top.style.opacity = 1;
      top.style.transform = "scale(1)";
    }, 120);
  }
}
