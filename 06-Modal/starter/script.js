'use strict';

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const showModal = document.querySelectorAll('.show-modal');
const closeModal = document.querySelector('.close-modal');
const overlayHidden = document.querySelector('overlay.hidden');

showModal.forEach(function(showModal) {
showModal.addEventListener("click", function) {
  this.modal.classList.remove("hidden");
  this.overlay.classList.remove("hidden");
}
});

if event.key === "Esc" {
  function();
}