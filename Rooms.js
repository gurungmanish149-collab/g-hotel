const track = document.getElementById("roomsTrack");
const slides = document.querySelectorAll(".room-slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let index = 0;

function updateSlide() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

nextBtn.addEventListener("click", () => {
  index = (index + 1) % slides.length;
  updateSlide();
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length;
  updateSlide();
});