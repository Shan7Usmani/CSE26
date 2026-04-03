/* NAVBAR HIDE ON SCROLL */
let lastScroll = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  navbar.classList.toggle(
    "hide",
    currentScroll > lastScroll && currentScroll > 120
  );
  lastScroll = currentScroll;
});

/* SCROLL PROGRESS */
const progress = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  progress.style.width = `${(scrollTop / height) * 100}%`;
});

/* REVEAL */
const reveals = document.querySelectorAll(".reveal");
const revealOnScroll = () => {
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < windowHeight - 100) {
      el.classList.add("active");
    }
  });
};
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

/* THEME TOGGLE */
const toggle = document.getElementById("themeToggle");
if (localStorage.theme === "light") {
  document.body.classList.add("light");
  toggle.textContent = "☀️";
}

toggle.onclick = () => {
  const isLight = document.body.classList.toggle("light");
  toggle.textContent = isLight ? "☀️" : "🌙";
  localStorage.theme = isLight ? "light" : "dark";
};

/* MODAL */
const modal = document.getElementById("modal");
const titleEl = document.getElementById("modalTitle");
const descEl = document.getElementById("modalDesc");

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    titleEl.textContent = card.querySelector("h3").textContent;
    descEl.textContent = card.querySelector("p").textContent;
    modal.classList.add("show");
  });
});

function closeModal() {
  modal.classList.remove("show");
}
