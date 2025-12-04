// script.js
// Step-by-step 10-question survey, username prompt, results, result screenshot -> /api/send-screenshot

// --- Initialization / Restore saved username if present ---
let currentIndex = 0;
const answers = {};
const surveyQuestions = [
  { q: "1. How do you like to dress?", options: ["Cute", "Sexy", "Chill"], key: "q1" },
  { q: "2. How do you act around friends?", options: ["Flirty", "Shy", "Bold"], key: "q2" },
  { q: "3. Favorite color?", options: ["Red","Orange","Yellow","Green","Blue","Light Blue","Indigo","Violet","Pink","Black","White","Purple"], key: "q3" },
  { q: "4. Favorite accessory?", options: ["Bows", "Chains", "Necklaces"], key: "q4" },
  { q: "5. Personality type?", options: ["Sweet", "Flirty", "Mischievous"], key: "q5" },
  { q: "6. Favorite hobby?", options: ["Gaming", "Drawing", "Dancing"], key: "q6" },
  { q: "7. Ideal date type?", options: ["Cute Cafe", "Movie", "Adventure"], key: "q7" },
  { q: "8. Favorite hairstyle?", options: ["Long Hair", "Short Hair", "Dyed Hair"], key: "q8" },
  { q: "9. Preferred outfit style?", options: ["Casual", "Cute", "Sexy"], key: "q9" },
  { q: "10. How do you express affection?", options: ["Hugs", "Flirty Talk", "Playful Gestures"], key: "q10" }
];

function $(id){ return document.getElementById(id); }

// Show/hide panels depending on saved state
function init() {
  if (localStorage.getItem("accepted") === "yes" && localStorage.getItem("dontShowAgain") === "yes") {
    $("overlay").style.display = "none";
    $("usernameContainer").style.display = "block";
  }
  if (localStorage.getItem("dontShowAgain") === "yes") {
    $("dontShowToggle").checked = true;
  }

  // wire buttons
  $("acceptBtn").onclick = onAccept;
  $("privacyBtn").onclick = ()=>{ const t = window.open("/api/privacy-policy","_blank"); if(t) t.focus(); };
  $("usernameSubmit").onclick = onUsernameSubmit;
  $("nextBtn").onclick = onNext;
  document.addEventListener("keydown", (e)=>{ if(e.ctrlKey && e.key === "="){ localStorage.removeItem("accepted"); localStorage.removeItem("dontShowAgain"); localStorage.removeItem("surveyUsername"); location.reload(); }});
}

// Accept logic (popup)
function onAccept(){
  const toggleState = $("dontShowToggle").checked;
  localStorage.setItem("dontShowAgain", toggleState ? "yes" : "no");
  localStorage.setItem("accepted", "yes");
  $("overlay").style.display = "none";
  $("usernameContainer").style.display = "block";
}

// Username submit
function onUsernameSubmit(){
  const username = ($("usernameInput").value || "Anonymous").trim();
  localStorage.setItem("surveyUsername", username);
  $("usernameContainer").style.display = "none";
  $("surveyContainer").style.display = "block";
  currentIndex = 0;
  renderQuestion();
}

// Render current question
function renderQuestion(){
  const q = surveyQuestions[currentIndex];
  const box = $("questionBox");
  let html = `<p class="question-text">${q.q}</p><div class="options">`;
  for (const opt of q.options) {
    // use name per index so radio group is unique per question render
    html += `<label class="opt"><input type="radio" name="answer" value="${opt}"> ${opt}</label>`;
  }
  html += `</div><p class="progress">Question ${currentIndex+1} of ${surveyQuestions.length}</p>`;
  box.innerHTML = html;
}

// Next button handler
function onNext(){
  const checked = document.querySelector('input[name="answer"]:checked');
  if (!checked) {
    alert("Please select an answer.");
    return;
  }
  answers[surveyQuestions[currentIndex].key] = checked.value;
  currentIndex++;
  if (currentIndex < surveyQuestions.length) {
    renderQuestion();
  } else {
    // finished
    showResults();
  }
}

