const form = document.querySelector("#registration-form");
const message = document.querySelector("#message");
const participantList = document.querySelector("#participant-list");
const statsDiv = document.querySelector("#stats");

const participants = [];

function validateForm(name, email, age, technology, terms) {
  if (name.trim() === "") return "Full name is required.";
  if (!email.includes("@") || !email.includes(".")) return "Email is invalid.";
  if (age <= 0 || isNaN(age)) return "Age must be greater than 0.";
  if (age < 18) return "Age must be at least 18.";
  if (technology === "") return "Please select a technology.";
  if (!terms) return "You must accept the terms.";
  return null;
}

function createParticipant(name, email, age, technology) {
  return { name, email, age: Number(age), technology };
}

function renderParticipants() {
  if (participants.length === 0) {
    participantList.innerHTML = "";
    statsDiv.classList.add("hidden");
    return;
  }

  let html = `<h2>Participants (${participants.length})</h2>`;

  participants.forEach(function (p, index) {
    html += `
      <div class="participant-card">
        <div class="participant-info">
          <strong>${p.name}</strong><br/>
          ${p.email} · ${p.technology} · Age: ${p.age}
        </div>
        <button class="btn-delete" data-index="${index}">Delete</button>
      </div>
    `;
  });

  participantList.innerHTML = html;

  document.querySelectorAll(".btn-delete").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const i = Number(btn.getAttribute("data-index"));
      participants.splice(i, 1);
      renderParticipants();
      renderStats();
    });
  });

  renderStats();
}

function renderStats() {
  if (participants.length === 0) {
    statsDiv.classList.add("hidden");
    return;
  }

  const total = participants.length;
  const avgAge = (
    participants.reduce(function (sum, p) {
      return sum + p.age;
    }, 0) / total
  ).toFixed(1);

  const techCount = {};
  participants.forEach(function (p) {
    techCount[p.technology] = (techCount[p.technology] || 0) + 1;
  });

  const mostPopular = Object.keys(techCount).reduce(function (a, b) {
    return techCount[a] > techCount[b] ? a : b;
  });

  statsDiv.innerHTML = `
    <h3>Statistics</h3>
    <p>Total participants: <strong>${total}</strong></p>
    <p>Average age: <strong>${avgAge}</strong></p>
    <p>Most popular technology: <strong>${mostPopular}</strong></p>
  `;

  statsDiv.classList.remove("hidden");
}

function clearForm() {
  form.reset();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const age = document.querySelector("#age").value;
  const technology = document.querySelector("#technology").value;
  const terms = document.querySelector("#terms").checked;

  const error = validateForm(name, email, age, technology, terms);

  message.className = "message";

  if (error) {
    message.textContent = error;
    message.classList.add("error");
    return;
  }

  const participant = createParticipant(name, email, age, technology);
  participants.push(participant);

  message.textContent = `${name} has been registered for the event. Technology: ${technology} · Age: ${age}`;
  message.classList.add("success");

  clearForm();
  renderParticipants();
});
