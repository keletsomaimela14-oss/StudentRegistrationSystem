"use strict";

const form = document.querySelector("#registrationForm");
const message = document.querySelector("#message");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const studentNumber = document.querySelector("#studentNumber").value.trim();
  const studentName = document.querySelector("#studentName").value.trim();
  const studentEmail = document.querySelector("#studentEmail").value.trim();
  const moduleCode = document.querySelector("#module").value;

  if (!studentNumber || !studentName || !studentEmail || !moduleCode) {
    showMessage("Complete all required fields.", "error");
    return;
  }

  if (!EMAIL_PATTERN.test(studentEmail)) {
    showMessage("Enter a valid email address.", "error");
    return;
  }

  showMessage(
    `${studentName} (${studentNumber}, ${studentEmail}) registered for ${moduleCode}.`,
    "success"
  );
  form.reset();
});

function showMessage(text, type) {
  message.textContent = text;
  message.classList.remove("error", "success");
  message.classList.add(type);
}