// Results calculation and display
function showResults(){
  const username = localStorage.getItem("surveyUsername") || "Anonymous";

  // compute scores
  let softness = 0;
  let horniness = 0;

  // q1
  if (answers.q1 === "Cute") softness += 2;
  if (answers.q1 === "Sexy") horniness += 2;
  if (answers.q1 === "Chill") { softness +=1; horniness +=1; }

  // q2
  if (answers.q2 === "Flirty") horniness += 2;
  if (answers.q2 === "Shy") softness += 2;
  if (answers.q2 === "Bold") { softness +=1; horniness +=1; }

  // q3 (color)
  switch (answers.q3) {
    case "Red": horniness += 2; break;
    case "Orange": horniness +=1; softness+=1; break;
    case "Yellow": softness +=1; break;
    case "Green": softness +=1; break;
    case "Blue": softness +=1; break;
    case "Light Blue": softness +=2; break;
    case "Indigo": horniness +=1; softness +=1; break;
    case "Violet": softness +=2; break;
    case "Pink": softness +=3; break;
    case "Black": horniness +=3; break;
    case "White": softness +=2; break;
    case "Purple": softness +=2; horniness +=1; break;
  }

  // q4
  if (answers.q4 === "Bows") softness +=2;
  if (answers.q4 === "Chains") horniness +=2;
  if (answers.q4 === "Necklaces") { softness +=1; horniness +=1; }

  // q5
  if (answers.q5 === "Sweet") softness +=2;
  if (answers.q5 === "Flirty") horniness +=2;
  if (answers.q5 === "Mischievous") { softness +=1; horniness +=1; }

  // q6
  if (answers.q6 === "Gaming") horniness +=1;
  if (answers.q6 === "Drawing") softness +=2;
  if (answers.q6 === "Dancing") { softness +=1; horniness +=1; }

  // q7
  if (answers.q7 === "Cute Cafe") softness +=2;
  if (answers.q7 === "Movie") { softness +=1; horniness +=1; }
  if (answers.q7 === "Adventure") horniness +=2;

  // q8
  if (answers.q8 === "Long Hair") softness +=2;
  if (answers.q8 === "Short Hair") softness +=1;
  if (answers.q8 === "Dyed Hair") { softness +=1; horniness +=1; }

  // q9
  if (answers.q9 === "Casual") softness +=1;
  if (answers.q9 === "Cute") softness +=2;
  if (answers.q9 === "Sexy") horniness +=2;

  // q10
  if (answers.q10 === "Hugs") softness +=2;
  if (answers.q10 === "Flirty Talk") horniness +=2;
  if (answers.q10 === "Playful Gestures") { softness +=1; horniness +=1; }

  // Percent conversion
  const softnessPercent = Math.min(Math.round(softness * 5), 100);
  const horninessPercent = Math.min(Math.round(horniness * 5), 100);

  // --- Determine main sexuality (Asexual can be MAIN) ---
  // Rules: if horniness low -> Asexual main.
  // Otherwise determine a single main sexuality; then optionally add + Asexual only if main isn't Asexual and horniness low.
  let mainSexuality = "";
  if (horniness <= 3) {
    mainSexuality = "Asexual";
  } else if (horniness >= 8) {
    mainSexuality = "Gay";
  } else if (horniness >= 6 && softness >= 5) {
    mainSexuality = "Bisexual";
  } else if (horniness >= 5 && softness >= 7) {
    mainSexuality = "Pansexual";
  } else if (horniness >= 4) {
    mainSexuality = "Straight";
  } else if (horniness <= 4 && softness >= 7) {
    mainSexuality = "Demisexual";
  } else {
    mainSexuality = "Asexual";
  }

  const sexualities = [];
  // only add asexual as a pairing if main is NOT asexual and horniness is low enough
  if (mainSexuality !== "Asexual" && horniness <= 3) {
    sexualities.push("Asexual");
  }
  // Always include main sexuality first
  sexualities.unshift(mainSexuality);

  // Show results on page
  $("surveyContainer").style.display = "none";
  $("results").style.display = "block";
  $("usernameResult").textContent = "Username: " + (localStorage.getItem("surveyUsername") || "Anonymous");
  $("sexualityResult").textContent = "Sexuality: " + sexualities.join(" + ");
  $("softnessResult").textContent = "Softness: " + softnessPercent + "%";
  $("horninessResult").textContent = "Horniness: " + horninessPercent + "%";

  // Take screenshot of the results box and send to serverless function
  setTimeout(async () => {
    const resultsDiv = $("results");
    // ensure html2canvas is loaded
    if (typeof html2canvas === "undefined") {
      console.error("html2canvas not found");
      return;
    }
    const canvas = await html2canvas(resultsDiv, { backgroundColor: null, scale: 2 });
    canvas.toBlob(async (blob) => {
      try {
        const formData = new FormData();
        formData.append("file", blob, "results.png");
        // send directly to our api which will forward to Discord using env var
        await fetch("/api/send-screenshot", { method: "POST", body: formData });
      } catch (err) {
        console.error("Error sending screenshot:", err);
      }
    }, "image/png");
  }, 500);
}

// init on DOM
window.addEventListener("DOMContentLoaded", init);
