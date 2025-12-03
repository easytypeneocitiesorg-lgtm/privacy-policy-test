// --- Popup / Accept ---
if(localStorage.getItem("accepted")==="yes" &&
   localStorage.getItem("dontShowAgain")==="yes"){
  document.getElementById("overlay").style.display="none";
  document.getElementById("usernameContainer").style.display="block";
}

if(localStorage.getItem("dontShowAgain")==="yes"){
  document.getElementById("dontShowToggle").checked=true;
}

document.getElementById("acceptBtn").onclick = ()=>{
  const toggleState=document.getElementById("dontShowToggle").checked;
  localStorage.setItem("dontShowAgain",toggleState?"yes":"no");
  localStorage.setItem("accepted","yes");
  document.getElementById("overlay").style.display="none";
  document.getElementById("usernameContainer").style.display="block";
};

document.getElementById("privacyBtn").onclick = ()=>{
  const newTab=window.open("/api/privacy-policy","_blank");
  if(newTab) newTab.focus();
};

// --- CTRL+= Reset ---
document.addEventListener("keydown",(e)=>{
  if(e.ctrlKey && e.key==="="){
    localStorage.removeItem("accepted");
    localStorage.removeItem("dontShowAgain");
    localStorage.removeItem("surveyUsername");
    location.reload();
  }
});

// --- Username submit ---
document.getElementById("usernameSubmit").onclick = ()=>{
  const username=document.getElementById("usernameInput").value||"Anonymous";
  localStorage.setItem("surveyUsername",username);
  document.getElementById("usernameContainer").style.display="none";
  document.getElementById("surveyContainer").style.display="block";
  startSurvey();
};

// --- Survey Data ---
const surveyQuestions=[
  {q:"How do you like to dress?", options:["Cute","Sexy","Chill"], key:"q1"},
  {q:"How do you act around friends?", options:["Flirty","Shy","Bold"], key:"q2"},
  {q:"Favorite color?", options:["Red","Orange","Yellow","Green","Blue","Light Blue","Indigo","Violet","Pink","Black","White","Purple"], key:"q3"},
  {q:"Favorite accessory?", options:["Bows","Chains","Necklaces"], key:"q4"},
  {q:"Personality type?", options:["Sweet","Flirty","Mischievous"], key:"q5"},
  {q:"Favorite hobby?", options:["Gaming","Drawing","Dancing"], key:"q6"},
  {q:"Ideal date type?", options:["Cute Cafe","Movie","Adventure"], key:"q7"},
  {q:"Favorite hairstyle?", options:["Long Hair","Short Hair","Dyed Hair"], key:"q8"},
  {q:"Preferred outfit style?", options:["Casual","Cute","Sexy"], key:"q9"},
  {q:"How do you express affection?", options:["Hugs","Flirty Talk","Playful Gestures"], key:"q10"}
];

let currentIndex=0;
let answers={};

function startSurvey(){
  showQuestion();
}

function showQuestion(){
  const questionBox=document.getElementById("questionBox");
  const q=surveyQuestions[currentIndex];
  questionBox.innerHTML=`<p>${q.q}</p>` + q.options.map(opt=>`<label><input type="radio" name="q" value="${opt}"> ${opt}</label>`).join("<br>");
}

document.getElementById("nextBtn").onclick=()=>{
  const selected=document.querySelector('input[name="q"]:checked');
  if(!selected) return alert("Please select an answer");
  answers[surveyQuestions[currentIndex].key]=selected.value;
  currentIndex++;
  if(currentIndex<surveyQuestions.length) showQuestion();
  else showResults();
};

// --- Results ---
function showResults(){
  const username=localStorage.getItem("surveyUsername")||"Anonymous";
  let softness=0,horniness=0;
  let sexualities=[];

  // Scoring logic
  if(answers.q1==="Cute") softness+=2;
  if(answers.q1==="Sexy") horniness+=2;
  if(answers.q1==="Chill"){softness+=1;horniness+=1;}

  if(answers.q2==="Flirty") horniness+=2;
  if(answers.q2==="Shy") softness+=2;
  if(answers.q2==="Bold"){softness+=1;horniness+=1;}

  switch(answers.q3){
    case"Red":horniness+=2; break;
    case"Orange":horniness+=1; softness+=1; break;
    case"Yellow":softness+=1; break;
    case"Green":softness+=1; break;
    case"Blue":softness+=1; break;
    case"Light Blue":softness+=2; break;
    case"Indigo":horniness+=1;softness+=1; break;
    case"Violet":softness+=2; break;
    case"Pink":softness+=3; break;
    case"Black":horniness+=3; break;
    case"White":softness+=2; break;
    case"Purple":softness+=2;horniness+=1; break;
  }

  if(answers.q4==="Bows") softness+=2;
  if(answers.q4==="Chains") horniness+=2;
  if(answers.q4==="Necklaces") softness+=1;horniness+=1;

  if(answers.q5==="Sweet") softness+=2;
  if(answers.q5==="Flirty") horniness+=2;
  if(answers.q5==="Mischievous") softness+=1;horniness+=1;

  if(answers.q6==="Gaming") horniness+=1;
  if(answers.q6==="Drawing") softness+=2;
  if(answers.q6==="Dancing") softness+=1;horniness+=1;

  if(answers.q7==="Cute Cafe") softness+=2;
  if(answers.q7==="Movie") softness+=1;horniness+=1;
  if(answers.q7==="Adventure") horniness+=2;

  if(answers.q8==="Long Hair") softness+=2;
  if(answers.q8==="Short Hair") softness+=1;
  if(answers.q8==="Dyed Hair") softness+=1;horniness+=1;

  if(answers.q9==="Casual") softness+=1;
  if(answers.q9==="Cute") softness+=2;
  if(answers.q9==="Sexy") horniness+=2;

  if(answers.q10==="Hugs") softness+=2;
  if(answers.q10==="Flirty Talk") horniness+=2;
  if(answers.q10==="Playful Gestures") softness+=1;horniness+=1;

  // Multi-sexuality logic
  if(horniness>=4) sexualities.push("Straight");
  if(horniness>=6) sexualities.push("Gay");
  if(horniness>=5 && softness>=5) sexualities.push("Bisexual");
  if(horniness>=3 && softness>=3) sexualities.push("Pansexual");
  if(horniness<=3) sexualities.push("Asexual");
  if(softness>=7 && horniness<=4) sexualities.push("Demisexual");

  const softnessPercent=Math.min(softness*5,100);
  const horninessPercent=Math.min(horniness*5,100);

  document.getElementById("surveyContainer").style.display="none";
  document.getElementById("results").style.display="block";
  document.getElementById("usernameResult").textContent="Username: "+username;
  document.getElementById("sexualityResult").textContent="Sexuality: "+sexualities.join(", ");
  document.getElementById("softnessResult").textContent="Softness: "+softnessPercent+"%";
  document.getElementById("horninessResult").textContent="Horniness: "+horninessPercent+"%";

  // Screenshot to Discord
  setTimeout(async()=>{
    const canvas=await html2canvas(document.body);
    canvas.toBlob(async(blob)=>{
      const formData=new FormData();
      formData.append("file",blob,"screenshot.png");
      await fetch("/api/send-screenshot",{method:"POST",body:formData});
    });
  },1000);
}
