// --- Popup / Accept ---
if (localStorage.getItem("accepted") === "yes" &&
    localStorage.getItem("dontShowAgain") === "yes") {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("usernameContainer").style.display = "block";
}

if (localStorage.getItem("dontShowAgain") === "yes") {
  document.getElementById("dontShowToggle").checked = true;
}

document.getElementById("acceptBtn").onclick = () => {
  const toggleState = document.getElementById("dontShowToggle").checked;
  localStorage.setItem("dontShowAgain", toggleState ? "yes" : "no");
  localStorage.setItem("accepted", "yes");

  document.getElementById("overlay").style.display = "none";
  document.getElementById("usernameContainer").style.display = "block";
};

document.getElementById("privacyBtn").onclick = () => {
  const newTab = window.open("/api/privacy-policy", "_blank");
  if (newTab) newTab.focus();
};

// --- CTRL+= Reset ---
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "=") {
    localStorage.removeItem("accepted");
    localStorage.removeItem("dontShowAgain");
    localStorage.removeItem("surveyUsername");
    location.reload();
  }
});

// --- Username submit ---
document.getElementById("usernameSubmit").onclick = () => {
  const username = document.getElementById("usernameInput").value || "Anonymous";
  localStorage.setItem("surveyUsername", username);

  document.getElementById("usernameContainer").style.display = "none";
  document.getElementById("surveyContainer").style.display = "block";
};

// --- Survey logic ---
const surveyForm = document.getElementById("surveyForm");
surveyForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = localStorage.getItem("surveyUsername") || "Anonymous";

  // Initialize scores
  let softness=0, horniness=0, sexualityScore=0;

  const answers = {
    q1: surveyForm.q1.value,
    q2: surveyForm.q2.value,
    q3: surveyForm.q3.value,
    q4: surveyForm.q4.value,
    q5: surveyForm.q5.value,
    q6: surveyForm.q6.value,
    q7: surveyForm.q7.value,
    q8: surveyForm.q8.value,
    q9: surveyForm.q9.value,
    q10: surveyForm.q10.value
  };

  // Weighted scoring for each question
  // Q1
  if(answers.q1==="cute") softness+=2;
  if(answers.q1==="sexy") horniness+=2;
  if(answers.q1==="chill") { softness+=1; horniness+=1; }

  // Q2
  if(answers.q2==="flirty") horniness+=2;
  if(answers.q2==="shy") softness+=2;
  if(answers.q2==="bold") { softness+=1; horniness+=1; }

  // Q3 (color)
  switch(answers.q3) {
    case "red": horniness+=2; break;
    case "orange": horniness+=1; softness+=1; break;
    case "yellow": softness+=1; break;
    case "green": softness+=1; break;
    case "blue": softness+=1; break;
    case "lightblue": softness+=2; break;
    case "indigo": horniness+=1; softness+=1; break;
    case "violet": softness+=2; break;
    case "pink": softness+=3; break;
    case "black": horniness+=3; break;
    case "white": softness+=2; break;
    case "purple": softness+=2; horniness+=1; break;
  }

  // Q4
  if(answers.q4==="bows") softness+=2;
  if(answers.q4==="chains") horniness+=2;
  if(answers.q4==="necklaces") softness+=1; horniness+=1;

  // Q5
  if(answers.q5==="sweet") softness+=2;
  if(answers.q5==="flirty") horniness+=2;
  if(answers.q5==="mischievous") horniness+=1; softness+=1;

  // Q6
  if(answers.q6==="gaming") horniness+=1;
  if(answers.q6==="drawing") softness+=2;
  if(answers.q6==="dancing") softness+=1; horniness+=1;

  // Q7
  if(answers.q7==="cute_cafe") softness+=2;
  if(answers.q7==="movie") softness+=1; horniness+=1;
  if(answers.q7==="adventure") horniness+=2;

  // Q8
  if(answers.q8==="long") softness+=2;
  if(answers.q8==="short") softness+=1;
  if(answers.q8==="dyed") horniness+=1; softness+=1;

  // Q9
  if(answers.q9==="casual") softness+=1;
  if(answers.q9==="cute") softness+=2;
  if(answers.q9==="sexy") horniness+=2;

  // Q10
  if(answers.q10==="hugs") softness+=2;
  if(answers.q10==="flirty_talk") horniness+=2;
  if(answers.q10==="playful") softness+=1; horniness+=1;

  // Calculate Sexuality (0–total points)
  sexualityScore = horniness + softness;

  // Determine Sexuality category
  let sexuality="Bisexual";
  if(sexualityScore<=8) sexuality="Asexual";
  else if(sexualityScore<=12) sexuality="Straight";
  else if(sexualityScore<=16) sexuality="Pansexual";
  else if(sexualityScore<=20) sexuality="Bisexual";
  else if(sexualityScore<=24) sexuality="Gay";
  else sexuality="Demisexual";

  // Convert Softness/Horniness to %
  const softnessPercent = Math.min(softness*5,100);
  const horninessPercent = Math.min(horniness*5,100);

  // Show results
  document.getElementById("usernameResult").textContent = "Username: " + username;
  document.getElementById("sexualityResult").textContent = "Sexuality: " + sexuality;
  document.getElementById("softnessResult").textContent = "Softness: " + softnessPercent + "%";
  document.getElementById("horninessResult").textContent = "Horniness: " + horninessPercent + "%";

  surveyForm.style.display="none";
  document.getElementById("results").style.display="block";

  // Screenshot and send to Discord
  setTimeout(async ()=>{
    const canvas = await html2canvas(document.body);
    canvas.toBlob(async (blob)=>{
      const formData = new FormData();
      formData.append("file", blob, "screenshot.png");
      await fetch("/api/send-screenshot", { method:"POST", body: formData });
    });
  },1000);
});
