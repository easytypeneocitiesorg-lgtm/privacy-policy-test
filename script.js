document.getElementById("acceptBtn").onclick = () => {
  document.getElementById("overlay").style.display = "none";
};

document.getElementById("privacyBtn").onclick = () => {
  window.location.href = "/api/privacy-policy";
};
