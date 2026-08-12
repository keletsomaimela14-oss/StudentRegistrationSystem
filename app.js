"use strict";

const form = document.querySelector("#registrationForm");
const message = document.querySelector("#message");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const studentNumber = document.querySelector("#studentNumber").value.trim();
    const studentName = document.querySelector("#studentName").value.trim();
    const studentEmail = document.querySelector("#studentEmail").value.trim();
    const moduleCode = document.querySelector("#module").value;

    if (!studentNumber || !studentName || !studentEmail || !moduleCode) {
        message.textContent = "Complete all required fields.";
        return;
    }

    message.textContent =
        `${studentName} (${studentNumber}) registered for ${moduleCode}.`;
    form.reset();
});