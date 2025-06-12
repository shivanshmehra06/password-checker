const passwordInput = document.getElementById("password");
const strengthText = document.getElementById("strength");

passwordInput.addEventListener("input", async () => {
  const pwd = passwordInput.value;

  const lengthCheck = pwd.length >= 8;
  const upperCheck = /[A-Z]/.test(pwd);
  const lowerCheck = /[a-z]/.test(pwd);
  const numberCheck = /[0-9]/.test(pwd);
  const specialCheck = /[^A-Za-z0-9]/.test(pwd);

  document.getElementById("length").style.color = lengthCheck ? "lightgreen" : "red";
  document.getElementById("uppercase").style.color = upperCheck ? "lightgreen" : "red";
  document.getElementById("lowercase").style.color = lowerCheck ? "lightgreen" : "red";
  document.getElementById("number").style.color = numberCheck ? "lightgreen" : "red";
  document.getElementById("special").style.color = specialCheck ? "lightgreen" : "red";

  const score = [lengthCheck, upperCheck, lowerCheck, numberCheck, specialCheck].filter(Boolean).length;

  if (pwd.length > 0) {
    const isBreached = await checkPasswordBreach(pwd);
    if (isBreached) {
      strengthText.textContent = "❌ Breached Password (Very Weak)";
      strengthText.style.color = "red";
      return;
    }
  }

  if (score <= 2) {
    strengthText.textContent = "Weak";
    strengthText.style.color = "orange";
  } else if (score <= 4) {
    strengthText.textContent = "Medium";
    strengthText.style.color = "yellow";
  } else {
    strengthText.textContent = "Strong";
    strengthText.style.color = "lightgreen";
  }
});

// SHA-1 hash helper
async function sha1(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

// Check password in HaveIBeenPwned API
async function checkPasswordBreach(password) {
  const hash = await sha1(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  try {
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await response.text();
    return text.includes(suffix);
  } catch (error) {
    console.error("Error checking password breach:", error);
    return false;
  }
}
