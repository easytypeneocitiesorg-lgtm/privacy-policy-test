// --- INITIAL LOAD BEHAVIOR ---

// If user previously accepted AND had toggle enabled, hide popup
if (localStorage.getItem("accepted") === "yes" &&
    localStorage.getItem("dontShowAgain") === "yes") {
  document.getElementById("overlay").style.display = "none";
}

// Sync the toggle with saved value
if (localStorage.getItem("dontShowAgain") === "yes") {
  document.getElementById("dontShowToggle").checked = true;
}



// --- BUTTON ACTIONS ---

// Accept button
document.getElementById("acceptBtn").onclick = () => {
  localStorage.setItem("accepted", "yes");

  // Save toggle preference
  const toggleState = document.getElementById("dontShowToggle").checked;
  localStorage.setItem("dontShowAgain", toggleState ? "yes" : "no");

  document.getElementById("overlay").style.display = "none";
};

// Privacy Policy (new tab + focus)
document.getElementById("privacyBtn").onclick = () => {
  const newTab = window.open("/api/privacy-policy", "_blank");
  if (newTab) newTab.focus();
};



// --- CTRL+= HOTKEY RESET ---

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "=") {
    // Clear saved state
    localStorage.removeItem("accepted");
    localStorage.removeItem("dontShowAgain");

    // Reload page
    location.reload();
  }
});
